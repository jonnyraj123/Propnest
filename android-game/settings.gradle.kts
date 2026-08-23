pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
    // Plugin versions live here so the modules can apply them without a version.
    // Declaring them per-module makes Kotlin warn that its plugin is loaded twice.
    plugins {
        id("com.android.application") version "8.7.3"
        id("org.jetbrains.kotlin.android") version "2.0.21"
        id("org.jetbrains.kotlin.jvm") version "2.0.21"
        id("org.jetbrains.kotlin.plugin.compose") version "2.0.21"
    }
}

dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "duskhollow"

include(":core")

// :app needs an installed Android SDK. Including it unconditionally makes every
// Gradle invocation fail on a machine without one, which would also block :core's
// tests. CI and normal dev machines have the SDK, so :app is included there.
val androidSdkDir: String? = sequenceOf(
    System.getenv("ANDROID_HOME"),
    System.getenv("ANDROID_SDK_ROOT"),
    file("local.properties").takeIf { it.exists() }?.let { props ->
        java.util.Properties().apply { props.inputStream().use { load(it) } }.getProperty("sdk.dir")
    },
).firstOrNull { !it.isNullOrBlank() }

if (androidSdkDir != null) {
    include(":app")
} else {
    logger.lifecycle("Android SDK not found - skipping :app. Only :core will build.")
}
