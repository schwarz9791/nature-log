import React, { useEffect, useState, useMemo } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { View, ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack'

import firebase from 'firebase'

import Firebase from './lib/fire'
import { signInWithGoogle } from './lib/auth'

import mainContext from './context/mainContext'

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
  const [userLogged, setUserLogged] = useState(false)
  const [userProfile, setUserProfile] = useState<firebase.User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [targetAirConId, setTargetAirConId] = useState('')

  const mainC = useMemo(
    () => ({
      userProfile: { userProfile },
      signOutUser: ({
        navigation,
      }: {
        navigation: TopScreenNavigationProps
      }) => {
        Firebase.auth().signOut()
        navigation.popToTop()
      },
      handleSignInWithGoogle: ({
        navigation,
      }: {
        navigation: TopScreenNavigationProps
      }) => {
        signInWithGoogle({ navigation })
      },
      targetAirConId: '',
      handleSetTargetAirConId: (id: string) => setTargetAirConId(() => id),
    }),
    []
  )
  const AppStack = createStackNavigator()

  useEffect(() => {
    const authListener = Firebase.auth().onAuthStateChanged((user) => {
      // console.log(user)
      setUserLogged(user ? true : false)
      setIsLoading(false)
      setUserProfile(user)
    })
    return authListener
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
    <mainContext.Provider value={mainC}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppStack.Navigator initialRouteName="Login" headerMode="none">
            <AppStack.Screen name="Login">
              {(props) => <LoginScreen userLogged {...props} />}
            </AppStack.Screen>
            <AppStack.Screen name="Main" component={AppDrawer} />
          </AppStack.Navigator>
        </NavigationContainer>
        <StatusBar />
      </SafeAreaProvider>
    </mainContext.Provider>
  )
}

export default App
