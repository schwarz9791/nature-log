import { StyleSheet, Text, View, Dimensions } from 'react-native'
import {
  VictoryZoomContainer,
  VictoryChart,
  VictoryArea,
  VictoryAxis,
  VictoryLine,
  VictoryTheme,
} from 'victory-native'
import { DomainPropType } from 'victory'
import {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg'
import { LinearGradient } from 'expo-linear-gradient'

import { Chart } from '../constants'

export function LogChart({
  title,
  background,
  unit,
  domain,
  guideLine,
  logData,
}: {
  title: string
  background: string
  unit?: string
  domain?: DomainPropType
  guideLine: {
    lower: number
    upper: number
  }
  logData: Chart[]
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {/* // Axiosの背景にグラデーションをうまく当てられないため、LinearGradientで背景要素を作成 */}
      <LinearGradient
        colors={[background, background]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{ borderRadius: 16 }}
      >
        <VictoryChart
          theme={VictoryTheme.material}
          height={200}
          width={Dimensions.get('window').width - 16 * 2}
          padding={{ top: 20, bottom: 40, left: 50, right: 45 }}
          containerComponent={<VictoryZoomContainer />}
        >
          {/* VictoryAreaのfill部分のグラデーション定義 */}
          <Defs>
            <SvgLinearGradient
              id="ChartAreaGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
              <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </SvgLinearGradient>
          </Defs>
          {/* styleにgridのstrokeDasharrayやticksのsizeを指定すると型エラーが出る */}
          <VictoryAxis
            tickCount={5}
            tickFormat={(x) => x.split(' ')[1]}
            style={{
              axis: { stroke: 'white', strokeWidth: 1 },
              grid: { strokeDasharray: [2, 4] },
              ticks: { stroke: 'white', size: 0 },
              tickLabels: { fill: 'white' },
            }}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(x) => `${x}${unit}`}
            style={{
              axis: { stroke: 'white', strokeWidth: 1 },
              grid: { strokeDasharray: [2, 4] },
              ticks: { stroke: 'white', size: 0 },
              tickLabels: { fill: 'white' },
            }}
          />
          <VictoryLine
            name="upperValue"
            y={() => guideLine.upper}
            style={{
              data: { stroke: 'rgba(255, 128, 128, 0.9)', strokeWidth: 1 },
            }}
          />
          <VictoryLine
            name="lowerValue"
            y={() => guideLine.lower}
            style={{
              data: { stroke: 'rgba(0, 192, 255, 0.9)', strokeWidth: 1 },
            }}
          />
          <VictoryArea
            data={logData}
            domain={domain}
            interpolation="natural"
            style={{
              data: {
                stroke: 'rgba(255, 255, 255, 0.5)',
                fill: 'url(#ChartAreaGradient)',
                strokeWidth: 4,
              },
            }}
          />
        </VictoryChart>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 20,
    fontWeight: 'bold',
  },
  background: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'green',
  },
})
