import { View, StyleSheet } from 'react-native'
import Svg from 'react-native-svg'
import { VictoryPie, VictoryLabel } from 'victory-native'

import { Colors } from '../constants'

export function Ring({
  color,
  max,
  temperature,
  humidity,
}: {
  color: string
  max: number
  temperature?: number
  humidity?: number
  }) {
  const percent = temperature ? temperature / max < 1 ? temperature / max : 1 : 0
  const ratios = [
    { x: 1, y: percent },
    { x: 2, y: 1 - percent },
  ]
  const displayTemperature = temperature ? Math.round(temperature * 10) / 10 : 0
  const displayHumidity = humidity ? Math.round(humidity * 10) / 10 : 0

  const labels = temperature ? (
    <>
        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={100}
          y={75}
          text={`${displayTemperature}℃`}
          style={{ fontSize: 32 }}
        />
        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={100}
          y={125}
          text={`${displayHumidity}%`}
          style={{ fontSize: 32 }}
        />
    </>
  ) : (
    <VictoryLabel
      textAnchor="middle"
      verticalAnchor="middle"
      x={100}
      y={100}
      text="Unknown"
      style={{ fontSize: 32 }}
    />
    )
  
  return (
    <View style={styles.ringWrapper}>
      <Svg viewBox="0 0 200 200" width="100%" height="100%">
        <VictoryPie
          standalone={false}
          data={[{ x: 1, y: 1 }]}
          width={200}
          height={200}
          innerRadius={80}
          cornerRadius={20}
          padding={0}
          labels={() => null}
          style={{
            data: {
              fill: Colors.LightGray,
            },
          }}
        />
        <VictoryPie
          standalone={false}
          data={ratios}
          width={200}
          height={200}
          innerRadius={80}
          cornerRadius={20}
          padding={0}
          labels={() => null}
          style={{
            data: {
              fill: ({ datum }) => (datum.x === 1 ? color : 'transparent'),
            },
          }}
        />
        {labels}
      </Svg>
    </View>
  )
}

const styles = StyleSheet.create({
  ringWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    height: 112,
  },
})
