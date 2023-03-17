import 'dotenv/config'

export default {
  name: 'Nature Log',
  slug: 'nature-log',
  scheme: 'nature-log',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  jsEngine: 'hermes',
  ios: {
    bundleIdentifier: 'tech.sukima.nature-log',
    googleServicesFile: './GoogleService-Info.plist',
  },
  android: {
    package: 'tech.sukima.nature_log',
    googleServicesFile: './google-services.json',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    webClientId: process.env.WEB_CLIENT_ID,
    iosClientId: process.env.IOS_CLIENT_ID,
    androidClientId: process.env.ANDROID_CLIENT_ID,
    eas: {
      projectId: 'f72d1397-7f8d-48f6-a68c-aee29f695716',
    },
  },
  updates: {
    url: 'https://u.expo.dev/f72d1397-7f8d-48f6-a68c-aee29f695716',
  },
  runtimeVersion: {
    policy: 'sdkVersion',
  },
  description: '',
  githubUrl: 'https://github.com/schwarz9791/nature-log',
}
