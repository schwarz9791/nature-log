import React, { useEffect, useState, useContext } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack'
import { Icon, Button } from 'react-native-elements'
import { getAirConIds } from '../lib/fire'
import { DrawerProps } from './DrawerMenu'

import mainContext from '../context/mainContext'

import { putAirConId, turnOnAirCon, turnOffAirCon, AirConId } from '../lib/fire'

// type SettingsScreens = 'Settings' | 'TargetAirCon'

type SettingsParamList = {
  Settings: undefined
  TargetAirCon: undefined
}

type SettingsNavigatorProps = StackNavigationProp<SettingsParamList, 'Settings'>

const SettingsTop = ({
  navigation,
}: {
  navigation: SettingsNavigatorProps
}) => {
  const listData = [
    { title: 'Select target air conditioner', key: 'TargetAirCon' },
  ]

  const renderItem = ({ item }: { item: { title: string; key: string } }) => (
    <View style={styles.flatListItem}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate(item.key)
        }}
      >
        <Text style={{ fontSize: 16 }}>{item.title}</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Target AirCon</Text>
      <FlatList data={listData} renderItem={renderItem} />
      <View style={styles.buttons}>
        <Button
          title="Turn On"
          onPress={async () => await turnOnAirCon('cool')}
          style={{ margin: 16 }}
        />
        <Button
          title="Turn Off"
          onPress={async () => await turnOffAirCon()}
          style={{ margin: 16 }}
        />
      </View>
    </View>
  )
}

const SettingsTargetAirCon = ({
  navigation,
}: {
  navigation: SettingsNavigatorProps
  options: unknown
}) => {
  const [airConIds, setAirConIds] = useState<AirConId[]>([])
  const { handleSetTargetAirConId } = useContext(mainContext)

  const handleGetAirConIds = async () => {
    const airConIds = await getAirConIds()
    setAirConIds(() => airConIds)
  }

  useEffect(() => {
    handleGetAirConIds()
  }, [])

  const renderItem = ({ item }: { item: { title: string; key: string } }) => (
    <View style={styles.flatListItem}>
      <TouchableOpacity
        onPress={async () => {
          handleSetTargetAirConId(item.key)
          await putAirConId(item.key)
          navigation.goBack()
        }}
      >
        <Text style={{ fontSize: 16, marginBottom: 8 }}>{item.title}</Text>
        <Text style={{ fontSize: 12 }}>{item.key}</Text>
      </TouchableOpacity>
    </View>
  )

  if (!airConIds?.length) return null

  const listData = airConIds.map((airCon) => ({
    title: `${airCon.room_name} ${airCon.nickname}`,
    key: airCon.id,
  }))

  return <FlatList data={listData} renderItem={renderItem} />
}

const SettingsScreen = () => {
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
      />
      <SettingsStack.Screen
        name="TargetAirCon"
        component={SettingsTargetAirCon}
      />
    </SettingsStack.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  label: {
    marginTop: 16,
    marginBottom: 8,
    paddingLeft: 8,
    fontWeight: 'bold',
  },
  flatListItem: {
    width: Dimensions.get('window').width,
    backgroundColor: '#fff',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
    padding: 16,
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: Dimensions.get('window').width,
  },
})

export default SettingsScreen
