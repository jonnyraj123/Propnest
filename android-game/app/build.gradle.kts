import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

// Release signing comes from the environment so no key material lives in the repo.
// Without it the release build is simply unsigned, which keeps local builds working.
// CI passes these through as empty strings when the secrets are not set, so blank
// has to count as absent - an empty path would otherwise be taken as a real file.
fun envOrNull(name: String): String? = System.getenv(name)?.takeIf { it.isNotBlank() }

val keystorePath = envOrNull("DUSKHOLLOW_KEYSTORE")
val keystorePassword = envOrNull("DUSKHOLLOW_KEYSTORE_PASSWORD")
val keystoreAlias = envOrNull("DUSKHOLLOW_KEY_ALIAS")
val keyPassword = envOrNull("DUSKHOLLOW_KEY_PASSWORD")

// Partial credentials fail deep inside the packaging task with a poor message, so
// only wire up signing when all four are present.
val canSignRelease = keystorePath != null &&
    keystorePassword != null &&
    keystoreAlias != null &&
    keyPassword != null

android {
    namespace = "com.propnest.duskhollow"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.propnest.duskhollow"
        minSdk = 24
        targetSdk = 36
        versionCode = envOrNull("DUSKHOLLOW_VERSION_CODE")?.toIntOrNull() ?: 1
        versionName = envOrNull("DUSKHOLLOW_VERSION_NAME") ?: "1.0"
    }

    signingConfigs {
        if (canSignRelease) {
            create("release") {
                storeFile = file(keystorePath!!)
                storePassword = keystorePassword
                keyAlias = keystoreAlias
                this.keyPassword = keyPassword
            }
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            signingConfig = signingConfigs.findByName("release")
        }
        debug {
            applicationIdSuffix = ".debug"
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    buildFeatures {
        compose = true
    }

    packaging {
        resources.excludes += "/META-INF/{AL2.0,LGPL2.1}"
    }
}

kotlin {
    compilerOptions {
        jvmTarget.set(JvmTarget.JVM_17)
    }
}

dependencies {
    implementation(project(":core"))
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(platform(libs.compose.bom))
    implementation(libs.compose.ui)
    implementation(libs.compose.ui.graphics)
    implementation(libs.compose.foundation)
}
