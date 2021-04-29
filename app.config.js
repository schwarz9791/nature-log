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
    webKey: process.env.WEB_KEY,
    iosClientId: process.env.IOS_CLIENT_ID,
    androidClientId: process.env.ANDROID_CLIENT_ID,
  },
}
