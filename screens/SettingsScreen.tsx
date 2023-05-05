import { Text, View } from 'react-native'
import { Button } from '@rneui/themed'
import { useNavigation } from '@react-navigation/native'

import firebase from '../lib/firebase'

export default function SettingsScreen() {
  const navigation = useNavigation()

  return (
    <View>
      <Text>Settings</Text>
      <Text>TODO</Text>
      <Button
        onPress={() => {
          firebase.auth().signOut()
          navigation.getParent()?.navigate('Login')
        }}
      >
        Logout
      </Button>
    </View>
  )
}
