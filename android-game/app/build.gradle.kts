import org.jetbrains.kotlin.gradle.dsl.JvmTarget

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

// Release signing comes from the environment so no key material lives in the repo.
// Without it the release build is simply unsigned, which keeps local builds working.
val keystorePath: String? = System.getenv("DUSKHOLLOW_KEYSTORE")

android {
    namespace = "com.propnest.duskhollow"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.propnest.duskhollow"
        minSdk = 24
        targetSdk = 35
        versionCode = (System.getenv("DUSKHOLLOW_VERSION_CODE") ?: "1").toInt()
        versionName = System.getenv("DUSKHOLLOW_VERSION_NAME") ?: "1.0"
    }

    signingConfigs {
        if (keystorePath != null) {
            create("release") {
                storeFile = file(keystorePath)
                storePassword = System.getenv("DUSKHOLLOW_KEYSTORE_PASSWORD")
                keyAlias = System.getenv("DUSKHOLLOW_KEY_ALIAS")
                keyPassword = System.getenv("DUSKHOLLOW_KEY_PASSWORD")
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
