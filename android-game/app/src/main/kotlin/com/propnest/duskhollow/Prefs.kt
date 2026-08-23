package com.propnest.duskhollow

import android.content.Context

/** Local-only storage. Nothing here leaves the device; the game has no network code. */
class Prefs(context: Context) {

    private val prefs = context.getSharedPreferences("duskhollow", Context.MODE_PRIVATE)

    /** Fastest escape in seconds, or 0 when the player has never got out. */
    var bestEscape: Float
        get() = prefs.getFloat(KEY_BEST, 0f)
        set(value) = prefs.edit().putFloat(KEY_BEST, value).apply()

    fun recordEscape(seconds: Float): Boolean {
        val previous = bestEscape
        if (previous == 0f || seconds < previous) {
            bestEscape = seconds
            return true
        }
        return false
    }

    private companion object {
        const val KEY_BEST = "best_escape_seconds"
    }
}
