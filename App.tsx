import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { AppState, View, ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack'
import { SWRConfig } from 'swr'

import firebase from './lib/firebase'

import { ContextProvider } from './context/mainContext'

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
  const [isLoading, setIsLoading] = useState(true)
  const [loginDisabled, setLoginDisabled] = useState(false)
  const [userAccount, setUserAccount] = useState<firebase.User | null>(null)

  const AppStack = createStackNavigator()

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setIsLoading(false)
      setLoginDisabled(false)
      setUserAccount(user)
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
    <SWRConfig
      value={{
        provider: () => new Map(),
        isVisible: () => {
          return true
        },
        initFocus(callback) {
          let appState: string = AppState.currentState

          const onAppStateChange = (nextAppState: string) => {
            /* バックグラウンドモードまたは非アクティブモードからアクティブモードに再開する場合 */
            if (
              appState.match(/inactive|background/) &&
              nextAppState === 'active'
            ) {
              callback()
            }
            appState = nextAppState
          }

          // アプリの状態変更を監視する
          AppState.addEventListener('change', onAppStateChange)

          return () => {
            AppState.removeEventListener('change', onAppStateChange)
          }
        },
      }}
    >
      <ContextProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <AppStack.Navigator initialRouteName="Login">
              <AppStack.Screen name="Login">
                {(props) => (
                  <LoginScreen
                    setLoginDisabled={setLoginDisabled}
                    loginDisabled={loginDisabled}
                    userAccount={userAccount}
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
    </SWRConfig>
  )
}

export default App
