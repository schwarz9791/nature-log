import { Text, View } from 'react-native'
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
    <View>
      <Icon name={WeatherIconMap[weather]} type="feather" color={Colors.Warm} />
      <View>
        <Text>{temperature}</Text>
        <Text>℃</Text>
        <Text>{humidity}</Text>
        <Text>%</Text>
      </View>
    </View>
  )
}
