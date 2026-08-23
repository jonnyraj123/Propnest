package com.propnest.duskhollow.render

import android.graphics.Bitmap
import androidx.compose.ui.graphics.ImageBitmap
import androidx.compose.ui.graphics.asImageBitmap
import com.propnest.duskhollow.core.Rng

/**
 * Pre-rendered film-grain tiles. Generating per-pixel noise every frame is far too
 * slow, so a handful of small textures are built once and cycled; scaled up with no
 * filtering they read as coarse, moving grain.
 */
class GrainFrames private constructor(val frames: List<ImageBitmap>) {

    fun frameAt(index: Int): ImageBitmap = frames[((index % frames.size) + frames.size) % frames.size]

    companion object {
        fun build(count: Int = 6, resolution: Int = 96, seed: Long = 20240823): GrainFrames {
            val rng = Rng(seed)
            val frames = ArrayList<ImageBitmap>(count)
            repeat(count) {
                val pixels = IntArray(resolution * resolution)
                for (i in pixels.indices) {
                    // Mostly transparent, with a sparse scatter of bright and dark specks.
                    val r = rng.nextFloat()
                    val alpha = when {
                        r > 0.94f -> (rng.nextFloat() * 110f).toInt() + 40
                        r < 0.05f -> (rng.nextFloat() * 70f).toInt() + 25
                        else -> 0
                    }
                    val tone = if (r > 0.94f) 255 else 0
                    pixels[i] = (alpha shl 24) or (tone shl 16) or (tone shl 8) or tone
                }
                val bitmap = Bitmap.createBitmap(resolution, resolution, Bitmap.Config.ARGB_8888)
                bitmap.setPixels(pixels, 0, resolution, 0, 0, resolution, resolution)
                frames.add(bitmap.asImageBitmap())
            }
            return GrainFrames(frames)
        }
    }
}
