package com.propnest.duskhollow.render

import com.propnest.duskhollow.core.Noise
import com.propnest.duskhollow.core.Rng
import com.propnest.duskhollow.core.Vec2
import com.propnest.duskhollow.core.clamp
import com.propnest.duskhollow.core.lerp
import kotlin.math.PI
import kotlin.math.sin

/** A speck of dust drifting through the lantern beam. */
class Mote(var pos: Vec2, var drift: Vec2, var size: Float, var phase: Float)

/** An expanding ring left by a footstep. */
class Ripple(val pos: Vec2, var age: Float = 0f) {
    val alive: Boolean get() = age < LIFETIME
    val progress: Float get() = clamp(age / LIFETIME, 0f, 1f)

    companion object {
        const val LIFETIME = 0.9f
    }
}

/**
 * All the purely visual state that has no business in the simulation: flicker,
 * camera shake, heartbeat phase, dust and the scare flash.
 */
class Effects(seed: Long = 7) {

    private val rng = Rng(seed)

    var time: Float = 0f
        private set

    /** 0..1 lantern brightness multiplier; wanders and occasionally stutters. */
    var flicker: Float = 1f
        private set

    var shakeX: Float = 0f
        private set
    var shakeY: Float = 0f
        private set

    /** Rises to 1 on a scare and falls away; drives the red flash and lurch. */
    var jolt: Float = 0f
        private set

    /** Advances faster as danger rises; the vignette breathes on it. */
    var heartbeatPhase: Float = 0f
        private set
    var heartbeatRate: Float = 1f
        private set
    /** True on the frame a beat lands, so audio and haptics can fire together. */
    var beatFired: Boolean = false
        private set

    val motes = ArrayList<Mote>()
    val ripples = ArrayList<Ripple>()

    private var stutterTimer = 0f

    fun update(dt: Float, danger: Float, fuel: Float, playerPos: Vec2, lightRadius: Float) {
        time += dt

        updateFlicker(dt, fuel)
        updateHeartbeat(dt, danger)

        jolt = clamp(jolt - dt * 1.9f, 0f, 1f)

        val shakeAmount = danger * 0.055f + jolt * 0.22f
        shakeX = (Noise.fbm(time * 11f, 3, 11) - 0.5f) * shakeAmount
        shakeY = (Noise.fbm(time * 11f, 3, 29) - 0.5f) * shakeAmount

        updateMotes(dt, playerPos, lightRadius)
        updateRipples(dt)
    }

    private fun updateFlicker(dt: Float, fuel: Float) {
        // A healthy lantern only wavers; a dying one gutters hard and often.
        val unsteadiness = lerp(0.12f, 0.55f, 1f - fuel)
        val wander = Noise.fbm(time * 3.4f, 3, 5)
        var value = 1f - unsteadiness * (1f - wander)

        stutterTimer -= dt
        if (stutterTimer <= 0f) {
            stutterTimer = rng.nextFloat(0.4f, 2.6f) * lerp(1f, 0.3f, 1f - fuel)
            if (rng.nextFloat() < 0.45f) value *= rng.nextFloat(0.25f, 0.6f)
        }
        flicker = clamp(value, 0.15f, 1f)
    }

    private fun updateHeartbeat(dt: Float, danger: Float) {
        heartbeatRate = lerp(0.85f, 2.6f, danger)
        val before = heartbeatPhase
        heartbeatPhase += dt * heartbeatRate
        beatFired = heartbeatPhase.toInt() > before.toInt()
        if (heartbeatPhase > 1000f) heartbeatPhase -= 1000f
    }

    /** Two quick thumps per cycle, so it reads as a heart and not a metronome. */
    fun heartbeatPulse(): Float {
        val t = heartbeatPhase % 1f
        val first = sin(clamp(t / 0.16f, 0f, 1f) * PI).toFloat()
        val second = sin(clamp((t - 0.22f) / 0.14f, 0f, 1f) * PI).toFloat() * 0.6f
        return clamp(first + second, 0f, 1.4f)
    }

    fun punch(strength: Float = 1f) {
        jolt = clamp(maxOf(jolt, strength), 0f, 1f)
    }

    fun addRipple(pos: Vec2) {
        if (ripples.size < 24) ripples.add(Ripple(pos))
    }

    private fun updateMotes(dt: Float, playerPos: Vec2, lightRadius: Float) {
        // Keep a fixed population of dust around the player and recycle strays,
        // so the beam always has something floating in it.
        while (motes.size < MOTE_COUNT) {
            motes.add(spawnMote(playerPos, lightRadius))
        }
        for (mote in motes) {
            mote.pos = mote.pos + mote.drift * dt
            mote.phase += dt * 0.8f
            if (mote.pos.distanceTo(playerPos) > lightRadius * 1.25f) {
                val fresh = spawnMote(playerPos, lightRadius)
                mote.pos = fresh.pos
                mote.drift = fresh.drift
                mote.size = fresh.size
                mote.phase = fresh.phase
            }
        }
    }

    private fun spawnMote(playerPos: Vec2, lightRadius: Float): Mote {
        val angle = rng.nextFloat(0f, (2f * PI).toFloat())
        val dist = rng.nextFloat(0.4f, lightRadius)
        val pos = playerPos + Vec2(kotlin.math.cos(angle), kotlin.math.sin(angle)) * dist
        val drift = Vec2(rng.nextFloat(-0.22f, 0.22f), rng.nextFloat(-0.3f, -0.04f))
        return Mote(pos, drift, rng.nextFloat(0.012f, 0.038f), rng.nextFloat(0f, 6.28f))
    }

    private fun updateRipples(dt: Float) {
        val it = ripples.iterator()
        while (it.hasNext()) {
            val ripple = it.next()
            ripple.age += dt
            if (!ripple.alive) it.remove()
        }
    }

    companion object {
        const val MOTE_COUNT = 70
    }
}
