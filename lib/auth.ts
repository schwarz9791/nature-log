import * as GoogleAuthentication from 'expo-google-app-auth'
import Constants from 'expo-constants'
import firebase from 'firebase'
import Firebase from './fire'
import { TopScreenNavigationProps } from '../App'

export const signInWithGoogle = async ({
  navigation,
}: {
  navigation: TopScreenNavigationProps
}) => {
  try {
    console.log(Constants.manifest.extra)
    const result = await GoogleAuthentication.logInAsync({
      iosClientId: Constants.manifest.extra?.iosClientId,
      androidClientId: Constants.manifest.extra?.androidClientId,
      scopes: ['profile', 'email'],
    })
    if (result.type === 'success') {
      // console.log(result)
      // setIsLoading(true)
      const credential = firebase.auth.GoogleAuthProvider.credential(
        result.idToken || '',
        result.accessToken || ''
      )
      Firebase.auth()
        .signInWithCredential(credential)
        .then(() => {
          navigation.push('Main')
        })
        .catch((e) => {
          console.log(
            `Authentication credential error. [Message]: ${e.message}`
          )
        })
    } else {
      console.log('Do authentication cancel.')
    }
  } catch (e) {
    alert(`Login failed. [Message]: ${e.message}`)
  }
}
