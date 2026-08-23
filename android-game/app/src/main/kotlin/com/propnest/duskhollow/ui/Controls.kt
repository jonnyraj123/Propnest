package com.propnest.duskhollow.ui

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.dp
import com.propnest.duskhollow.render.Palette
import kotlin.math.hypot

/**
 * Left half is a floating stick that appears wherever the thumb lands; right half
 * is hold-to-run. Splitting them across two pointer scopes means both work at once
 * without any pointer-id bookkeeping.
 */
@Composable
fun TouchControls(
    onMove: (Float, Float) -> Unit,
    onSprint: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
) {
    val radiusPx = with(LocalDensity.current) { STICK_RADIUS_DP.dp.toPx() }

    Row(modifier.fillMaxSize()) {
        var origin by remember { mutableStateOf<Offset?>(null) }
        var knob by remember { mutableStateOf(Offset.Zero) }
        var sprinting by remember { mutableStateOf(false) }

        Box(
            Modifier
                .weight(1f)
                .fillMaxHeight()
                .pointerInput(Unit) {
                    detectDragGestures(
                        onDragStart = { start ->
                            origin = start
                            knob = start
                        },
                        onDrag = { change, _ ->
                            change.consume()
                            knob = change.position
                            val start = origin ?: change.position
                            val dx = knob.x - start.x
                            val dy = knob.y - start.y
                            val distance = hypot(dx, dy)
                            if (distance < 1e-3f) {
                                onMove(0f, 0f)
                            } else {
                                val scale = (distance / radiusPx).coerceAtMost(1f)
                                onMove(dx / distance * scale, dy / distance * scale)
                            }
                        },
                        onDragEnd = {
                            origin = null
                            onMove(0f, 0f)
                        },
                        onDragCancel = {
                            origin = null
                            onMove(0f, 0f)
                        },
                    )
                },
        ) {
            val anchor = origin
            if (anchor != null) {
                Canvas(Modifier.fillMaxSize()) {
                    drawCircle(
                        color = Palette.Bone.copy(alpha = 0.10f),
                        radius = radiusPx,
                        center = anchor,
                        style = Stroke(width = radiusPx * 0.05f),
                    )
                    val dx = knob.x - anchor.x
                    val dy = knob.y - anchor.y
                    val distance = hypot(dx, dy)
                    val clamped = if (distance > radiusPx && distance > 0f) {
                        Offset(anchor.x + dx / distance * radiusPx, anchor.y + dy / distance * radiusPx)
                    } else {
                        knob
                    }
                    drawCircle(
                        color = Palette.Lantern.copy(alpha = 0.28f),
                        radius = radiusPx * 0.34f,
                        center = clamped,
                    )
                }
            }
        }

        Box(
            Modifier
                .weight(1f)
                .fillMaxHeight()
                .pointerInput(Unit) {
                    detectTapGestures(
                        onPress = {
                            sprinting = true
                            onSprint(true)
                            tryAwaitRelease()
                            sprinting = false
                            onSprint(false)
                        },
                    )
                },
        ) {
            Canvas(Modifier.fillMaxSize()) {
                val center = Offset(size.width * 0.62f, size.height * 0.78f)
                val r = radiusPx * 0.62f
                drawCircle(
                    color = if (sprinting) Palette.Lantern.copy(alpha = 0.22f) else Palette.Bone.copy(alpha = 0.07f),
                    radius = r,
                    center = center,
                )
                drawCircle(
                    color = Palette.Bone.copy(alpha = if (sprinting) 0.35f else 0.14f),
                    radius = r,
                    center = center,
                    style = Stroke(width = r * 0.06f),
                )
            }
        }
    }
}

private const val STICK_RADIUS_DP = 68
