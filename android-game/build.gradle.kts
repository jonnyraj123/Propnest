// Plugins are declared per-module, not here. Declaring the Android plugin at the
// root - even with `apply false` - forces Gradle to resolve it on every build,
// which breaks environments that only build :core.
