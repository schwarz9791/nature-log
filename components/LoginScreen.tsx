import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'

import { Input, Button, SocialIcon } from '@rneui/themed'

import { handleLogin } from '../lib/firebase'

// import loc from '../utils/localization';
import { useMainContext, useSetMainContext } from '../context/mainContext'
import { TopScreenNavigationProps } from '../App'

const LoginScreen = ({
  navigation,
  userLogged,
  promptAsync,
}: {
  navigation: TopScreenNavigationProps
  userLogged: boolean
  promptAsync: Function
}) => {
  // const { handleSignInWithGoogle } = useContext(mainContext)
  const { email, password } = useMainContext()
  const setMainState = useSetMainContext()
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  //console.log(mainContext);

  const verifyEmail = (str: string) => {
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
    if (userLogged) {
      // console.log(userLogged)
      navigation.push('Main')
    }
  }, [userLogged])

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
          />
        </View>
        <View style={styles.inputContainer}>
          <Input
            placeholder="Password"
            onChangeText={(password) => handleChangePassword(password)}
            value={password}
            secureTextEntry={true}
            label="Password"
          />
        </View>

        <Button
          // icon="login"
          onPress={() => handleLogin(email, password)}
        >
          Login
        </Button>
        <SocialIcon
          title="Login with Google"
          button
          type="google"
          iconType="font-awesome"
          iconColor="white"
          raised={false}
          iconSize={16}
          // onPress={() => handleSignInWithGoogle({ navigation })}
          onPress={() => promptAsync()}
          style={{
            paddingHorizontal: 16,
            width: 200,
            height: 48,
          }}
        />
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

export default LoginScreen
