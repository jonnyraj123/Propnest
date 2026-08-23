pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
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
