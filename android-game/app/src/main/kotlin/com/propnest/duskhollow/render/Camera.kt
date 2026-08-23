package com.propnest.duskhollow.render

import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import com.propnest.duskhollow.core.Vec2

/** Maps world tiles to screen pixels, centred on the player. */
class Camera(val center: Vec2, val pxPerTile: Float, val screen: Size) {

    fun toScreen(world: Vec2): Offset = Offset(
        (world.x - center.x) * pxPerTile + screen.width / 2f,
        (world.y - center.y) * pxPerTile + screen.height / 2f,
    )

    fun toScreen(x: Float, y: Float): Offset = Offset(
        (x - center.x) * pxPerTile + screen.width / 2f,
        (y - center.y) * pxPerTile + screen.height / 2f,
    )

    /** Inclusive tile bounds that can appear on screen, with a one-tile margin. */
    fun visibleTiles(): IntArray {
        val halfW = screen.width / 2f / pxPerTile
        val halfH = screen.height / 2f / pxPerTile
        return intArrayOf(
            kotlin.math.floor(center.x - halfW).toInt() - 1,
            kotlin.math.floor(center.y - halfH).toInt() - 1,
            kotlin.math.ceil(center.x + halfW).toInt() + 1,
            kotlin.math.ceil(center.y + halfH).toInt() + 1,
        )
    }
}
