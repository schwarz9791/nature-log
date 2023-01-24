import React, { /* useState, */ useContext, useEffect } from 'react'
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'

import { /* TextInput, */ SocialIcon } from '@rneui/themed'
// import loc from '../utils/localization';
import mainContext from '../context/mainContext'
import { TopScreenNavigationProps } from '../App'

const LoginScreen = ({
  navigation,
  userLogged,
}: {
  navigation: TopScreenNavigationProps
  userLogged: boolean
}) => {
  const { handleSignInWithGoogle } = useContext(mainContext)
  // const [name, setName] = useState('')
  // const [email, setEmail] = useState('')
  // const [password, setPassword] = useState('')

  //console.log(mainContext);

  useEffect(() => {
    if (userLogged) {
      // console.log(userLogged)
      navigation.push('Main')
    }
  }, [userLogged])

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        {/* <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email address"
            onChangeText={(name) => setName(name)}
            value={name}
            label={loc.t('nome')}
            mode="outlined"
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email address"
            onChangeText={(email) => setEmail(email)}
            value={email}
            label="Email"
            keyboardType={'email-address'}
            mode="outlined"
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Password"
            onChangeText={(password) => setPassword(password)}
            value={password}
            secureTextEntry={true}
            label="Password"
            mode="outlined"
          />
        </View>

        <Button
          mode="contained"
          icon="login"
          onPress={() => handleSignup(email, password)}
        >
          {loc.t('signupButton')}
        </Button> */}
        <SocialIcon
          title="Login with Google"
          button
          type="google"
          iconType="font-awesome"
          iconColor="white"
          raised={false}
          iconSize={16}
          onPress={() => handleSignInWithGoogle({ navigation })}
          style={{
            paddingHorizontal: 16,
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  // inputContainer: {
  //   width: '80%',
  //   marginBottom: 20,
  // },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default LoginScreen
