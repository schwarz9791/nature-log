import React, { useEffect, useState, useCallback } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { ButtonGroup, Icon } from 'react-native-elements'
import { LineChart, ProgressChart } from 'react-native-chart-kit'
import dayjs from 'dayjs'
import hexToRgba from 'hex-to-rgba'
import { getNatureLogs, NatureLog } from '../lib/fire'

const wait = (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout))
}

const HomeScreen = () => {
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
  }, [])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    wait(2000).then(async () => {
      await fetchData(
        2 - selectedIndex ? (2 - selectedIndex) * 24 * 4 : undefined
      )
      setRefreshing(false)
    })
  }, [])

  const getTimes = useCallback((): string[] => {
    return logs.map((log, i: number) => {
      const date = dayjs(log?.created_at?.toDate())
      return date && (i + 1) % 2 === 1 ? date.format('HH:mm') : ''
    })
  }, [logs])

  const getTemperature = useCallback(
    (i: number): number => {
      return logs[i]?.te?.val || 0
    },
    [logs]
  )

  const getTemperatures = useCallback((): number[] => {
    return logs.map((log) => log?.te?.val || 0)
  }, [logs])

  const getHumidity = useCallback(
    (i: number) => {
      return logs[i]?.hu?.val || 0
    },
    [logs]
  )

  const getHumidities = useCallback((): number[] => {
    return logs.map((log) => log?.hu?.val || 0)
  }, [logs])

  // 体感温度
  // REF: https://keisan.casio.jp/exec/system/1257417058#!
  const getFeelingTemperatures = useCallback((): number[] => {
    return logs.map((log, i: number) => {
      const wv = 0.5 // 風速(m/s)
      const te = getTemperature(i) // 気温
      const hu = getHumidity(i) // 湿度
      const a = 1.76 + Math.pow(1.4 * wv, 0.75) // 風速から導かれるパラメータ
      const denominator = 0.68 - 0.0014 * hu + 1 / a // 式内分母
      return 37 - (37 - te) / denominator - 0.29 * te * (1 - hu / 100) // ミスナール改良計算式
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
    const tempRatios = [data / max < 1 ? data / max : 1]
    const d = Math.round(data * 10) / 10
    return (
      <View style={styles.ringWrapper}>
        <ProgressChart
          data={tempRatios}
          width={Dimensions.get('window').width / 3 - 20}
          height={80}
          strokeWidth={10}
          hideLegend
          chartConfig={{
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => hexToRgba(color, opacity),
          }}
        />
        <Text style={styles.ringText}>
          {d}
          {unit}
        </Text>
      </View>
    )
  }

  const Rings = () => (
    <View style={styles.rings}>
      {!logs.length ? (
        <Loading />
      ) : (
        <>
          <Ring
            data={getFeelingTemperatures()[0]}
            color="#6ecc00"
            unit="℃"
            max={25}
          />
          <Ring data={getTemperature(0)} color="#fb8c00" unit="℃" max={35} />
          <Ring data={getHumidity(0)} color="#008dfb" unit="％" max={80} />
        </>
      )}
    </View>
  )

  const Chart = ({
    color1,
    color2,
    unit,
    data,
  }: {
    color1: string
    color2: string
    unit?: string
    data: number[]
  }) => (
    <LineChart
      data={{
        labels: getTimes(),
        datasets: [
          {
            data,
          },
        ],
      }}
      width={Dimensions.get('window').width - 32} // from react-native
      height={200}
      yAxisSuffix={unit}
      // yAxisSuffix="k"
      yAxisInterval={4} // optional, defaults to 1
      chartConfig={{
        backgroundGradientFrom: color1,
        backgroundGradientTo: color2,
        decimalPlaces: 1, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 8,
        },
        propsForDots: {
          r: '4',
          strokeWidth: '2',
          stroke: color1,
        },
      }}
      bezier
      style={{
        marginVertical: 8,
        borderRadius: 8,
      }}
    />
  )

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
            data={getFeelingTemperatures()}
          />
          <Text style={styles.chartLabel}>気温</Text>
          <Chart
            color1="#fb8c00"
            color2="#ffa726"
            unit="℃"
            data={getTemperatures()}
          />
          <Text style={styles.chartLabel}>湿度</Text>
          <Chart
            color1="#008dfb"
            color2="#26b1ff"
            unit="％"
            data={getHumidities()}
          />
        </>
      )}
    </View>
  )

  const Logs = () => (
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

  const HomeStack = createStackNavigator()

  useEffect(() => {
    fetchData()
    setInterval(() => {
      setCurrentTime(dayjs(new Date()).format('YYYY/MM/DD HH:mm')), 60 * 1000
    })
  }, [])

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Logs"
        component={Logs}
        options={({ navigation }) => ({
          title: 'Nature Log',
          headerLeft: () => (
            <Icon
              name="menu"
              style={{ marginHorizontal: 16 }}
              onPress={() => navigation.toggleDrawer()}
            />
          ),
        })}
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
    marginTop: 16,
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
  },
  ringWrapper: {
    position: 'relative',
    flex: 1,
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  ringText: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: 'bold',
  },
})

export default HomeScreen
