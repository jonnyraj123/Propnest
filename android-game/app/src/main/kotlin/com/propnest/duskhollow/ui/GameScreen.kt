package com.propnest.duskhollow.ui

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.withFrameNanos
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import com.propnest.duskhollow.Haptics
import com.propnest.duskhollow.Prefs
import com.propnest.duskhollow.audio.SoundEngine
import com.propnest.duskhollow.core.GameEvent
import com.propnest.duskhollow.core.GameWorld
import com.propnest.duskhollow.core.InputState
import com.propnest.duskhollow.core.Phase
import com.propnest.duskhollow.render.Effects
import com.propnest.duskhollow.render.GrainFrames
import com.propnest.duskhollow.render.Palette
import com.propnest.duskhollow.render.drawCaughtScare
import com.propnest.duskhollow.render.drawGame

/** Longest step the simulation will take, so a stalled frame cannot skip ahead. */
private const val MAX_FRAME_SECONDS = 0.1f

@Composable
fun DuskhollowApp() {
    val context = LocalContext.current
    val sound = remember { SoundEngine() }
    val haptics = remember { Haptics(context) }
    val grain = remember { GrainFrames.build() }
    val prefs = remember { Prefs(context) }

    var runId by remember { mutableIntStateOf(0) }
    var playing by remember { mutableStateOf(false) }
    var bestEscape by remember { mutableFloatStateOf(prefs.bestEscape) }
    var newRecord by remember { mutableStateOf(false) }

    val world = remember(runId) { GameWorld(System.nanoTime()) }
    val effects = remember(runId) { Effects(seed = runId * 7919L + 13L) }
    val input = remember { mutableStateOf(InputState()) }

    // Mirrors of simulation state that the UI needs to recompose on.
    var phase by remember(runId) { mutableStateOf(Phase.PLAYING) }
    var tick by remember { mutableIntStateOf(0) }
    var caughtFor by remember(runId) { mutableFloatStateOf(0f) }

    DisposableEffect(Unit) {
        sound.start()
        onDispose { sound.stop() }
    }

    // One loop drives everything, including the title screen's flicker.
    LaunchedEffect(runId) {
        var last = 0L
        while (true) {
            withFrameNanos { now ->
                if (last != 0L) {
                    val dt = ((now - last) / 1_000_000_000.0).toFloat().coerceIn(0f, MAX_FRAME_SECONDS)
                    if (playing) {
                        world.update(dt, input.value)
                        consumeEvents(world, effects, sound, haptics)
                        if (world.phase == Phase.CAUGHT) caughtFor += dt
                        if (world.phase != phase) {
                            phase = world.phase
                            if (phase == Phase.ESCAPED) {
                                newRecord = prefs.recordEscape(world.elapsed)
                                bestEscape = prefs.bestEscape
                            }
                        }
                        sound.setDanger(world.danger)
                        if (effects.beatFired && world.danger > 0.12f) {
                            sound.heartbeat(0.4f + world.danger * 0.6f)
                            if (world.danger > 0.75f) haptics.thump()
                        }
                    }
                    effects.update(
                        dt = dt,
                        danger = if (playing) world.danger else 0f,
                        fuel = world.player.lanternFuel,
                        playerPos = world.player.pos,
                        lightRadius = world.lightRadius,
                    )
                }
                last = now
                tick++
            }
        }
    }

    Box(
        Modifier
            .fillMaxSize()
            .background(Palette.Night),
    ) {
        Canvas(Modifier.fillMaxSize()) {
            // Reading the frame counter here is what schedules the next redraw.
            @Suppress("UNUSED_EXPRESSION")
            tick
            drawGame(world, effects, grain, tick / 2)
            if (phase == Phase.CAUGHT) {
                drawCaughtScare(caughtFor, effects)
            }
        }

        if (playing && phase == Phase.PLAYING) {
            Hud(world)
            TouchControls(
                onMove = { x, y -> input.value = input.value.copy(moveX = x, moveY = y) },
                onSprint = { input.value = input.value.copy(sprint = it) },
            )
        }

        when {
            !playing -> TitleScreen(
                bestEscape = bestEscape,
                time = effects.time,
                onPlay = {
                    runId++
                    playing = true
                },
            )

            phase == Phase.CAUGHT && caughtFor > SCARE_SECONDS -> CaughtScreen(
                beaconsLit = world.litBeacons,
                onRetry = {
                    input.value = InputState()
                    runId++
                },
            )

            phase == Phase.ESCAPED -> EscapedScreen(
                seconds = world.elapsed,
                isBest = newRecord,
                onAgain = {
                    input.value = InputState()
                    runId++
                },
            )
        }
    }
}

/** How long the jump scare plays before the game-over card takes over. */
private const val SCARE_SECONDS = 1.15f

private fun consumeEvents(
    world: GameWorld,
    effects: Effects,
    sound: SoundEngine,
    haptics: Haptics,
) {
    for (event in world.drainEvents()) {
        when (event) {
            GameEvent.FOOTSTEP -> {
                sound.footstep()
                effects.addRipple(world.player.pos)
            }

            GameEvent.BEACON_PROGRESS_START -> Unit

            GameEvent.BEACON_LIT -> {
                sound.beaconLit()
                effects.punch(0.3f)
                haptics.blip()
            }

            GameEvent.ALL_BEACONS_LIT -> {
                effects.punch(0.55f)
                haptics.thump()
            }

            GameEvent.STALKER_WOKE -> {
                sound.stinger()
                effects.punch(0.45f)
                haptics.thump()
            }

            GameEvent.STALKER_SPOTTED -> {
                sound.stinger()
                effects.punch(0.8f)
                haptics.thump()
            }

            GameEvent.STALKER_LOST -> Unit

            GameEvent.CAUGHT -> {
                sound.scream()
                effects.punch(1f)
                haptics.slam()
            }

            GameEvent.ESCAPED -> {
                sound.escape()
                haptics.blip()
            }
        }
    }
}
