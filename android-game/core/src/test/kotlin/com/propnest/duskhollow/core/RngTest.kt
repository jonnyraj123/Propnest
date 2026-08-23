package com.propnest.duskhollow.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class RngTest {

    @Test
    fun `same seed produces the same sequence`() {
        val a = Rng(12345)
        val b = Rng(12345)
        repeat(200) { assertEquals(a.nextLong(), b.nextLong()) }
    }

    @Test
    fun `different seeds diverge`() {
        val a = Rng(1)
        val b = Rng(2)
        assertNotEquals(a.nextLong(), b.nextLong())
    }

    @Test
    fun `nextInt stays in range`() {
        val rng = Rng(42)
        repeat(5000) {
            val v = rng.nextInt(17)
            assertTrue("out of range: $v", v in 0..16)
        }
    }

    @Test
    fun `nextFloat stays in unit interval and covers it`() {
        val rng = Rng(7)
        var low = false
        var high = false
        repeat(5000) {
            val v = rng.nextFloat()
            assertTrue("out of range: $v", v >= 0f && v < 1f)
            if (v < 0.1f) low = true
            if (v > 0.9f) high = true
        }
        assertTrue("never sampled the low end", low)
        assertTrue("never sampled the high end", high)
    }

    @Test
    fun `shuffled keeps every element`() {
        val rng = Rng(3)
        val source = (1..50).toList()
        val shuffled = rng.shuffled(source)
        assertEquals(source.size, shuffled.size)
        assertEquals(source.toSet(), shuffled.toSet())
    }

    @Test
    fun `noise is bounded and continuous`() {
        var previous = Noise.fbm(0f)
        var t = 0f
        while (t < 40f) {
            val v = Noise.fbm(t)
            assertTrue("noise out of range: $v", v in 0f..1f)
            assertTrue("noise jumped from $previous to $v at $t", kotlin.math.abs(v - previous) < 0.4f)
            previous = v
            t += 0.02f
        }
    }
}
