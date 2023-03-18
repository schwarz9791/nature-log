import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { View, ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack'

// import * as Google from 'expo-auth-session/providers/google'
// import Constants from 'expo-constants'

import firebase from './lib/firebase'

import { ContextProvider, useSetMainContext } from './context/mainContext'

import LoginScreen from './components/LoginScreen'
import AppDrawer from './components/DrawerMenu'

type RootStackParamList = {
  Login: undefined
  Main: undefined
}

export type TopScreenNavigationProps = StackNavigationProp<
  RootStackParamList,
  'Login'
>

const App = () => {
  const setMainState = useSetMainContext()
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loginDisabled, setLoginDisabled] = useState(false)

  const AppStack = createStackNavigator()
  // const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  //   expoClientId: Constants.expoConfig?.extra?.webClientId,
  //   iosClientId: Constants.expoConfig?.extra?.iosClientId,
  //   androidClientId: Constants.expoConfig?.extra?.androidClientId,
  // })

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      console.log(user)
      setUserLoggedIn(user ? true : false)
      setIsLoading(false)
      setLoginDisabled(false)
      // setUserProfile(user)
      setMainState((s) => ({ ...s, userProfile: user }))
    })
    return () => unsubscribe()
  }, [])

  // useEffect(() => {
  //   if (response?.type === 'success') {
  //     // console.log(response)
  //     const { id_token, access_token } = response.params
  //     const credential = firebase.auth.GoogleAuthProvider.credential(
  //       id_token || '',
  //       access_token || ''
  //     )
  //     firebase.auth().signInWithCredential(credential)
  //   }
  // }, [response])

  if (isLoading) {
    // Checking if already logged in
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    )
  }

  return (
    <ContextProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppStack.Navigator initialRouteName="Login">
            <AppStack.Screen name="Login">
              {(props) => (
                <LoginScreen
                  setLoginDisabled={setLoginDisabled}
                  loginDisabled={loginDisabled}
                  userLoggedIn={userLoggedIn}
                  {...props}
                />
              )}
            </AppStack.Screen>
            <AppStack.Screen
              name="Main"
              component={AppDrawer}
              options={{ headerShown: false }}
            />
          </AppStack.Navigator>
        </NavigationContainer>
        <StatusBar />
      </SafeAreaProvider>
    </ContextProvider>
  )
}

export default App
