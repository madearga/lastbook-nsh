#!/bin/sh
# Gate Android untuk nsh — teruji di Debian 13 (4 vCPU), Rust stable 1.100.
# Kebutuhan: Android SDK di $ANDROID_HOME (cmdline-tools + licenses), JDK, Rust stable >= 1.97, git.
# Hasil: .nsh/out/Gallery.apk (arm64-v8a + armeabi-v7a, debug-signed).
set -ex
: "${ANDROID_HOME:?set ANDROID_HOME to your Android SDK}"

SDKM=$(ls "$ANDROID_HOME"/cmdline-tools/*/bin/sdkmanager | head -1)

# 1. NDK (r28b) — tanpa ini cc-rs tidak menemukan aarch64-linux-android-clang
yes | $SDKM --licenses >/dev/null 2>&1 || true
$SDKM "ndk;28.2.13676358" || $SDKM "ndk;27.2.12479018"

# 2. platform + build-tools 35 — R8 bawaan build-tools 34 (8.2.2-dev) crash
#    NullPointerException saat dex; xtask memilih build-tools terbaru.
$SDKM "platforms;android-35" "platform-tools" "build-tools;35.0.0"

# 3. libclang untuk bindgen quickjs-jit-sys (build.rs butuh libclang.so)
sudo apt-get update -qq && sudo apt-get install -y -qq libclang-dev clang

# 4. Target Rust Android (sesuai rust-toolchain.toml nsh)
rustup target add aarch64-linux-android armv7-linux-androideabi x86_64-linux-android

# 5. Runtime Android (libnsh.so per ABI + classes.dex) lalu package APK
git clone --depth 1 https://github.com/longbridge/nsh
cd nsh
cargo xtask android --release
cargo run --release -p nsh-cli --bin nsh -- package examples/gallery --target android

ls -lh .nsh/out/*.apk || find target -name '*.apk' -exec ls -lh {} \;
echo GATE_DONE
