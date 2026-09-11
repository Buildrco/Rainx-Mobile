# RainX — Native Mobile App

This project is a native React Native / Expo implementation of RainX. It contains no Capacitor, WebView, Vite runtime, React DOM, or browser UI layer.

The old RainX web/Capacitor application remains separate. This app connects directly to the existing RainX Supabase project and preserves server-side account/security/trading functions.

## Android APK

GitHub Actions runs Expo prebuild and Gradle to produce an installable APK. Configure Firebase/FCM credentials and Android signing secrets in GitHub before a production release.
