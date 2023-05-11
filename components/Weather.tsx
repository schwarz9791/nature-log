import { StyleSheet, Text, View } from 'react-native'
import { Icon } from '@rneui/themed'

import { Colors, WeatherType, WeatherIconMap } from '../constants'

export function Weather({
  weather,
  temperature,
  humidity,
}: {
  weather: WeatherType
  temperature: number
  humidity: number
}) {
  return (
    <View style={styles.container}>
      <Icon
        name={WeatherIconMap[weather]}
        type="feather"
        color={Colors.Warm}
        size={80}
      />
      <View style={styles.dataContainer}>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{temperature}</Text>
          <Text style={styles.unit}>℃</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{humidity}</Text>
          <Text style={styles.unit}>%</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dataContainer: {
    flexDirection: 'column',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginStart: 16,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  unit: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 34,
  },
})
