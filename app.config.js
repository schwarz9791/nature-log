import 'dotenv/config'

export default {
  owner: 'masakichi2',
  name: 'Nature Log',
  slug: process.env.EXPO_PROJECT_SLUG,
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
    config: {
      googleSignIn: {
        reservedClientId:
          'com.googleusercontent.apps.255480789690-6ln7342qonu51sa7349fo36tv6oqba3j',
      },
    },
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
      projectId: process.env.EXPO_PROJECT_ID,
    },
  },
  updates: {
    url: `https://u.expo.dev/${process.env.EXPO_PROJECT_ID}`,
  },
  runtimeVersion: {
    policy: 'sdkVersion',
  },
  description: '',
  githubUrl: 'https://github.com/schwarz9791/nature-log',
}
