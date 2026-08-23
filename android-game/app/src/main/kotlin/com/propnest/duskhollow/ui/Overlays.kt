package com.propnest.duskhollow.ui

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.propnest.duskhollow.core.Noise
import com.propnest.duskhollow.render.Palette

private val TitleStyle = TextStyle(
    color = Palette.Bone,
    fontSize = 46.sp,
    fontFamily = FontFamily.Serif,
    fontWeight = FontWeight.Bold,
    letterSpacing = 6.sp,
    textAlign = TextAlign.Center,
)

private val BodyStyle = TextStyle(
    color = Palette.Muted,
    fontSize = 14.sp,
    fontFamily = FontFamily.Monospace,
    lineHeight = 22.sp,
    textAlign = TextAlign.Center,
)

private val ActionStyle = TextStyle(
    color = Palette.Lantern,
    fontSize = 15.sp,
    fontFamily = FontFamily.Monospace,
    letterSpacing = 4.sp,
    fontWeight = FontWeight.Bold,
    textAlign = TextAlign.Center,
)

/** Shared scrim so every full-screen message sits on the same ground. */
@Composable
private fun Curtain(alpha: Float = 0.88f, content: @Composable () -> Unit) {
    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Canvas(Modifier.fillMaxSize()) {
            drawRect(Palette.Night.copy(alpha = alpha))
            drawRect(
                brush = Brush.radialGradient(
                    0f to Color.Transparent,
                    1f to Color.Black.copy(alpha = 0.7f),
                    center = Offset(size.width / 2f, size.height / 2f),
                    radius = size.minDimension * 0.75f,
                ),
            )
        }
        Column(
            modifier = Modifier.padding(36.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(18.dp),
        ) {
            content()
        }
    }
}

@Composable
fun TitleScreen(bestEscape: Float, time: Float, onPlay: () -> Unit) {
    // The title gutters like a bad bulb.
    val flicker = 0.55f + 0.45f * Noise.fbm(time * 2.6f, 3, 17)
    Box(
        Modifier
            .fillMaxSize()
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onPlay,
            ),
    ) {
        Curtain(alpha = 0.93f) {
            BasicText(text = "DUSKHOLLOW", style = TitleStyle.copy(color = Palette.Bone.copy(alpha = flicker)))
            BasicText(
                text = "Five beacons are cold.\nLight them all, then find the door.\n\nSomething down here hears you run.",
                style = BodyStyle,
            )
            if (bestEscape > 0f) {
                BasicText(text = "BEST ESCAPE  ${formatTime(bestEscape)}", style = BodyStyle)
            }
            BasicText(
                text = "TAP TO DESCEND",
                style = ActionStyle.copy(color = Palette.Lantern.copy(alpha = 0.5f + 0.5f * flicker)),
            )
            BasicText(
                text = "Drag on the left to move. Hold the right to run.\nRunning is loud.",
                style = BodyStyle.copy(fontSize = 12.sp, color = Palette.Muted.copy(alpha = 0.6f)),
            )
        }
    }
}

@Composable
fun CaughtScreen(beaconsLit: Int, onRetry: () -> Unit) {
    Box(
        Modifier
            .fillMaxSize()
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onRetry,
            ),
    ) {
        Curtain(alpha = 0.9f) {
            BasicText(text = "IT FOUND YOU", style = TitleStyle.copy(color = Palette.Blood, fontSize = 38.sp))
            BasicText(text = "$beaconsLit of 5 beacons were burning.", style = BodyStyle)
            BasicText(text = "TAP TO GO BACK DOWN", style = ActionStyle)
        }
    }
}

@Composable
fun EscapedScreen(seconds: Float, isBest: Boolean, onAgain: () -> Unit) {
    Box(
        Modifier
            .fillMaxSize()
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                onClick = onAgain,
            ),
    ) {
        Curtain(alpha = 0.9f) {
            BasicText(text = "YOU GOT OUT", style = TitleStyle.copy(color = Palette.Exit, fontSize = 38.sp))
            BasicText(text = formatTime(seconds), style = BodyStyle.copy(fontSize = 22.sp, color = Palette.Bone))
            if (isBest) BasicText(text = "A NEW BEST", style = BodyStyle.copy(color = Palette.Lantern))
            BasicText(text = "TAP TO DESCEND AGAIN", style = ActionStyle)
        }
    }
}

fun formatTime(seconds: Float): String {
    val total = seconds.toInt()
    val minutes = total / 60
    val rest = total % 60
    return if (minutes > 0) "${minutes}m ${rest}s" else "${rest}s"
}
