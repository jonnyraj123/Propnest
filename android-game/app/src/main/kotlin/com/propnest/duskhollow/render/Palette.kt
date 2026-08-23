package com.propnest.duskhollow.render

import androidx.compose.ui.graphics.Color

/**
 * The whole game is lit by one warm lantern in a cold dark maze, so the palette is
 * built as that single opposition: everything the light touches leans amber,
 * everything it does not leans blue-black.
 */
object Palette {
    val Night = Color(0xFF05060A)
    val FloorLit = Color(0xFF191F2B)
    val FloorDark = Color(0xFF0B0E15)
    val WallLit = Color(0xFF2B3446)
    val WallTop = Color(0xFF3E4A63)
    val WallDark = Color(0xFF131824)

    val Lantern = Color(0xFFFFB347)
    val LanternCore = Color(0xFFFFF0C2)
    val Ember = Color(0xFF8A4A16)

    val Blood = Color(0xFFB3231F)
    val EyeGlow = Color(0xFFE8483F)

    val Bone = Color(0xFFD8DCE6)
    val Muted = Color(0xFF7A8395)

    val Exit = Color(0xFF6FE3C0)
}
