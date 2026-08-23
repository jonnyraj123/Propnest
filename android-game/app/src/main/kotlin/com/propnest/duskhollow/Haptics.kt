package com.propnest.duskhollow

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager

/** Thin wrapper so a device without a vibrator (or a denied call) is a no-op. */
class Haptics(context: Context) {

    private val vibrator: Vibrator? = try {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val manager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
            manager?.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
        }
    } catch (e: Exception) {
        null
    }

    private val available = vibrator?.hasVibrator() == true

    fun blip() = buzz(28, 90)

    fun thump() = buzz(55, 150)

    fun slam() = buzz(220, 255)

    private fun buzz(millis: Long, amplitude: Int) {
        if (!available) return
        val v = vibrator ?: return
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                v.vibrate(VibrationEffect.createOneShot(millis, amplitude.coerceIn(1, 255)))
            } else {
                @Suppress("DEPRECATION")
                v.vibrate(millis)
            }
        } catch (e: Exception) {
            // A refused vibration is never worth interrupting the game for.
        }
    }
}
