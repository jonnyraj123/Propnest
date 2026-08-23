package com.propnest.duskhollow.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

class LevelTest {

    private fun maze(seed: Long) = generateLevel(31, 31, Rng(seed))

    @Test
    fun `generated maze is enclosed by walls`() {
        val level = maze(1)
        for (x in 0 until level.width) {
            assertTrue("top edge open at $x", level.isWall(x, 0))
            assertTrue("bottom edge open at $x", level.isWall(x, level.height - 1))
        }
        for (y in 0 until level.height) {
            assertTrue("left edge open at $y", level.isWall(0, y))
            assertTrue("right edge open at $y", level.isWall(level.width - 1, y))
        }
    }

    @Test
    fun `even dimensions are rounded up to odd`() {
        val level = generateLevel(30, 20, Rng(7))
        assertEquals(31, level.width)
        assertEquals(21, level.height)
    }

    @Test
    fun `every floor tile is reachable from every other`() {
        // A stranded beacon or stalker would make the game unwinnable, so this has
        // to hold for any seed, not just a lucky one.
        for (seed in 1L..25L) {
            val level = maze(seed)
            val floors = level.floorTiles()
            assertTrue("seed $seed produced almost no open space", floors.size > 100)
            val field = level.distanceField(floors[0].x, floors[0].y)
            val stranded = floors.filter { field[it.y * level.width + it.x] < 0 }
            assertTrue("seed $seed stranded ${stranded.size} tiles", stranded.isEmpty())
        }
    }

    @Test
    fun `line of sight is clear across open space and blocked by walls`() {
        val walls = BooleanArray(5 * 5) { false }
        for (i in 0 until 5) {
            walls[i] = true                 // top row
            walls[4 * 5 + i] = true         // bottom row
            walls[i * 5] = true             // left column
            walls[i * 5 + 4] = true         // right column
        }
        val open = Level(5, 5, walls)
        assertTrue(open.lineOfSight(Vec2(1.5f, 1.5f), Vec2(3.5f, 3.5f)))

        walls[2 * 5 + 2] = true // block the middle
        val blocked = Level(5, 5, walls)
        assertFalse(blocked.lineOfSight(Vec2(1.5f, 1.5f), Vec2(3.5f, 3.5f)))
    }

    @Test
    fun `line of sight from inside a wall is false`() {
        val walls = BooleanArray(3 * 3) { true }
        walls[1 * 3 + 1] = false
        val level = Level(3, 3, walls)
        assertFalse(level.lineOfSight(Vec2(0.5f, 0.5f), Vec2(1.5f, 1.5f)))
    }

    @Test
    fun `distance field counts steps and descend walks toward the goal`() {
        val level = maze(3)
        val floors = level.floorTiles()
        val goal = floors.last()
        val start = floors.first()
        val field = level.distanceField(goal.x, goal.y)

        assertEquals(0, field[goal.y * level.width + goal.x])

        var current = start
        var guard = level.width * level.height
        while (current != goal && guard-- > 0) {
            val next = level.descend(field, current.x, current.y)
            assertNotNull("no downhill step from $current", next)
            val step = next!!
            val here = field[current.y * level.width + current.x]
            val there = field[step.y * level.width + step.x]
            assertEquals("descend must move exactly one step closer", here - 1, there)
            current = step
        }
        assertEquals("walk never arrived", goal, current)
    }

    @Test
    fun `descend returns null at the goal`() {
        val level = maze(5)
        val goal = level.floorTiles().first()
        val field = level.distanceField(goal.x, goal.y)
        assertEquals(null, level.descend(field, goal.x, goal.y))
    }

    @Test
    fun `slide never leaves a mover inside a wall`() {
        val level = maze(11)
        val start = level.floorTiles().first().center()
        var pos = start
        val rng = Rng(99)
        repeat(4000) {
            val dir = Vec2(rng.nextFloat(-1f, 1f), rng.nextFloat(-1f, 1f)).normalized()
            pos = level.slide(pos, dir * 0.14f, Tuning.PLAYER_RADIUS)
            assertFalse(
                "escaped the maze at $pos",
                level.collidesCircle(pos.x, pos.y, Tuning.PLAYER_RADIUS),
            )
        }
    }
}
