import React, { useContext } from 'react'
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerNavigationProp,
} from '@react-navigation/drawer'

import HomeScreen from './HomeScreen'
import SettingsScreen from './SettingsScreen'
import mainContext from '../context/mainContext'

type DrawerParamList = {
  Home: undefined
  Settings: undefined
}

export type DrawerProps = DrawerNavigationProp<DrawerParamList, 'Home'>

export const DrawerContent = (props) => {
  const { signOutUser } = useContext(mainContext)
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Logout" onPress={() => signOutUser(props)} />
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
