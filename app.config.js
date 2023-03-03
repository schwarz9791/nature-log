import 'dotenv/config'

export default {
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
}
