package com.propnest.duskhollow.audio

import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import android.util.Log
import kotlin.concurrent.thread
import kotlin.math.PI
import kotlin.math.abs
import kotlin.math.exp
import kotlin.math.max
import kotlin.math.sin

/**
 * Everything you hear is synthesised at runtime - there are no audio assets in the
 * app at all. A background thread mixes a drone bed whose weight tracks danger,
 * plus short one-shot voices for footsteps, heartbeats and scares.
 *
 * Audio is a nice-to-have: if the device refuses to give us a track, the game
 * carries on in silence rather than crashing.
 */
class SoundEngine {

    private var track: AudioTrack? = null
    private var worker: Thread? = null
    @Volatile private var running = false

    @Volatile private var danger = 0f
    @Volatile private var muted = false

    private val voices = ArrayList<Voice>()
    private val voiceLock = Any()

    private var phaseA = 0.0
    private var phaseB = 0.0
    private var phaseLfo = 0.0
    private var noiseState = 0x8BADF00DL
    private var rumbleLowPass = 0.0

    fun start() {
        if (running) return
        val minBuffer = AudioTrack.getMinBufferSize(SAMPLE_RATE, CHANNEL, ENCODING)
        if (minBuffer <= 0) return

        val created = try {
            AudioTrack.Builder()
                .setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_GAME)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .build(),
                )
                .setAudioFormat(
                    AudioFormat.Builder()
                        .setEncoding(ENCODING)
                        .setSampleRate(SAMPLE_RATE)
                        .setChannelMask(CHANNEL)
                        .build(),
                )
                .setBufferSizeInBytes(max(minBuffer, BLOCK * 4))
                .setTransferMode(AudioTrack.MODE_STREAM)
                .build()
        } catch (e: Exception) {
            Log.w(TAG, "no audio track available, running silent", e)
            return
        }

        track = created
        running = true
        try {
            created.play()
        } catch (e: IllegalStateException) {
            Log.w(TAG, "could not start playback", e)
            running = false
            created.release()
            track = null
            return
        }

        worker = thread(name = "duskhollow-audio", isDaemon = true) {
            val buffer = ShortArray(BLOCK)
            while (running) {
                fill(buffer)
                val t = track ?: break
                try {
                    t.write(buffer, 0, buffer.size)
                } catch (e: Exception) {
                    Log.w(TAG, "audio write failed, stopping", e)
                    break
                }
            }
        }
    }

    fun stop() {
        running = false
        worker?.join(500)
        worker = null
        track?.let {
            try {
                it.pause()
                it.flush()
                it.stop()
            } catch (e: IllegalStateException) {
                Log.w(TAG, "audio already stopped", e)
            }
            it.release()
        }
        track = null
        synchronized(voiceLock) { voices.clear() }
    }

    fun setDanger(value: Float) {
        danger = value.coerceIn(0f, 1f)
    }

    fun setMuted(value: Boolean) {
        muted = value
    }

    fun footstep() = addVoice(Voice(VoiceKind.FOOTSTEP, 0.10f, 0.20f))
    fun heartbeat(strength: Float) = addVoice(Voice(VoiceKind.HEARTBEAT, 0.22f, 0.55f * strength))
    fun beaconLit() = addVoice(Voice(VoiceKind.CHIME, 1.4f, 0.4f))
    fun stinger() = addVoice(Voice(VoiceKind.STINGER, 1.1f, 0.85f))
    fun scream() = addVoice(Voice(VoiceKind.SCREAM, 1.8f, 1f))
    fun escape() = addVoice(Voice(VoiceKind.RELIEF, 2.2f, 0.55f))

    private fun addVoice(voice: Voice) {
        if (!running) return
        synchronized(voiceLock) {
            // Keep the mix from piling up if events arrive in a burst.
            if (voices.size >= MAX_VOICES) voices.removeAt(0)
            voices.add(voice)
        }
    }

    private fun noise(): Double {
        // xorshift; cheap and good enough for hiss.
        noiseState = noiseState xor (noiseState shl 13)
        noiseState = noiseState xor (noiseState ushr 7)
        noiseState = noiseState xor (noiseState shl 17)
        return ((noiseState ushr 11).toDouble() / (1L shl 53).toDouble()) * 2.0 - 1.0
    }

    private fun fill(buffer: ShortArray) {
        val d = danger.toDouble()
        val gain = if (muted) 0.0 else 1.0

        val active: List<Voice> = synchronized(voiceLock) {
            voices.removeAll { it.finished }
            ArrayList(voices)
        }

        for (i in buffer.indices) {
            var sample = 0.0

            // Two detuned low sines with a slow beat between them: the room tone.
            phaseA += TWO_PI * (46.0 + 6.0 * d) / SAMPLE_RATE
            phaseB += TWO_PI * (69.3 + 9.0 * d) / SAMPLE_RATE
            phaseLfo += TWO_PI * 0.07 / SAMPLE_RATE
            val swell = 0.6 + 0.4 * sin(phaseLfo)
            sample += sin(phaseA) * 0.11 * swell * (0.5 + d)
            sample += sin(phaseB) * 0.055 * swell * (0.35 + d * 0.8)

            // Low-passed hiss that thickens as the stalker closes in.
            rumbleLowPass += (noise() - rumbleLowPass) * 0.035
            sample += rumbleLowPass * (0.05 + 0.22 * d)

            for (voice in active) {
                sample += voice.sample(this)
            }
            for (voice in active) {
                voice.advance()
            }

            sample *= gain
            // Soft clip so a pile-up distorts gently instead of tearing.
            val clipped = kotlin.math.tanh(sample * 1.15)
            buffer[i] = (clipped * 26000.0).toInt().coerceIn(-32768, 32767).toShort()
        }
    }

    private enum class VoiceKind { FOOTSTEP, HEARTBEAT, CHIME, STINGER, SCREAM, RELIEF }

    private class Voice(
        val kind: VoiceKind,
        val duration: Float,
        val level: Float,
    ) {
        private var t = 0.0
        private var phase = 0.0
        val finished: Boolean get() = t >= duration

        fun advance() {
            t += 1.0 / SAMPLE_RATE
        }

        fun sample(engine: SoundEngine): Double {
            if (finished) return 0.0
            val progress = (t / duration).coerceIn(0.0, 1.0)
            val level = this.level.toDouble()
            return when (kind) {
                VoiceKind.FOOTSTEP -> {
                    val env = exp(-progress * 14.0)
                    engine.noise() * env * 0.35 * level
                }
                VoiceKind.HEARTBEAT -> {
                    // A short low thump with a fast pitch drop.
                    val env = exp(-progress * 9.0)
                    phase += TWO_PI * (62.0 - 26.0 * progress) / SAMPLE_RATE
                    sin(phase) * env * 1.5 * level
                }
                VoiceKind.CHIME -> {
                    val env = exp(-progress * 3.2)
                    phase += TWO_PI * 528.0 / SAMPLE_RATE
                    (sin(phase) + 0.4 * sin(phase * 2.005)) * env * 0.3 * level
                }
                VoiceKind.STINGER -> {
                    // Rising screech plus grit: the "it has seen you" sound.
                    val env = if (progress < 0.06) progress / 0.06 else exp(-(progress - 0.06) * 4.5)
                    phase += TWO_PI * (220.0 + 900.0 * progress) / SAMPLE_RATE
                    (sin(phase) * 0.5 + engine.noise() * 0.5) * env * 0.5 * level
                }
                VoiceKind.SCREAM -> {
                    val env = if (progress < 0.02) progress / 0.02 else exp(-(progress - 0.02) * 2.2)
                    phase += TWO_PI * (140.0 + 620.0 * abs(sin(progress * 9.0))) / SAMPLE_RATE
                    (sin(phase) * 0.45 + engine.noise() * 0.55) * env * 0.85 * level
                }
                VoiceKind.RELIEF -> {
                    val env = sin(progress * PI)
                    phase += TWO_PI * (196.0 + 98.0 * progress) / SAMPLE_RATE
                    (sin(phase) + 0.5 * sin(phase * 1.5)) * env * 0.22 * level
                }
            }
        }
    }

    companion object {
        private const val TAG = "SoundEngine"
        private const val SAMPLE_RATE = 22050
        private const val CHANNEL = AudioFormat.CHANNEL_OUT_MONO
        private const val ENCODING = AudioFormat.ENCODING_PCM_16BIT
        private const val BLOCK = 1024
        private const val MAX_VOICES = 12
        private const val TWO_PI = 2.0 * PI
    }
}
