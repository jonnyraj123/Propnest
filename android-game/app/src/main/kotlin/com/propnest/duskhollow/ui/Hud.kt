package com.propnest.duskhollow.ui

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.propnest.duskhollow.core.GameWorld
import com.propnest.duskhollow.render.Palette

private val LabelStyle = TextStyle(
    color = Palette.Muted,
    fontSize = 11.sp,
    fontFamily = FontFamily.Monospace,
    letterSpacing = 2.sp,
    fontWeight = FontWeight.Medium,
)

/** Deliberately sparse: three readings, no chrome, nothing that breaks the dark. */
@Composable
fun Hud(world: GameWorld, modifier: Modifier = Modifier) {
    Column(
        modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 18.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                for (beacon in world.beacons) {
                    Box(Modifier.size(11.dp)) {
                        Canvas(Modifier.size(11.dp)) {
                            val c = Offset(size.width / 2f, size.height / 2f)
                            if (beacon.lit) {
                                drawCircle(Palette.Lantern, size.minDimension / 2f, c)
                            } else {
                                drawCircle(
                                    Palette.Muted.copy(alpha = 0.5f),
                                    size.minDimension / 2f - 1f,
                                    c,
                                    style = Stroke(width = 1.5f),
                                )
                            }
                        }
                    }
                }
            }
            BasicText(
                text = if (world.allBeaconsLit) "  RUN FOR THE DOOR" else "  BEACONS",
                style = LabelStyle.copy(
                    color = if (world.allBeaconsLit) Palette.Exit else Palette.Muted,
                ),
            )
        }

        Meter("LANTERN", world.player.lanternFuel, Palette.Lantern)
        Meter("BREATH", world.player.stamina, Palette.Bone.copy(alpha = 0.7f))
    }
}

@Composable
private fun Meter(label: String, value: Float, color: Color) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        BasicText(text = label, style = LabelStyle, modifier = Modifier.width(78.dp))
        Canvas(
            Modifier
                .width(112.dp)
                .height(4.dp),
        ) {
            drawRect(color = Color.White.copy(alpha = 0.08f))
            drawRect(
                color = color,
                size = androidx.compose.ui.geometry.Size(size.width * value.coerceIn(0f, 1f), size.height),
            )
        }
    }
}
