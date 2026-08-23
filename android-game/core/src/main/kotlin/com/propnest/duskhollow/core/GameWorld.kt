package com.propnest.duskhollow.core

import kotlin.math.floor
import kotlin.math.max
import kotlin.math.min

enum class Phase { TITLE, PLAYING, CAUGHT, ESCAPED }

enum class StalkerState { DORMANT, PATROL, INVESTIGATE, CHASE }

/**
 * One-shot things the renderer and audio engine react to. The simulation never
 * plays a sound itself; it just reports what happened.
 */
enum class GameEvent {
    FOOTSTEP,
    BEACON_PROGRESS_START,
    BEACON_LIT,
    ALL_BEACONS_LIT,
    STALKER_SPOTTED,
    STALKER_LOST,
    STALKER_WOKE,
    CAUGHT,
    ESCAPED,
}

/** Player intent for one frame. [moveX]/[moveY] form a vector of length <= 1. */
data class InputState(
    val moveX: Float = 0f,
    val moveY: Float = 0f,
    val sprint: Boolean = false,
)

class Beacon(val pos: Vec2) {
    var lit: Boolean = false
        internal set
    var progress: Float = 0f
        internal set
}

class Player(var pos: Vec2) {
    var facing: Vec2 = Vec2(0f, 1f)
    var stamina: Float = 1f
    var lanternFuel: Float = 1f
    var moving: Boolean = false
    var sprinting: Boolean = false
    internal var stepAccumulator: Float = 0f
}

class Stalker(var pos: Vec2) {
    var state: StalkerState = StalkerState.DORMANT
    var facing: Vec2 = Vec2(0f, 1f)
    var speed: Float = 0f
    /** Where it is heading; the player's last known position while hunting. */
    var target: Vec2 = pos
    internal var field: IntArray? = null
    internal var fieldGoal: TileCoord? = null
    internal var fieldAge: Float = 0f
    internal var lostSightTimer: Float = 0f
    internal var pauseTimer: Float = 0f
}

/**
 * The whole game simulation. Deliberately free of Android imports so it runs and is
 * tested on the JVM; the app module only draws what this exposes.
 */
class GameWorld(val seed: Long) {

    private val rng = Rng(seed)

    val level: Level = generateLevel(Tuning.MAZE_WIDTH, Tuning.MAZE_HEIGHT, rng)

    val exit: Vec2
    val player: Player
    val stalker: Stalker
    val beacons: List<Beacon>

    /** Tiles the player has lit at some point; drives the remembered-walls look. */
    val discovered = BooleanArray(level.width * level.height)

    var phase: Phase = Phase.PLAYING
        private set
    var fear: Float = 0f
        private set
    var elapsed: Float = 0f
        private set
    var stalkerVisible: Boolean = false
        private set

    private val pendingEvents = ArrayList<GameEvent>(8)
    private var discoveryTimer = 0f
    private var wokeTimer = 0f

    init {
        val floors = level.floorTiles()
        require(floors.size >= Tuning.BEACON_COUNT + 2) { "level has too little open space" }

        val startTile = floors.first()
        exit = startTile.center()
        player = Player(exit)

        beacons = pickBeaconSites(floors, startTile).map { Beacon(it.center()) }

        // Start the stalker as far from the player as the maze allows.
        val startField = level.distanceField(startTile.x, startTile.y)
        val farthest = floors.maxByOrNull { startField[it.y * level.width + it.x] } ?: floors.last()
        stalker = Stalker(farthest.center())
        stalker.target = farthest.center()
        stalker.speed = Tuning.STALKER_PATROL_SPEED

        markDiscovered()
    }

    /**
     * Spreads the beacons out: repeatedly takes the reachable tile farthest from
     * everything chosen so far, so no two objectives sit in the same corner.
     */
    private fun pickBeaconSites(floors: List<TileCoord>, start: TileCoord): List<TileCoord> {
        val chosen = ArrayList<TileCoord>(Tuning.BEACON_COUNT)
        val minDistance = IntArray(level.width * level.height) { Int.MAX_VALUE }

        fun absorb(tile: TileCoord) {
            val field = level.distanceField(tile.x, tile.y)
            for (i in field.indices) {
                val d = field[i]
                if (d >= 0 && d < minDistance[i]) minDistance[i] = d
            }
        }

        absorb(start)
        repeat(Tuning.BEACON_COUNT) {
            val next = floors
                .filter { minDistance[it.y * level.width + it.x] != Int.MAX_VALUE }
                .maxByOrNull { minDistance[it.y * level.width + it.x] }
                ?: return@repeat
            chosen.add(next)
            absorb(next)
        }
        return chosen
    }

    val litBeacons: Int get() = beacons.count { it.lit }
    val allBeaconsLit: Boolean get() = litBeacons == beacons.size

    /** Light reach right now; shrinks as the lantern burns down. */
    val lightRadius: Float
        get() = lerp(Tuning.LIGHT_RADIUS_MIN, Tuning.LIGHT_RADIUS_MAX, player.lanternFuel)

    /** 0 when safe, 1 when the stalker is on top of the player. Drives audio and shake. */
    val danger: Float
        get() {
            val d = player.pos.distanceTo(stalker.pos)
            val proximity = clamp(1f - d / Tuning.FEAR_RANGE, 0f, 1f)
            val chasing = if (stalker.state == StalkerState.CHASE) 0.35f else 0f
            return clamp(max(proximity, chasing) + if (stalkerVisible) 0.2f else 0f, 0f, 1f)
        }

    /** Returns the events since the last call and clears them. */
    fun drainEvents(): List<GameEvent> {
        if (pendingEvents.isEmpty()) return emptyList()
        val out = ArrayList(pendingEvents)
        pendingEvents.clear()
        return out
    }

    fun update(dt: Float, input: InputState) {
        if (phase != Phase.PLAYING) return
        val step = min(dt, 0.05f) // A long frame must not teleport anyone through a wall.
        elapsed += step

        updatePlayer(step, input)
        updateLantern(step)
        updateBeacons(step)
        updateStalker(step)
        updateFear(step)
        updateDiscovery(step)
        checkEnding()
    }

    private fun updatePlayer(dt: Float, input: InputState) {
        var dir = Vec2(input.moveX, input.moveY)
        if (dir.length > 1f) dir = dir.normalized()
        val wantsToMove = dir.length > 0.05f

        val canSprint = input.sprint && player.stamina > Tuning.STAMINA_MIN_TO_SPRINT && wantsToMove
        player.sprinting = canSprint
        player.moving = wantsToMove

        player.stamina = if (canSprint) {
            clamp(player.stamina - Tuning.STAMINA_DRAIN * dt, 0f, 1f)
        } else {
            clamp(player.stamina + Tuning.STAMINA_RECOVER * dt, 0f, 1f)
        }

        if (wantsToMove) {
            val speed = if (canSprint) Tuning.SPRINT_SPEED else Tuning.WALK_SPEED
            val before = player.pos
            player.pos = level.slide(player.pos, dir * (speed * dt), Tuning.PLAYER_RADIUS)
            player.facing = dir.normalized()

            player.stepAccumulator += player.pos.distanceTo(before)
            val stride = if (canSprint) Tuning.FOOTSTEP_INTERVAL * 0.7f else Tuning.FOOTSTEP_INTERVAL
            if (player.stepAccumulator >= stride) {
                player.stepAccumulator = 0f
                pendingEvents.add(GameEvent.FOOTSTEP)
            }
        }
    }

    private fun updateLantern(dt: Float) {
        player.lanternFuel = clamp(player.lanternFuel - Tuning.LANTERN_DRAIN * dt, 0f, 1f)
    }

    private fun updateBeacons(dt: Float) {
        for (beacon in beacons) {
            if (beacon.lit) continue
            if (player.pos.distanceTo(beacon.pos) <= Tuning.BEACON_REACH) {
                if (beacon.progress == 0f) pendingEvents.add(GameEvent.BEACON_PROGRESS_START)
                beacon.progress = clamp(beacon.progress + dt / Tuning.BEACON_LIGHT_TIME, 0f, 1f)
                if (beacon.progress >= 1f) {
                    beacon.lit = true
                    player.lanternFuel = 1f
                    pendingEvents.add(GameEvent.BEACON_LIT)
                    // Lighting up is loud. The stalker comes looking.
                    alertStalker(player.pos)
                    if (allBeaconsLit) pendingEvents.add(GameEvent.ALL_BEACONS_LIT)
                }
            } else {
                beacon.progress = clamp(beacon.progress - dt / Tuning.BEACON_LIGHT_TIME, 0f, 1f)
            }
        }
    }

    private fun alertStalker(where: Vec2) {
        if (stalker.state == StalkerState.DORMANT) return
        if (stalker.state != StalkerState.CHASE) {
            stalker.state = StalkerState.INVESTIGATE
            stalker.pauseTimer = 0f
        }
        stalker.target = where
    }

    private fun updateStalker(dt: Float) {
        val s = stalker
        if (s.state == StalkerState.DORMANT) {
            wokeTimer += dt
            if (wokeTimer >= Tuning.STALKER_DORMANT_TIME) {
                s.state = StalkerState.PATROL
                s.target = randomFloor().center()
                pendingEvents.add(GameEvent.STALKER_WOKE)
            }
            return
        }

        val toPlayer = player.pos.distanceTo(s.pos)
        val sightRange = Tuning.STALKER_SIGHT_RANGE + litBeacons * 0.5f
        val canSee = toPlayer <= sightRange && level.lineOfSight(s.pos, player.pos)
        val wasVisible = stalkerVisible
        stalkerVisible = canSee && toPlayer <= lightRadius + 2.5f
        if (stalkerVisible && !wasVisible) pendingEvents.add(GameEvent.STALKER_SPOTTED)

        val noise = when {
            player.sprinting -> 1f
            player.moving -> 0.45f
            else -> 0.05f
        }
        val hears = toPlayer <= Tuning.STALKER_HEAR_RANGE * noise

        when (s.state) {
            StalkerState.DORMANT -> Unit

            StalkerState.PATROL -> {
                if (canSee) {
                    s.state = StalkerState.CHASE
                    s.lostSightTimer = 0f
                } else if (hears) {
                    s.state = StalkerState.INVESTIGATE
                    s.target = player.pos
                    s.pauseTimer = 0f
                } else if (s.pos.distanceTo(s.target) < 0.6f) {
                    s.target = randomFloor().center()
                }
            }

            StalkerState.INVESTIGATE -> {
                if (canSee) {
                    s.state = StalkerState.CHASE
                    s.lostSightTimer = 0f
                } else if (hears) {
                    s.target = player.pos
                    s.pauseTimer = 0f
                } else if (s.pos.distanceTo(s.target) < 0.6f) {
                    s.pauseTimer += dt
                    if (s.pauseTimer >= Tuning.STALKER_INVESTIGATE_PAUSE) {
                        s.state = StalkerState.PATROL
                        s.pauseTimer = 0f
                        s.target = randomFloor().center()
                    }
                }
            }

            StalkerState.CHASE -> {
                if (canSee) {
                    s.lostSightTimer = 0f
                    s.target = player.pos
                } else {
                    s.lostSightTimer += dt
                    if (s.lostSightTimer >= Tuning.STALKER_LOSE_SIGHT_TIME) {
                        s.state = StalkerState.INVESTIGATE
                        s.lostSightTimer = 0f
                        s.pauseTimer = 0f
                        pendingEvents.add(GameEvent.STALKER_LOST)
                    }
                }
            }
        }

        val base = if (s.state == StalkerState.CHASE) {
            Tuning.STALKER_CHASE_SPEED
        } else {
            Tuning.STALKER_PATROL_SPEED
        }
        s.speed = base + litBeacons * Tuning.STALKER_SPEED_PER_BEACON

        moveStalker(dt)

        if (player.pos.distanceTo(s.pos) <= Tuning.STALKER_CATCH_RADIUS) {
            phase = Phase.CAUGHT
            pendingEvents.add(GameEvent.CAUGHT)
        }
    }

    private fun moveStalker(dt: Float) {
        val s = stalker
        if (s.state == StalkerState.INVESTIGATE && s.pos.distanceTo(s.target) < 0.6f) return

        val goal = TileCoord(floor(s.target.x).toInt(), floor(s.target.y).toInt())
        s.fieldAge += dt
        if (s.field == null || s.fieldGoal != goal || s.fieldAge >= Tuning.STALKER_FIELD_INTERVAL) {
            s.field = level.distanceField(goal.x, goal.y)
            s.fieldGoal = goal
            s.fieldAge = 0f
        }

        val field = s.field ?: return
        val here = TileCoord(floor(s.pos.x).toInt(), floor(s.pos.y).toInt())
        // Inside the goal tile, steer at the exact target rather than a tile centre.
        val aim = if (here == goal) {
            s.target
        } else {
            level.descend(field, here.x, here.y)?.center() ?: return
        }

        val dir = (aim - s.pos).normalized()
        if (dir.length < 1e-4f) return
        s.facing = dir
        s.pos = level.slide(s.pos, dir * (s.speed * dt), Tuning.STALKER_RADIUS)
    }

    private fun updateFear(dt: Float) {
        val darkness = 1f - player.lanternFuel
        val target = clamp(danger * 0.75f + darkness * 0.35f, 0f, 1f)
        val rate = if (target > fear) Tuning.FEAR_RISE else Tuning.FEAR_FALL
        fear = clamp(approach(fear, target, rate * dt), 0f, 1f)
    }

    private fun updateDiscovery(dt: Float) {
        discoveryTimer += dt
        if (discoveryTimer < Tuning.DISCOVERY_INTERVAL) return
        discoveryTimer = 0f
        markDiscovered()
    }

    private fun markDiscovered() {
        val radius = lightRadius
        val r = radius.toInt() + 1
        val px = floor(player.pos.x).toInt()
        val py = floor(player.pos.y).toInt()
        for (y in (py - r)..(py + r)) {
            for (x in (px - r)..(px + r)) {
                if (x < 0 || y < 0 || x >= level.width || y >= level.height) continue
                val idx = y * level.width + x
                if (discovered[idx]) continue
                val center = Vec2(x + 0.5f, y + 0.5f)
                if (player.pos.distanceTo(center) > radius) continue
                if (level.lineOfSight(player.pos, center)) discovered[idx] = true
            }
        }
    }

    private fun checkEnding() {
        if (allBeaconsLit && player.pos.distanceTo(exit) <= Tuning.EXIT_REACH) {
            phase = Phase.ESCAPED
            pendingEvents.add(GameEvent.ESCAPED)
        }
    }

    private fun randomFloor(): TileCoord {
        val floors = level.floorTiles()
        return floors[rng.nextInt(floors.size)]
    }
}
