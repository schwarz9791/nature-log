import React from 'react'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerNavigationProp,
  DrawerContentComponentProps,
} from '@react-navigation/drawer'

import firebase from '../lib/firebase'

import HomeScreen from './HomeScreen'
import SettingsScreen from './SettingsScreen'
// import mainContext from '../context/mainContext'

type DrawerParamList = {
  Home: undefined
  Settings: undefined
}

export type DrawerProps = DrawerNavigationProp<DrawerParamList, 'Home'>

export const DrawerContent = (props: DrawerContentComponentProps) => {
  // const { signOutUser } = useContext(mainContext)
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        onPress={() => {
          firebase.auth().signOut()
          props.navigation.getParent()?.navigate('Login')
        }}
      />
    </DrawerContentScrollView>
  )
}

export const AppDrawer = () => {
  const Drawer = createDrawerNavigator()
  return (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  )
}

export default AppDrawer
