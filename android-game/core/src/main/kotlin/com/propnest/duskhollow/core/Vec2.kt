package com.propnest.duskhollow.core

import kotlin.math.hypot
import kotlin.math.sqrt

/** Position and direction in world space. One unit is one tile. */
data class Vec2(val x: Float, val y: Float) {
    operator fun plus(o: Vec2) = Vec2(x + o.x, y + o.y)
    operator fun minus(o: Vec2) = Vec2(x - o.x, y - o.y)
    operator fun times(s: Float) = Vec2(x * s, y * s)

    val length: Float get() = hypot(x, y)

    fun normalized(): Vec2 {
        val len = length
        return if (len < 1e-6f) ZERO else Vec2(x / len, y / len)
    }

    fun distanceTo(o: Vec2): Float = hypot(x - o.x, y - o.y)

    companion object {
        val ZERO = Vec2(0f, 0f)
    }
}

/** Clamps a value into [min, max]. */
fun clamp(value: Float, min: Float, max: Float): Float =
    if (value < min) min else if (value > max) max else value

/** Moves [current] toward [target] by at most [maxDelta]. */
fun approach(current: Float, target: Float, maxDelta: Float): Float {
    val diff = target - current
    return when {
        diff > maxDelta -> current + maxDelta
        diff < -maxDelta -> current - maxDelta
        else -> target
    }
}

/** Linear interpolation, [t] unclamped. */
fun lerp(a: Float, b: Float, t: Float): Float = a + (b - a) * t

/** Length of a vector without allocating one. */
fun len(x: Float, y: Float): Float = sqrt(x * x + y * y)
