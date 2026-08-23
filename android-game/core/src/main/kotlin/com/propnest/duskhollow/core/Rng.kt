package com.propnest.duskhollow.core

import kotlin.math.floor

/**
 * Small deterministic PRNG. Seeded so a level can be replayed exactly, which also
 * makes the generation tests reproducible.
 */
class Rng(seed: Long) {
    private var state: Long = if (seed == 0L) 0x9E3779B97F4A7C15uL.toLong() else seed

    fun nextLong(): Long {
        var x = state
        x = x xor (x shl 13)
        x = x xor (x ushr 7)
        x = x xor (x shl 17)
        state = x
        return x
    }

    /** Uniform in [0, bound). */
    fun nextInt(bound: Int): Int {
        require(bound > 0) { "bound must be positive, was $bound" }
        val v = (nextLong() ushr 1) % bound
        return v.toInt()
    }

    /** Uniform in [0, 1). */
    fun nextFloat(): Float = ((nextLong() ushr 11).toDouble() / (1L shl 53).toDouble()).toFloat()

    /** Uniform in [min, max). */
    fun nextFloat(min: Float, max: Float): Float = min + nextFloat() * (max - min)

    fun <T> pick(items: List<T>): T = items[nextInt(items.size)]

    fun <T> shuffled(items: List<T>): List<T> {
        val out = items.toMutableList()
        for (i in out.indices.reversed()) {
            val j = nextInt(i + 1)
            val tmp = out[i]
            out[i] = out[j]
            out[j] = tmp
        }
        return out
    }
}

/**
 * Smooth 1D value noise. The renderer drives lantern flicker and camera drift from
 * this instead of raw random numbers, so the motion wanders rather than buzzing.
 */
object Noise {
    private fun hash(i: Int): Float {
        var h = i * 0x27D4EB2D
        h = h xor (h ushr 15)
        h *= 0x85EBCA6B.toInt()
        h = h xor (h ushr 13)
        return (h and 0x7FFFFFFF).toFloat() / 0x7FFFFFFF.toFloat()
    }

    /** Value noise in [0, 1] with smoothstep interpolation. */
    fun value(t: Float, seed: Int = 0): Float {
        val i = floor(t).toInt()
        val f = t - i
        val u = f * f * (3f - 2f * f)
        val a = hash(i * 73856093 + seed * 19349663)
        val b = hash((i + 1) * 73856093 + seed * 19349663)
        return lerp(a, b, u)
    }

    /** Layered value noise; more octaves means more fine detail. */
    fun fbm(t: Float, octaves: Int = 3, seed: Int = 0): Float {
        var sum = 0f
        var amp = 0.5f
        var freq = 1f
        var norm = 0f
        repeat(octaves) { o ->
            sum += value(t * freq, seed + o) * amp
            norm += amp
            amp *= 0.5f
            freq *= 2f
        }
        return if (norm > 0f) sum / norm else 0f
    }
}
