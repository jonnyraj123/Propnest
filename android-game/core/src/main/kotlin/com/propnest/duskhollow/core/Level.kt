package com.propnest.duskhollow.core

import kotlin.math.abs
import kotlin.math.floor

/**
 * The maze the game is played in. Tiles are 1x1 world units; [walls] is row-major
 * and `true` means solid. Anything outside the grid counts as solid.
 */
class Level(
    val width: Int,
    val height: Int,
    private val walls: BooleanArray,
) {
    init {
        require(walls.size == width * height) {
            "walls must hold width*height entries, got ${walls.size} for ${width}x$height"
        }
    }

    fun isWall(x: Int, y: Int): Boolean =
        x < 0 || y < 0 || x >= width || y >= height || walls[y * width + x]

    fun isFloor(x: Int, y: Int): Boolean = !isWall(x, y)

    /** True when a circle at ([x], [y]) with [radius] overlaps any solid tile. */
    fun collidesCircle(x: Float, y: Float, radius: Float): Boolean {
        val minX = floor(x - radius).toInt()
        val maxX = floor(x + radius).toInt()
        val minY = floor(y - radius).toInt()
        val maxY = floor(y + radius).toInt()
        for (ty in minY..maxY) {
            for (tx in minX..maxX) {
                if (!isWall(tx, ty)) continue
                // Closest point on the tile to the circle centre.
                val cx = clamp(x, tx.toFloat(), tx + 1f)
                val cy = clamp(y, ty.toFloat(), ty + 1f)
                if (len(x - cx, y - cy) < radius) return true
            }
        }
        return false
    }

    /**
     * Slides a circle from [from] by [delta], resolving each axis separately so the
     * mover glides along walls instead of sticking to them.
     */
    fun slide(from: Vec2, delta: Vec2, radius: Float): Vec2 {
        var x = from.x
        var y = from.y
        val nx = x + delta.x
        if (!collidesCircle(nx, y, radius)) x = nx
        val ny = y + delta.y
        if (!collidesCircle(x, ny, radius)) y = ny
        return Vec2(x, y)
    }

    /**
     * Grid traversal (Amanatides-Woo) from [a] to [b]. Returns false as soon as a
     * solid tile lies on the segment.
     */
    fun lineOfSight(a: Vec2, b: Vec2): Boolean {
        var x = floor(a.x).toInt()
        var y = floor(a.y).toInt()
        val endX = floor(b.x).toInt()
        val endY = floor(b.y).toInt()
        if (isWall(x, y)) return false
        if (x == endX && y == endY) return true

        val dx = b.x - a.x
        val dy = b.y - a.y
        val stepX = if (dx >= 0f) 1 else -1
        val stepY = if (dy >= 0f) 1 else -1
        val tDeltaX = if (dx != 0f) abs(1f / dx) else Float.MAX_VALUE
        val tDeltaY = if (dy != 0f) abs(1f / dy) else Float.MAX_VALUE
        var tMaxX = when {
            dx > 0f -> (x + 1f - a.x) / dx
            dx < 0f -> (x - a.x) / dx
            else -> Float.MAX_VALUE
        }
        var tMaxY = when {
            dy > 0f -> (y + 1f - a.y) / dy
            dy < 0f -> (y - a.y) / dy
            else -> Float.MAX_VALUE
        }

        // The segment spans t in [0, 1]; the guard also bounds a degenerate walk.
        var guard = 4 * (width + height)
        while (guard-- > 0) {
            if (tMaxX < tMaxY) {
                if (tMaxX > 1f) return true
                tMaxX += tDeltaX
                x += stepX
            } else {
                if (tMaxY > 1f) return true
                tMaxY += tDeltaY
                y += stepY
            }
            if (isWall(x, y)) return false
            if (x == endX && y == endY) return true
        }
        return false
    }

    /**
     * Breadth-first step count from every reachable floor tile to ([goalX], [goalY]),
     * or -1 where there is no route. The stalker follows this downhill, so one field
     * serves many frames of pursuit.
     */
    fun distanceField(goalX: Int, goalY: Int): IntArray {
        val field = IntArray(width * height) { -1 }
        if (isWall(goalX, goalY)) return field
        val queue = IntArray(width * height)
        var head = 0
        var tail = 0
        val start = goalY * width + goalX
        field[start] = 0
        queue[tail++] = start

        while (head < tail) {
            val cur = queue[head++]
            val cx = cur % width
            val cy = cur / width
            val next = field[cur] + 1
            for (d in 0 until 4) {
                val nx = cx + NEIGHBOUR_X[d]
                val ny = cy + NEIGHBOUR_Y[d]
                if (isWall(nx, ny)) continue
                val idx = ny * width + nx
                if (field[idx] != -1) continue
                field[idx] = next
                queue[tail++] = idx
            }
        }
        return field
    }

    /**
     * The neighbouring tile one step closer to the field's goal, or null when the
     * tile is unreachable or already at the goal.
     */
    fun descend(field: IntArray, fromX: Int, fromY: Int): TileCoord? {
        if (fromX < 0 || fromY < 0 || fromX >= width || fromY >= height) return null
        val here = field[fromY * width + fromX]
        if (here <= 0) return null
        var best: TileCoord? = null
        var bestDist = here
        for (d in 0 until 4) {
            val nx = fromX + NEIGHBOUR_X[d]
            val ny = fromY + NEIGHBOUR_Y[d]
            if (isWall(nx, ny)) continue
            val v = field[ny * width + nx]
            if (v != -1 && v < bestDist) {
                bestDist = v
                best = TileCoord(nx, ny)
            }
        }
        return best
    }

    fun floorTiles(): List<TileCoord> {
        val out = ArrayList<TileCoord>()
        for (y in 0 until height) {
            for (x in 0 until width) {
                if (isFloor(x, y)) out.add(TileCoord(x, y))
            }
        }
        return out
    }

    companion object {
        val NEIGHBOUR_X = intArrayOf(1, -1, 0, 0)
        val NEIGHBOUR_Y = intArrayOf(0, 0, 1, -1)
    }
}

data class TileCoord(val x: Int, val y: Int) {
    /** World position of this tile's centre. */
    fun center(): Vec2 = Vec2(x + 0.5f, y + 0.5f)
}

/**
 * Carves a maze with a recursive backtracker, then reopens a fraction of the
 * interior walls. The loops matter: in a perfect maze every dead end is a death
 * sentence once the stalker commits to a chase.
 *
 * [width] and [height] are forced odd so the carve grid lines up.
 */
fun generateLevel(width: Int, height: Int, rng: Rng, loopChance: Float = 0.12f): Level {
    val w = if (width % 2 == 0) width + 1 else width
    val h = if (height % 2 == 0) height + 1 else height
    val walls = BooleanArray(w * h) { true }

    fun idx(x: Int, y: Int) = y * w + x

    val stack = ArrayList<TileCoord>()
    var cx = 1
    var cy = 1
    walls[idx(cx, cy)] = false
    stack.add(TileCoord(cx, cy))

    while (stack.isNotEmpty()) {
        val current = stack[stack.size - 1]
        cx = current.x
        cy = current.y
        val candidates = ArrayList<TileCoord>(4)
        for (d in 0 until 4) {
            val nx = cx + Level.NEIGHBOUR_X[d] * 2
            val ny = cy + Level.NEIGHBOUR_Y[d] * 2
            if (nx in 1 until w - 1 && ny in 1 until h - 1 && walls[idx(nx, ny)]) {
                candidates.add(TileCoord(nx, ny))
            }
        }
        if (candidates.isEmpty()) {
            stack.removeAt(stack.size - 1)
            continue
        }
        val next = candidates[rng.nextInt(candidates.size)]
        walls[idx((cx + next.x) / 2, (cy + next.y) / 2)] = false
        walls[idx(next.x, next.y)] = false
        stack.add(next)
    }

    // Reopen some interior walls to create loops and alternate routes.
    for (y in 1 until h - 1) {
        for (x in 1 until w - 1) {
            if (!walls[idx(x, y)]) continue
            // Only knock out a wall that separates two corridors.
            val horizontal = !walls[idx(x - 1, y)] && !walls[idx(x + 1, y)]
            val vertical = !walls[idx(x, y - 1)] && !walls[idx(x, y + 1)]
            if ((horizontal || vertical) && rng.nextFloat() < loopChance) {
                walls[idx(x, y)] = false
            }
        }
    }

    return Level(w, h, walls)
}
