package com.propnest.duskhollow.core

/** Every gameplay constant in one place, so the feel can be tuned without hunting. */
object Tuning {
    const val MAZE_WIDTH = 31
    const val MAZE_HEIGHT = 31

    const val PLAYER_RADIUS = 0.28f
    const val WALK_SPEED = 2.5f
    const val SPRINT_SPEED = 4.3f
    const val STAMINA_DRAIN = 0.34f
    const val STAMINA_RECOVER = 0.22f
    const val STAMINA_MIN_TO_SPRINT = 0.15f
    const val FOOTSTEP_INTERVAL = 0.72f

    const val LANTERN_DRAIN = 0.0115f
    const val LIGHT_RADIUS_MIN = 2.2f
    const val LIGHT_RADIUS_MAX = 7.0f

    const val BEACON_COUNT = 5
    const val BEACON_REACH = 1.1f
    const val BEACON_LIGHT_TIME = 1.6f
    const val EXIT_REACH = 1.0f

    const val STALKER_RADIUS = 0.3f
    const val STALKER_PATROL_SPEED = 1.75f
    const val STALKER_CHASE_SPEED = 2.85f
    /** Added to both speeds for every beacon already lit. */
    const val STALKER_SPEED_PER_BEACON = 0.2f
    const val STALKER_SIGHT_RANGE = 9.0f
    const val STALKER_HEAR_RANGE = 11.0f
    const val STALKER_CATCH_RADIUS = 0.62f
    const val STALKER_LOSE_SIGHT_TIME = 2.6f
    const val STALKER_INVESTIGATE_PAUSE = 1.4f
    const val STALKER_FIELD_INTERVAL = 0.3f
    /** Head start before the stalker wakes up, in seconds. */
    const val STALKER_DORMANT_TIME = 6.0f

    const val FEAR_RANGE = 8.0f
    const val FEAR_RISE = 0.85f
    const val FEAR_FALL = 0.35f

    const val DISCOVERY_INTERVAL = 0.1f
}
