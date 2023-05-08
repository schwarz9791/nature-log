import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'

import { Input, Button } from '@rneui/themed'

import firebase, { handleLogin } from '../lib/firebase'

// import loc from '../utils/localization';
import { useMainContext, useSetMainContext } from '../context/mainContext'
import { TopScreenNavigationProps } from '../App'

export default function LoginScreen({
  navigation,
  userLoggedIn,
  loginDisabled,
  setLoginDisabled,
  userProfile,
}: {
  navigation: TopScreenNavigationProps
  userLoggedIn: boolean
  loginDisabled: boolean
  setLoginDisabled: Function
  userProfile: firebase.UserInfo | null
}) {
  const { email, password } = useMainContext()
  const setMainState = useSetMainContext()
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  //console.log(mainContext);

  const verifyEmail = (str: string) => {
    // TODO: あとでちゃんとする
    if (!str) return "Oops! that's not correct."
    return ''
  }

  const handleChangeEmail = (email: string) => {
    setEmailError(verifyEmail(email))

    if (!emailError) {
      setMainState((s) => ({ ...s, email }))
    }
  }

  const verifyPassword = (str: string) => {
    // TODO: あとでちゃんとする
    if (!str) return "Oops! that's not correct."
    return ''
  }

  const handleChangePassword = (password: string) => {
    setPasswordError(verifyPassword(password))

    if (!passwordError) {
      setMainState((s) => ({ ...s, password }))
    }
  }

  useEffect(() => {
    if (userLoggedIn) {
      setMainState((s) => ({
        ...s,
        userProfile,
      }))
      console.log(userProfile)
      navigation.push('Main')
    }
  }, [userLoggedIn])

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Email address"
            onChangeText={(email) => handleChangeEmail(email)}
            value={email}
            label="Email"
            keyboardType={'email-address'}
            autoCapitalize="none"
            errorMessage={emailError}
          />
        </View>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Password"
            onChangeText={(password) => handleChangePassword(password)}
            value={password}
            secureTextEntry={true}
            label="Password"
            errorMessage={passwordError}
          />
        </View>

        <Button
          // icon="login"
          disabled={loginDisabled || !!emailError || !!passwordError}
          onPress={() => {
            setLoginDisabled(true)
            handleLogin(email, password, setLoginDisabled)
          }}
        >
          Login
        </Button>
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '80%',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
