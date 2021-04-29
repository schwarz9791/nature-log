import React from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { Icon } from 'react-native-elements'
import { DrawerProps } from './DrawerMenu'

const SettingsScreen = () => {
  const SettingsTop = () => (
    <View>
      <Text>Settings Screen</Text>
    </View>
  )

  const SettingsStack = createStackNavigator()

  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="Settings"
        component={SettingsTop}
        options={({ navigation }: { navigation: DrawerProps }) => ({
          title: 'Nature Log',
          headerLeft: () => (
            <Icon
              name="menu"
              style={{ marginHorizontal: 16 }}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
        })}
      ></SettingsStack.Screen>
    </SettingsStack.Navigator>
  )
}

export default SettingsScreen
