import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { View, ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack'

import firebase from './lib/firebase'

import { ContextProvider, useSetMainContext } from './context/mainContext'

import LoginScreen from './screens/LoginScreen'
import MainTabs from './components/MainTabs'

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
              component={MainTabs}
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
