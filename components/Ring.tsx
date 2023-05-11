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
      {/* TODO: unit部分を分けたい */}
      {/* TODO: フォントが通常のテキストと違う */}
        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={40}
          y={30}
          text={`${displayTemperature}℃`}
          style={{ fontSize: 17, fontWeight: '600' }}
        />
        <VictoryLabel
          textAnchor="middle"
          verticalAnchor="middle"
          x={40}
          y={50}
          text={`${displayHumidity}%`}
          style={{ fontSize: 17, fontWeight: '600' }}
        />
    </>
  ) : (
    <VictoryLabel
      textAnchor="middle"
      verticalAnchor="middle"
      x={40}
      y={40}
      text="Unknown"
      style={{ fontSize: 17 }}
    />
    )
  
  return (
    <View style={styles.ringWrapper}>
      <Svg viewBox="0 0 80 80" width="100%" height="100%">
        <VictoryPie
          standalone={false}
          data={[{ x: 1, y: 1 }]}
          width={80}
          height={80}
          innerRadius={32}
          cornerRadius={20}
          padding={2}
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
          width={80}
          height={80}
          innerRadius={30}
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
    width: 96,
    height: 96,
  },
})
