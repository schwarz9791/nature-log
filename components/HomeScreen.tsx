import React, { useEffect, useState, useCallback } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { ButtonGroup } from '@rneui/themed'
import {
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryLine,
  VictoryArea,
  VictoryPie,
  VictoryLabel,
  VictoryVoronoiContainer,
} from 'victory-native'
import { DomainPropType } from 'victory'
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg'
import { LinearGradient } from 'expo-linear-gradient'
import dayjs from 'dayjs'
import { getNatureLogs, NatureLog } from '../lib/firebase'

type Chart = {
  x: string
  y: number
}

const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

const LogsScreen = () => {
  const [refreshing, setRefreshing] = useState(false)
  const [logs, setLogs] = useState<NatureLog[]>([])
  const [currentTime, setCurrentTime] = useState(
    dayjs(new Date()).format('YYYY/MM/DD HH:mm')
  )
  const [selectedIndex, setSelectedIndex] = useState(2)

  const fetchData = useCallback(async (limit: number = 12) => {
    setLogs([])
    const res = await getNatureLogs(limit)
    setLogs(res.reverse())
    // console.log(logs)
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    wait(2000).then(async () => {
      const index = 2 - selectedIndex
      await fetchData(index ? index * 24 * 4 : undefined)
      setRefreshing(false)
    })
  }, [])

  const formatDate = useCallback((date: Date) => {
    return dayjs(date).format('YY/MM/DD HH:mm')
  }, [])

  const getTemperature = useCallback(
    (i: number): number => {
      return logs[i]?.te?.val || 0
    },
    [logs]
  )

  const getTemperatures = useCallback((): Chart[] => {
    return logs.map((log) => ({
      x: formatDate(log.created_at.toDate()),
      y: log.te?.val || 0,
    }))
  }, [logs])

  const getHumidity = useCallback(
    (i: number) => {
      return logs[i]?.hu?.val || 0
    },
    [logs]
  )

  const getHumidities = useCallback((): Chart[] => {
    return logs.map((log) => ({
      x: formatDate(log.created_at.toDate()),
      y: log.hu?.val || 0,
    }))
  }, [logs])

  // 体感温度
  // REF: https://keisan.casio.jp/exec/system/1257417058#!
  const getFeelingTemperatures = useCallback((): Chart[] => {
    return logs.map((log, i: number) => {
      const wv = 0.5 // 風速(m/s)
      const te = getTemperature(i) // 気温
      const hu = getHumidity(i) // 湿度
      const a = 1.76 + Math.pow(1.4 * wv, 0.75) // 風速から導かれるパラメータ
      const denominator = 0.68 - 0.0014 * hu + 1 / a // 式内分母
      // return 37 - (37 - te) / denominator - 0.29 * te * (1 - hu / 100) // ミスナール改良計算式
      return {
        x: formatDate(log.created_at.toDate()),
        y: 37 - (37 - te) / denominator - 0.29 * te * (1 - hu / 100), // ミスナール改良計算式
      }
    })
  }, [logs])

  // 不快指数
  // const getDiscomforts = useCallback((): number[] => {
  //   return logs.map((log, i: number) => {
  //     // T:乾球温度、H:湿度
  //     // DI=0.81T+0.01H×(0.99T−14.3)+46.3
  //     return (
  //       0.81 * getTemperature(i) +
  //       0.01 * getHumidity(i) * (0.99 * getTemperature(i) - 14.3) +
  //       46.3
  //     )
  //   })
  // }, [logs])

  const Button3days = (): React.ReactElement => <Text>3日</Text>
  const Button1day = (): React.ReactElement => <Text>1日</Text>
  const Button3hours = (): React.ReactElement => <Text>3時間</Text>
  const buttons = [
    { element: Button3days, fetchDataLimit: 3 * 24 * 4 }, // 3日x24時間x4
    { element: Button1day, fetchDataLimit: 24 * 4 }, // 24時間x4
    { element: Button3hours, fetchDataLimit: 3 * 4 }, // 3時間x4
  ]

  const updateIndex = (i: number) => {
    setSelectedIndex(i)
    fetchData(buttons[i].fetchDataLimit)
  }

  const Loading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" />
    </View>
  )

  const Buttons = () => {
    const buttons: any[] = [
      { element: Button3days },
      { element: Button1day },
      { element: Button3hours },
    ]
    return (
      <ButtonGroup
        onPress={updateIndex}
        selectedIndex={selectedIndex}
        buttons={buttons}
        containerStyle={{ height: 34, marginTop: 16 }}
      />
    )
  }

  const Ring = ({
    color,
    unit,
    max,
    data,
  }: {
    color: string
    unit?: string
    max: number
    data: number
  }) => {
    const percent = data / max < 1 ? data / max : 1
    const ratios = [
      { x: 1, y: percent },
      { x: 2, y: 1 - percent },
    ]
    const labelData = Math.round(data * 10) / 10
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
                fill: 'whitesmoke',
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
          <VictoryLabel
            textAnchor="middle"
            verticalAnchor="middle"
            x={100}
            y={100}
            text={`${labelData}${unit}`}
            style={{ fontSize: 32 }}
          />
        </Svg>
      </View>
    )
  }

  const Rings = () => {
    const lastItemIndex = logs.length - 1
    return (
      <View style={styles.rings}>
        {!logs.length ? (
          <Loading />
        ) : (
          <>
            <Ring
              data={getFeelingTemperatures()[lastItemIndex].y}
              color="#6ecc00"
              unit="℃"
              max={25}
            />
            <Ring
              data={getTemperature(lastItemIndex)}
              color="#fb8c00"
              unit="℃"
              max={35}
            />
            <Ring
              data={getHumidity(lastItemIndex)}
              color="#008dfb"
              unit="％"
              max={100}
            />
          </>
        )}
      </View>
    )
  }

  const Chart = ({
    color1,
    color2,
    unit,
    domain,
    guideLine,
    data,
  }: {
    color1: string
    color2: string
    unit?: string
    domain?: DomainPropType
    guideLine: {
      lower: number
      upper: number
    }
    data: Chart[]
  }) => {
    return (
      // VictoryChartの背景にグラデーションをうまく当てられないため、LinearGradientで背景要素を作成
      <LinearGradient
        colors={[color1, color2]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{ borderRadius: 16 }}
      >
        <VictoryChart
          theme={VictoryTheme.material}
          height={200}
          padding={{ top: 20, bottom: 40, left: 50, right: 45 }}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiBlacklist={['upperValue', 'lowerValue']}
              labels={({ datum }) =>
                `${datum.x}\n${Math.round(datum.y * 10) / 10}${unit}`
              }
            />
          }
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
            data={data}
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
    )
  }

  const Charts = () => (
    <View style={styles.chartContainer}>
      {!logs.length ? (
        <Loading />
      ) : (
        <>
          <Text style={styles.chartLabel}>体感気温</Text>
          <Chart
            color1="#6ecc00"
            color2="#8ee522"
            unit="℃"
            domain={{ y: [10, 25] }}
            guideLine={{ lower: 14.5, upper: 20.5 }}
            data={getFeelingTemperatures()}
          />
          <Text style={styles.chartLabel}>気温</Text>
          <Chart
            color1="#fb8c00"
            color2="#ffa726"
            unit="℃"
            domain={{ y: [10, 25] }}
            guideLine={{ lower: 14.5, upper: 20.5 }}
            data={getTemperatures()}
          />
          <Text style={styles.chartLabel}>湿度</Text>
          <Chart
            color1="#008dfb"
            color2="#26b1ff"
            unit="％"
            domain={{ y: [10, 90] }}
            guideLine={{ lower: 30, upper: 75 }}
            data={getHumidities()}
          />
        </>
      )}
    </View>
  )

  useEffect(() => {
    const controller = new AbortController()
    fetchData()
    const timer = setInterval(() => {
      setCurrentTime(dayjs(new Date()).format('YYYY/MM/DD HH:mm')), 60 * 1000
    })
    return () => {
      controller.abort()
      clearInterval(timer)
    }
  }, [])

  return (
    <ScrollView
      contentContainerStyle={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.currentTime}>{currentTime}</Text>
      </View>
      <Rings />
      <Buttons />
      <Charts />
    </ScrollView>
  )
}

const HomeScreen = () => {
  const HomeStack = createStackNavigator()

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Logs"
        component={LogsScreen}
        options={{ headerShown: false }}
        // options={({ navigation }) => ({
        //   title: 'Nature Log',
        //   headerLeft: () => (
        //     <Icon
        //       name="menu"
        //       style={{ marginHorizontal: 16 }}
        //       onPress={() => navigation.toggleDrawer()}
        //     />
        //   ),
        // })}
      ></HomeStack.Screen>
    </HomeStack.Navigator>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    minHeight: '100%',
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  chartContainer: {
    flex: 1,
    minHeight: '75%',
    marginBottom: 32,
  },
  chartLabel: {
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
    fontSize: 16,
  },
  currentTime: {
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  rings: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    height: 112,
    marginTop: 16,
  },
  ringWrapper: {
    flex: 1,
    padding: 8,
  },
  ringText: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: 'bold',
  },
})

export default HomeScreen
