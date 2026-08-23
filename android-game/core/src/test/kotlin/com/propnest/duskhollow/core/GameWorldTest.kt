package com.propnest.duskhollow.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import kotlin.math.floor

class GameWorldTest {

    private val step = 1f / 60f

    private fun world(seed: Long = 1234) = GameWorld(seed)

    private fun GameWorld.run(seconds: Float, input: InputState = InputState()) {
        var t = 0f
        while (t < seconds) {
            update(step, input)
            t += step
        }
    }

    /** Keeps the stalker out of the way so a test can measure one thing at a time. */
    private fun GameWorld.banishStalker() {
        val corner = level.floorTiles().last().center()
        stalker.pos = corner
        stalker.target = corner
    }

    @Test
    fun `everyone starts on open ground`() {
        for (seed in 1L..15L) {
            val w = world(seed)
            assertFalse(
                "seed $seed spawned the player in a wall",
                w.level.collidesCircle(w.player.pos.x, w.player.pos.y, Tuning.PLAYER_RADIUS),
            )
            assertFalse(
                "seed $seed spawned the stalker in a wall",
                w.level.collidesCircle(w.stalker.pos.x, w.stalker.pos.y, Tuning.STALKER_RADIUS),
            )
            for (beacon in w.beacons) {
                assertTrue(
                    "seed $seed put a beacon in a wall",
                    w.level.isFloor(floor(beacon.pos.x).toInt(), floor(beacon.pos.y).toInt()),
                )
            }
        }
    }

    @Test
    fun `the full set of beacons is placed and starts unlit`() {
        val w = world()
        assertEquals(Tuning.BEACON_COUNT, w.beacons.size)
        assertEquals(0, w.litBeacons)
        assertFalse(w.allBeaconsLit)
        assertEquals(Phase.PLAYING, w.phase)
    }

    @Test
    fun `beacons are spread out rather than clustered`() {
        val w = world()
        for (i in w.beacons.indices) {
            for (j in i + 1 until w.beacons.size) {
                val d = w.beacons[i].pos.distanceTo(w.beacons[j].pos)
                assertTrue("beacons $i and $j are only $d apart", d > 3f)
            }
        }
    }

    @Test
    fun `the stalker stays dormant then wakes up`() {
        val w = world()
        w.run(Tuning.STALKER_DORMANT_TIME - 1f)
        assertEquals(StalkerState.DORMANT, w.stalker.state)
        assertTrue(GameEvent.STALKER_WOKE !in w.drainEvents())

        w.run(2f)
        assertNotEquals(StalkerState.DORMANT, w.stalker.state)
    }

    @Test
    fun `a dormant stalker cannot catch the player`() {
        val w = world()
        w.stalker.pos = w.player.pos
        w.run(1f)
        assertEquals(Phase.PLAYING, w.phase)
    }

    @Test
    fun `the stalker catches a player it is standing on`() {
        val w = world()
        w.run(Tuning.STALKER_DORMANT_TIME + 0.5f)
        w.banishStalker()
        w.stalker.pos = w.player.pos
        w.update(step, InputState())

        assertEquals(Phase.CAUGHT, w.phase)
        assertTrue(GameEvent.CAUGHT in w.drainEvents())
    }

    @Test
    fun `a caught game stops simulating`() {
        val w = world()
        w.run(Tuning.STALKER_DORMANT_TIME + 0.5f)
        w.stalker.pos = w.player.pos
        w.update(step, InputState())
        assertEquals(Phase.CAUGHT, w.phase)

        val frozen = w.player.pos
        w.run(1f, InputState(moveX = 1f))
        assertEquals("the player kept moving after being caught", frozen, w.player.pos)
    }

    @Test
    fun `standing on a beacon lights it and refills the lantern`() {
        val w = world()
        w.banishStalker()
        val beacon = w.beacons.first()
        w.player.pos = beacon.pos
        w.player.lanternFuel = 0.2f

        w.run(Tuning.BEACON_LIGHT_TIME + 0.3f)

        assertTrue("beacon did not light", beacon.lit)
        assertEquals(1, w.litBeacons)
        assertEquals(1f, w.player.lanternFuel, 0.05f)
    }

    @Test
    fun `beacon progress decays when the player walks away`() {
        val w = world()
        w.banishStalker()
        val beacon = w.beacons.first()
        w.player.pos = beacon.pos
        w.run(Tuning.BEACON_LIGHT_TIME * 0.4f)
        val partial = beacon.progress
        assertTrue("no progress accumulated", partial > 0f)

        w.player.pos = w.level.floorTiles().first().center()
        w.run(Tuning.BEACON_LIGHT_TIME * 0.5f)
        assertTrue("progress did not decay", beacon.progress < partial)
        assertFalse(beacon.lit)
    }

    @Test
    fun `lighting every beacon then reaching the exit wins the game`() {
        val w = world()
        for (beacon in w.beacons) {
            w.banishStalker()
            w.player.pos = beacon.pos
            w.run(Tuning.BEACON_LIGHT_TIME + 0.2f)
        }
        assertTrue("not every beacon lit", w.allBeaconsLit)

        w.banishStalker()
        w.player.pos = w.exit
        w.update(step, InputState())
        assertEquals(Phase.ESCAPED, w.phase)
    }

    @Test
    fun `the exit does nothing until every beacon is lit`() {
        val w = world()
        w.banishStalker()
        w.player.pos = w.exit
        w.run(1f)
        assertEquals(Phase.PLAYING, w.phase)
    }

    @Test
    fun `the stalker speeds up as beacons are lit`() {
        val w = world()
        w.run(Tuning.STALKER_DORMANT_TIME + 0.5f)
        w.banishStalker()
        w.update(step, InputState())
        val before = w.stalker.speed

        for (beacon in w.beacons) {
            w.banishStalker()
            w.player.pos = beacon.pos
            w.run(Tuning.BEACON_LIGHT_TIME + 0.2f)
        }
        w.banishStalker()
        w.update(step, InputState())

        assertTrue("speed did not escalate: $before -> ${w.stalker.speed}", w.stalker.speed > before)
    }

    @Test
    fun `sprinting drains stamina and resting restores it`() {
        val w = world()
        w.banishStalker()
        w.run(2f, InputState(moveX = 1f, sprint = true))
        val drained = w.player.stamina
        assertTrue("stamina did not drain: $drained", drained < 1f)

        w.run(3f, InputState())
        assertTrue("stamina did not recover", w.player.stamina > drained)
    }

    @Test
    fun `the lantern burns down over time`() {
        val w = world()
        w.banishStalker()
        val before = w.player.lanternFuel
        w.run(20f)
        assertTrue("fuel did not drop", w.player.lanternFuel < before)
        assertTrue("light did not shrink", w.lightRadius < Tuning.LIGHT_RADIUS_MAX)
    }

    @Test
    fun `fear rises when the stalker closes in and settles when it leaves`() {
        val w = world()
        w.run(Tuning.STALKER_DORMANT_TIME + 0.5f)
        w.banishStalker()
        w.run(3f)
        val calm = w.fear

        // Just outside catching range, so the game keeps running.
        w.stalker.pos = w.player.pos + Vec2(1.2f, 0f)
        w.stalker.state = StalkerState.CHASE
        w.run(1.5f)
        assertTrue("fear did not rise: $calm -> ${w.fear}", w.fear > calm)

        w.banishStalker()
        w.stalker.state = StalkerState.PATROL
        w.run(4f)
        assertTrue("fear did not settle", w.fear < 0.9f)
    }

    /** Steers the player along the maze toward [target] for [frames] frames. */
    private fun GameWorld.walkToward(target: TileCoord, frames: Int) {
        val field = level.distanceField(target.x, target.y)
        repeat(frames) {
            banishStalker()
            val hx = floor(player.pos.x).toInt()
            val hy = floor(player.pos.y).toInt()
            val next = level.descend(field, hx, hy)?.center() ?: return
            val dir = (next - player.pos).normalized()
            update(step, InputState(dir.x, dir.y))
        }
    }

    @Test
    fun `walking the maze reveals more of it`() {
        val w = world()
        w.banishStalker()
        val revealedAtSpawn = w.discovered.count { it }
        assertTrue("nothing revealed at spawn", revealedAtSpawn > 0)

        val start = w.player.pos
        w.walkToward(w.level.floorTiles().last(), frames = 600)

        assertTrue("the player never got anywhere", w.player.pos.distanceTo(start) > 3f)
        assertTrue("exploring revealed nothing new", w.discovered.count { it } > revealedAtSpawn)
    }

    @Test
    fun `the player never walks through a wall`() {
        val w = world(77)
        w.banishStalker()
        val rng = Rng(5)
        var input = InputState()
        repeat(3000) { frame ->
            if (frame % 25 == 0) {
                input = InputState(rng.nextFloat(-1f, 1f), rng.nextFloat(-1f, 1f), rng.nextFloat() < 0.4f)
            }
            w.banishStalker()
            w.update(step, input)
            assertFalse(
                "player left the maze at ${w.player.pos}",
                w.level.collidesCircle(w.player.pos.x, w.player.pos.y, Tuning.PLAYER_RADIUS),
            )
        }
    }

    @Test
    fun `the stalker hunts the player down`() {
        // The chase has to actually work: given open time, it should close distance.
        val w = world(2024)
        w.run(Tuning.STALKER_DORMANT_TIME + 0.5f)
        w.stalker.state = StalkerState.CHASE
        w.stalker.target = w.player.pos
        val startDistance = w.player.pos.distanceTo(w.stalker.pos)

        var t = 0f
        while (t < 60f && w.phase == Phase.PLAYING) {
            w.update(step, InputState())
            t += step
        }

        assertEquals(
            "stalker never reached a stationary player (start distance $startDistance)",
            Phase.CAUGHT,
            w.phase,
        )
    }

    @Test
    fun `events are delivered once`() {
        val w = world()
        w.banishStalker()
        w.player.pos = w.beacons.first().pos
        w.run(Tuning.BEACON_LIGHT_TIME + 0.2f)

        assertTrue(GameEvent.BEACON_LIT in w.drainEvents())
        assertTrue("events were replayed", GameEvent.BEACON_LIT !in w.drainEvents())
    }

    @Test
    fun `a long frame cannot tunnel the player through walls`() {
        val w = world(31)
        w.banishStalker()
        repeat(200) {
            w.banishStalker()
            w.update(2f, InputState(moveX = 1f, moveY = 0.3f, sprint = true))
            assertFalse(
                "a 2 second frame pushed the player into a wall",
                w.level.collidesCircle(w.player.pos.x, w.player.pos.y, Tuning.PLAYER_RADIUS),
            )
        }
    }

    @Test
    fun `the same seed replays identically`() {
        val a = world(555)
        val b = world(555)
        val input = InputState(moveX = 0.6f, moveY = -0.4f)
        repeat(600) {
            a.update(step, input)
            b.update(step, input)
        }
        assertEquals(a.player.pos, b.player.pos)
        assertEquals(a.stalker.pos, b.stalker.pos)
        assertEquals(a.phase, b.phase)
    }
}
