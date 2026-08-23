package com.propnest.duskhollow.render

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.BlendMode
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Paint
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.drawIntoCanvas
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.IntSize
import com.propnest.duskhollow.core.GameWorld
import com.propnest.duskhollow.core.Noise
import com.propnest.duskhollow.core.Phase
import com.propnest.duskhollow.core.StalkerState
import com.propnest.duskhollow.core.Vec2
import com.propnest.duskhollow.core.clamp
import com.propnest.duskhollow.core.lerp
import kotlin.math.PI
import kotlin.math.sin

/** How many tiles fit across the narrow side of the screen. */
private const val VIEW_TILES = 12.5f

/**
 * Draws one frame of the game. Order matters: the world is painted in full, then
 * darkness is laid over it with holes punched where light reaches, then the screen
 * effects go on top.
 */
fun DrawScope.drawGame(
    world: GameWorld,
    fx: Effects,
    grain: GrainFrames,
    grainFrame: Int,
) {
    val pxPerTile = minOf(size.width, size.height) / VIEW_TILES
    val shake = Vec2(fx.shakeX, fx.shakeY)
    val camera = Camera(world.player.pos + shake, pxPerTile, size)

    // The lantern hangs off the player's leading side, so the light leads the walk.
    val lanternOffset = world.player.facing * 0.36f
    val bob = sin(fx.time * 5.4f) * 0.05f
    val lanternPos = world.player.pos + lanternOffset + Vec2(0f, bob)
    val lightRadius = world.lightRadius * fx.flicker
    val lightCenter = camera.toScreen(lanternPos)
    val lightRadiusPx = lightRadius * pxPerTile

    drawRect(Palette.Night)

    drawTiles(world, camera, lanternPos, lightRadius)
    drawRipples(world, fx, camera)
    drawExitMarker(world, fx, camera)
    drawBeacons(world, fx, camera)
    drawStalkerBody(world, fx, camera)
    drawPlayer(world, fx, camera, lanternPos)
    drawMotes(fx, camera, lanternPos, lightRadius)

    drawDarkness(world, camera, lightCenter, lightRadiusPx, fx)

    // Painted after darkness so they burn through it: the only thing you see of the
    // stalker until it is right on top of you.
    drawStalkerEyes(world, fx, camera)
    drawLanternCore(lightCenter, lightRadiusPx, fx)

    drawVignette(world, fx)
    drawGrain(grain, grainFrame, world, fx)
    drawJolt(fx)
}

private fun DrawScope.drawTiles(
    world: GameWorld,
    camera: Camera,
    lightPos: Vec2,
    lightRadius: Float,
) {
    val level = world.level
    val bounds = camera.visibleTiles()
    val tile = camera.pxPerTile
    val lip = tile * 0.16f

    for (ty in bounds[1]..bounds[3]) {
        for (tx in bounds[0]..bounds[2]) {
            if (tx < 0 || ty < 0 || tx >= level.width || ty >= level.height) continue
            if (!world.discovered[ty * level.width + tx]) continue

            val topLeft = camera.toScreen(tx.toFloat(), ty.toFloat())
            val center = Vec2(tx + 0.5f, ty + 0.5f)
            // Falls off with distance so the maze fades into the dark rather than
            // ending at a hard circle.
            val reach = clamp(1f - lightPos.distanceTo(center) / (lightRadius + 2.5f), 0f, 1f)
            val glow = reach * reach

            if (level.isWall(tx, ty)) {
                drawRect(
                    color = lerpColor(Palette.WallDark, Palette.WallLit, glow),
                    topLeft = topLeft,
                    size = Size(tile + 1f, tile + 1f),
                )
                // A lit upper edge fakes just enough relief to read as a wall.
                drawRect(
                    color = lerpColor(Palette.WallDark, Palette.WallTop, glow),
                    topLeft = topLeft,
                    size = Size(tile + 1f, lip),
                )
            } else {
                drawRect(
                    color = lerpColor(Palette.FloorDark, Palette.FloorLit, glow * 0.85f),
                    topLeft = topLeft,
                    size = Size(tile + 1f, tile + 1f),
                )
            }
        }
    }
}

private fun DrawScope.drawRipples(world: GameWorld, fx: Effects, camera: Camera) {
    for (ripple in fx.ripples) {
        val p = ripple.progress
        val radius = lerp(0.1f, 0.85f, p) * camera.pxPerTile
        drawCircle(
            color = Palette.Lantern.copy(alpha = (1f - p) * 0.16f),
            radius = radius,
            center = camera.toScreen(ripple.pos),
            style = Stroke(width = camera.pxPerTile * 0.03f),
        )
    }
}

private fun DrawScope.drawExitMarker(world: GameWorld, fx: Effects, camera: Camera) {
    val open = world.allBeaconsLit
    val center = camera.toScreen(world.exit)
    val tile = camera.pxPerTile
    val pulse = 0.5f + 0.5f * sin(fx.time * (if (open) 3.4f else 1.2f))

    val color = if (open) Palette.Exit else Palette.Muted
    val alpha = if (open) 0.35f + pulse * 0.45f else 0.12f

    drawCircle(
        color = color.copy(alpha = alpha),
        radius = tile * (0.34f + pulse * 0.07f),
        center = center,
        style = Stroke(width = tile * 0.06f),
    )
    if (open) {
        drawCircle(
            brush = Brush.radialGradient(
                0f to Palette.Exit.copy(alpha = 0.5f * pulse),
                1f to Color.Transparent,
                center = center,
                radius = tile * 1.6f,
            ),
            radius = tile * 1.6f,
            center = center,
        )
    }
}

private fun DrawScope.drawBeacons(world: GameWorld, fx: Effects, camera: Camera) {
    val tile = camera.pxPerTile
    for ((index, beacon) in world.beacons.withIndex()) {
        val center = camera.toScreen(beacon.pos)
        if (center.x < -tile * 3 || center.x > size.width + tile * 3) continue
        if (center.y < -tile * 3 || center.y > size.height + tile * 3) continue

        // Plinth.
        drawCircle(
            color = Palette.WallDark,
            radius = tile * 0.3f,
            center = center,
        )
        drawCircle(
            color = if (beacon.lit) Palette.Ember else Palette.Muted.copy(alpha = 0.4f),
            radius = tile * 0.3f,
            center = center,
            style = Stroke(width = tile * 0.05f),
        )

        if (beacon.lit) {
            drawFlame(center, tile * 0.55f, fx, seed = index * 31, intensity = 1f)
            drawCircle(
                brush = Brush.radialGradient(
                    0f to Palette.Lantern.copy(alpha = 0.4f),
                    1f to Color.Transparent,
                    center = center,
                    radius = tile * 2.4f,
                ),
                radius = tile * 2.4f,
                center = center,
            )
        } else {
            // A dying ember, plus the ring that fills while it is being lit.
            drawCircle(
                color = Palette.Ember.copy(alpha = 0.35f + 0.25f * sin(fx.time * 1.7f + index)),
                radius = tile * 0.1f,
                center = center,
            )
            if (beacon.progress > 0f) {
                drawArc(
                    color = Palette.Lantern,
                    startAngle = -90f,
                    sweepAngle = 360f * beacon.progress,
                    useCenter = false,
                    topLeft = Offset(center.x - tile * 0.42f, center.y - tile * 0.42f),
                    size = Size(tile * 0.84f, tile * 0.84f),
                    style = Stroke(width = tile * 0.08f),
                )
                drawFlame(center, tile * 0.4f * beacon.progress, fx, seed = index * 31, intensity = beacon.progress)
            }
        }
    }
}

/** A few stacked teardrops jittered by noise; cheap, and it never repeats. */
private fun DrawScope.drawFlame(
    center: Offset,
    height: Float,
    fx: Effects,
    seed: Int,
    intensity: Float,
) {
    val layers = 3
    for (i in 0 until layers) {
        val t = i / (layers - 1f)
        val wobble = (Noise.fbm(fx.time * 6f + i * 3.1f, 2, seed + i) - 0.5f)
        val h = height * lerp(1f, 0.45f, t)
        val w = height * lerp(0.42f, 0.18f, t)
        val cx = center.x + wobble * height * 0.22f
        val cy = center.y - h * 0.45f

        val path = Path().apply {
            moveTo(cx, cy - h * 0.55f)
            cubicTo(cx + w, cy - h * 0.1f, cx + w * 0.75f, cy + h * 0.45f, cx, cy + h * 0.5f)
            cubicTo(cx - w * 0.75f, cy + h * 0.45f, cx - w, cy - h * 0.1f, cx, cy - h * 0.55f)
            close()
        }
        val color = if (i == layers - 1) Palette.LanternCore else Palette.Lantern
        drawPath(path, color.copy(alpha = (0.55f + 0.45f * t) * intensity))
    }
}

private fun DrawScope.drawPlayer(world: GameWorld, fx: Effects, camera: Camera, lanternPos: Vec2) {
    val tile = camera.pxPerTile
    val center = camera.toScreen(world.player.pos)
    val facing = world.player.facing
    val stride = if (world.player.moving) sin(fx.time * if (world.player.sprinting) 14f else 9f) else 0f

    // Shadow.
    drawCircle(
        color = Color.Black.copy(alpha = 0.45f),
        radius = tile * 0.3f,
        center = Offset(center.x, center.y + tile * 0.06f),
    )
    // Cloak, squashed along the direction of travel so the walk reads at a glance.
    drawCircle(
        color = Color(0xFF171C27),
        radius = tile * 0.26f,
        center = center,
    )
    drawCircle(
        color = Color(0xFF232B3A),
        radius = tile * 0.17f,
        center = Offset(
            center.x + facing.x * tile * 0.05f + stride * tile * 0.02f,
            center.y + facing.y * tile * 0.05f,
        ),
    )
    // Lantern in hand.
    val lantern = camera.toScreen(lanternPos)
    drawCircle(color = Palette.LanternCore, radius = tile * 0.075f, center = lantern)
}

private fun DrawScope.drawMotes(fx: Effects, camera: Camera, lightPos: Vec2, lightRadius: Float) {
    for (mote in fx.motes) {
        val d = mote.pos.distanceTo(lightPos)
        if (d > lightRadius) continue
        val fade = (1f - d / lightRadius) * (0.35f + 0.35f * sin(fx.time * 2f + mote.phase))
        if (fade <= 0f) continue
        drawCircle(
            color = Palette.LanternCore.copy(alpha = clamp(fade, 0f, 1f) * 0.5f),
            radius = mote.size * camera.pxPerTile,
            center = camera.toScreen(mote.pos),
        )
    }
}

/**
 * One black layer with the light holes cut out of it. Kept slightly translucent so
 * already-explored corridors stay faintly readable instead of vanishing.
 */
private fun DrawScope.drawDarkness(
    world: GameWorld,
    camera: Camera,
    lightCenter: Offset,
    lightRadiusPx: Float,
    fx: Effects,
) {
    val paint = Paint()
    drawIntoCanvas { canvas ->
        canvas.saveLayer(Rect(Offset.Zero, size), paint)
        drawRect(Palette.Night.copy(alpha = 0.955f))

        punchLight(lightCenter, lightRadiusPx)
        for (beacon in world.beacons) {
            if (!beacon.lit) continue
            val c = camera.toScreen(beacon.pos)
            punchLight(c, camera.pxPerTile * 2.6f)
        }
        if (world.allBeaconsLit) {
            punchLight(camera.toScreen(world.exit), camera.pxPerTile * 2.0f)
        }
        canvas.restore()
    }
}

private fun DrawScope.punchLight(center: Offset, radius: Float) {
    if (radius <= 0f) return
    drawCircle(
        brush = Brush.radialGradient(
            0f to Color.Black,
            0.45f to Color.Black.copy(alpha = 0.94f),
            0.78f to Color.Black.copy(alpha = 0.5f),
            1f to Color.Transparent,
            center = center,
            radius = radius,
        ),
        radius = radius,
        center = center,
        blendMode = BlendMode.DstOut,
    )
}

private fun DrawScope.drawLanternCore(center: Offset, radius: Float, fx: Effects) {
    drawCircle(
        brush = Brush.radialGradient(
            0f to Palette.LanternCore.copy(alpha = 0.5f * fx.flicker),
            0.35f to Palette.Lantern.copy(alpha = 0.16f * fx.flicker),
            1f to Color.Transparent,
            center = center,
            radius = radius * 0.75f,
        ),
        radius = radius * 0.75f,
        center = center,
    )
}

private fun DrawScope.drawVignette(world: GameWorld, fx: Effects) {
    val pulse = fx.heartbeatPulse() * (0.25f + world.fear * 0.75f)
    val radius = minOf(size.width, size.height) * lerp(0.95f, 0.62f, clamp(world.fear + pulse * 0.25f, 0f, 1f))
    val center = Offset(size.width / 2f, size.height / 2f)

    drawRect(
        brush = Brush.radialGradient(
            0f to Color.Transparent,
            0.55f to Color.Transparent,
            1f to Color.Black.copy(alpha = 0.55f + world.fear * 0.35f),
            center = center,
            radius = radius,
        ),
    )
    // At high fear the edges bleed red in time with the heartbeat.
    if (world.fear > 0.35f) {
        drawRect(
            brush = Brush.radialGradient(
                0f to Color.Transparent,
                0.6f to Color.Transparent,
                1f to Palette.Blood.copy(alpha = (world.fear - 0.35f) * 0.5f * (0.4f + pulse * 0.6f)),
                center = center,
                radius = radius * 1.05f,
            ),
        )
    }
}

private fun DrawScope.drawGrain(grain: GrainFrames, frameIndex: Int, world: GameWorld, fx: Effects) {
    val image = grain.frameAt(frameIndex)
    val alpha = clamp(0.05f + world.fear * 0.16f + fx.jolt * 0.25f, 0f, 0.5f)
    drawImage(
        image = image,
        dstOffset = IntOffset.Zero,
        dstSize = IntSize(size.width.toInt(), size.height.toInt()),
        alpha = alpha,
    )
}

private fun DrawScope.drawJolt(fx: Effects) {
    if (fx.jolt <= 0.01f) return
    drawRect(Palette.Blood.copy(alpha = fx.jolt * 0.32f))
}

// ---------------------------------------------------------------------------
// The stalker
// ---------------------------------------------------------------------------

/**
 * Limbs are drawn from a walk phase rather than keyframes, so the gait speeds up
 * with the chase and never loops visibly. Hidden inside the darkness layer until
 * the light finds it.
 */
private fun DrawScope.drawStalkerBody(world: GameWorld, fx: Effects, camera: Camera) {
    val stalker = world.stalker
    if (stalker.state == StalkerState.DORMANT) return

    val tile = camera.pxPerTile
    val center = camera.toScreen(stalker.pos)
    if (center.x < -tile * 4 || center.x > size.width + tile * 4) return
    if (center.y < -tile * 4 || center.y > size.height + tile * 4) return

    val chasing = stalker.state == StalkerState.CHASE
    val gait = fx.time * (if (chasing) 13f else 6f)
    val lean = if (chasing) 0.12f else 0.04f

    // Smeared afterimages while hunting.
    if (chasing) {
        for (i in 1..2) {
            val back = stalker.pos - stalker.facing * (0.12f * i)
            drawStalkerSilhouette(
                camera.toScreen(back), tile, gait - i * 0.5f, lean, stalker.facing,
                alpha = 0.16f / i,
            )
        }
    }

    drawStalkerSilhouette(center, tile, gait, lean, stalker.facing, alpha = 1f)
}

private fun DrawScope.drawStalkerSilhouette(
    center: Offset,
    tile: Float,
    gait: Float,
    lean: Float,
    facing: Vec2,
    alpha: Float,
) {
    val ink = Color(0xFF04050A).copy(alpha = alpha)
    val edge = Color(0xFF161C2A).copy(alpha = alpha)
    val height = tile * 1.15f
    val hipY = center.y + height * 0.16f
    val shoulderY = center.y - height * 0.30f
    val headY = center.y - height * 0.52f
    val leanX = facing.x * tile * lean

    // Shadow pooled under it.
    drawCircle(Color.Black.copy(alpha = 0.5f * alpha), tile * 0.36f, Offset(center.x, center.y + tile * 0.1f))

    // Legs and arms, swinging in opposition.
    val swing = sin(gait) * tile * 0.3f
    val counter = sin(gait + PI.toFloat()) * tile * 0.3f
    val limb = Stroke(width = tile * 0.085f)

    drawLine(ink, Offset(center.x, hipY), Offset(center.x + swing, hipY + height * 0.42f), limb.width)
    drawLine(ink, Offset(center.x, hipY), Offset(center.x + counter, hipY + height * 0.42f), limb.width)
    drawLine(
        ink,
        Offset(center.x + leanX, shoulderY),
        Offset(center.x + counter * 1.25f + leanX, shoulderY + height * 0.5f),
        limb.width * 0.85f,
    )
    drawLine(
        ink,
        Offset(center.x + leanX, shoulderY),
        Offset(center.x + swing * 1.25f + leanX, shoulderY + height * 0.5f),
        limb.width * 0.85f,
    )

    // Torso: a narrow wedge from hips to shoulders.
    val torso = Path().apply {
        moveTo(center.x - tile * 0.13f, hipY)
        lineTo(center.x - tile * 0.17f + leanX, shoulderY)
        lineTo(center.x + tile * 0.17f + leanX, shoulderY)
        lineTo(center.x + tile * 0.13f, hipY)
        close()
    }
    drawPath(torso, ink)
    drawPath(torso, edge, style = Stroke(width = tile * 0.02f))

    // Head, tilted a little off true.
    val tilt = sin(gait * 0.5f) * tile * 0.03f
    drawCircle(ink, tile * 0.115f, Offset(center.x + leanX * 1.4f + tilt, headY))
}

/** Eyes are drawn on top of the darkness, so they hang in the black. */
private fun DrawScope.drawStalkerEyes(world: GameWorld, fx: Effects, camera: Camera) {
    val stalker = world.stalker
    if (stalker.state == StalkerState.DORMANT) return
    if (world.phase != Phase.PLAYING) return

    val tile = camera.pxPerTile
    val center = camera.toScreen(stalker.pos)
    if (center.x < -tile * 4 || center.x > size.width + tile * 4) return
    if (center.y < -tile * 4 || center.y > size.height + tile * 4) return

    // Only meets your eyes when it has actually noticed you.
    val looking = stalker.state == StalkerState.CHASE
    val distance = world.player.pos.distanceTo(stalker.pos)
    val nearness = clamp(1f - distance / 10f, 0f, 1f)
    val intensity = (if (looking) 0.85f else 0.28f) * nearness
    if (intensity <= 0.02f) return

    val blink = if (Noise.value(fx.time * 2.2f, 71) > 0.93f) 0.25f else 1f
    val headY = center.y - tile * 1.15f * 0.52f
    val spread = tile * 0.05f
    val eyeRadius = tile * 0.026f

    for (side in intArrayOf(-1, 1)) {
        val eye = Offset(center.x + side * spread, headY)
        drawCircle(
            brush = Brush.radialGradient(
                0f to Palette.EyeGlow.copy(alpha = intensity * blink),
                1f to Color.Transparent,
                center = eye,
                radius = tile * 0.22f,
            ),
            radius = tile * 0.22f,
            center = eye,
        )
        drawCircle(Palette.EyeGlow.copy(alpha = intensity * blink), eyeRadius, eye)
    }
}

private fun lerpColor(a: Color, b: Color, t: Float): Color {
    val k = clamp(t, 0f, 1f)
    return Color(
        red = lerp(a.red, b.red, k),
        green = lerp(a.green, b.green, k),
        blue = lerp(a.blue, b.blue, k),
        alpha = lerp(a.alpha, b.alpha, k),
    )
}

/**
 * The moment it reaches you: the thing rushes the camera while the frame tears.
 * Driven entirely by elapsed time so it plays out the same however the frame rate
 * wobbles under it.
 */
fun DrawScope.drawCaughtScare(elapsed: Float, fx: Effects) {
    val progress = clamp(elapsed / 1.15f, 0f, 1f)
    val rush = progress * progress * (3f - 2f * progress) // ease toward the face

    drawRect(Color.Black.copy(alpha = clamp(rush * 1.3f, 0f, 1f)))

    val center = Offset(size.width / 2f, size.height * 0.44f)
    val scale = lerp(0.12f, 2.2f, rush)
    val head = minOf(size.width, size.height) * 0.42f * scale

    // Silhouette.
    drawCircle(Color(0xFF04050A), head, center)
    drawCircle(
        brush = Brush.radialGradient(
            0f to Color.Transparent,
            0.85f to Color.Transparent,
            1f to Palette.Blood.copy(alpha = 0.5f * rush),
            center = center,
            radius = head * 1.2f,
        ),
        radius = head * 1.2f,
        center = center,
    )

    // Eyes, opening wide as it closes.
    val spread = head * 0.38f
    val eyeR = head * lerp(0.06f, 0.14f, rush)
    val jitter = (Noise.value(fx.time * 40f, 3) - 0.5f) * head * 0.02f
    for (side in intArrayOf(-1, 1)) {
        val eye = Offset(center.x + side * spread + jitter, center.y - head * 0.12f)
        drawCircle(
            brush = Brush.radialGradient(
                0f to Palette.EyeGlow.copy(alpha = 0.95f),
                1f to Color.Transparent,
                center = eye,
                radius = eyeR * 4.5f,
            ),
            radius = eyeR * 4.5f,
            center = eye,
        )
        drawCircle(Palette.LanternCore.copy(alpha = 0.9f), eyeR, eye)
        drawCircle(Color(0xFF04050A), eyeR * 0.45f, eye)
    }

    // Mouth: a widening tear.
    val mouthWidth = head * lerp(0.1f, 0.55f, rush)
    val mouthHeight = head * lerp(0.03f, 0.3f, rush)
    val mouth = Path().apply {
        moveTo(center.x - mouthWidth, center.y + head * 0.34f)
        cubicTo(
            center.x - mouthWidth * 0.3f, center.y + head * 0.34f + mouthHeight,
            center.x + mouthWidth * 0.3f, center.y + head * 0.34f + mouthHeight,
            center.x + mouthWidth, center.y + head * 0.34f,
        )
        cubicTo(
            center.x + mouthWidth * 0.4f, center.y + head * 0.34f + mouthHeight * 0.35f,
            center.x - mouthWidth * 0.4f, center.y + head * 0.34f + mouthHeight * 0.35f,
            center.x - mouthWidth, center.y + head * 0.34f,
        )
        close()
    }
    drawPath(mouth, Color(0xFF1A0405).copy(alpha = rush))

    // Blood wash over the whole frame at the impact.
    val flash = clamp(1f - elapsed / 0.22f, 0f, 1f)
    if (flash > 0f) drawRect(Palette.Blood.copy(alpha = flash * 0.6f))
}
