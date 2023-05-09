import { useState, useCallback } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { Icon } from '@rneui/themed'
import useSWR from 'swr'
import dayjs from 'dayjs'

import { getNatureLogs } from '../lib/firebase'

import { Colors, WeatherType, Chart } from '../constants'
import { Weather } from '../components/Weather'
import { Ring } from '../components/Ring'
import { LogChart } from '../components/LogChart'

export default function HomeScreen() {
  const [currentTime, setCurrentTime] = useState(new Date())

  const currentWeather: {
    weather: WeatherType
    temp: number
    humidity: number
  } = { weather: 'Clear', temp: 24, humidity: 35 }

  const { data: logData, error, isLoading } = useSWR(
    ['nature_logData', 24 * 4],
    // eslint-disable-next-line no-unused-vars
    ([_, limit]) => getNatureLogs(limit)
  )
  const currentLog = logData ? logData[0] : null

  const formatDate = useCallback((date: Date) => {
    return dayjs(date).format('YY/MM/DD HH:mm')
  }, [])

  const getTemperature = useCallback(
    (i: number): number => {
      return logData?.[i].te?.val || 0
    },
    [logData]
  )

  const getTemperatures = useCallback((): Chart[] => {
    return (
      logData?.map((log) => ({
        x: formatDate(log.created_at.toDate()),
        y: log.te?.val || 0,
      })) || []
    )
  }, [logData])

  const getHumidity = useCallback(
    (i: number) => {
      return logData?.[i].hu?.val || 0
    },
    [logData]
  )

  const getHumidities = useCallback((): Chart[] => {
    return (
      logData?.map((log) => ({
        x: formatDate(log.created_at.toDate()),
        y: log.hu?.val || 0,
      })) || []
    )
  }, [logData])

  // 体感温度
  // REF: https://keisan.casio.jp/exec/system/1257417058#!
  const getFeelingTemperatures = useCallback((): Chart[] => {
    return (
      logData?.map((log, i: number) => {
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
      }) || [{ x: 'unknown', y: 0 }]
    )
  }, [logData])

  const getDisplayCurrentTime = () => {
    return dayjs(currentTime).format('YYYY/MM/DD HH:mm')
  }

  if (error) {
    return (
      <View>
        <Text>Failed to load</Text>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <ScrollView>
      <View>
        <Text>{getDisplayCurrentTime()}</Text>
        <Icon name="chevron-down" type="feather" color={Colors.Gray} />
      </View>
      {/* 選択時点のの天気 */}
      <View>
        <Weather
          weather={currentWeather.weather}
          temperature={currentWeather.temp}
          humidity={currentWeather.humidity}
        />
      </View>
      {/* 選択時点の室内気温・湿度 */}
      <View>
        <Ring
          color={Colors.Comfort}
          max={40}
          temperature={currentLog?.te?.val}
          humidity={currentLog?.hu?.val}
        />
        <Icon name="code" type="feather" color={Colors.Gray} />
      </View>
      {/* 気温ログ */}
      <View>
        <LogChart
          title="Temperature"
          background={Colors.Comfort}
          unit="℃"
          domain={{ y: [10, 25] }}
          guideLine={{ lower: 14.5, upper: 20.5 }}
          logData={getFeelingTemperatures()}
        />
      </View>
      {/* 湿度ログ */}
      <View>
        <LogChart
          title="Humidity"
          background={Colors.Cool}
          unit="%"
          domain={{ y: [10, 90] }}
          guideLine={{ lower: 30, upper: 75 }}
          logData={getHumidities()}
        />
      </View>
      {/* グラフのZoom */}
      <View>
        <Icon name="minus-circle" type="feather" color={Colors.Gray} />
        <Text>24h</Text>
        <Icon name="plus-circle" type="feather" color={Colors.Gray} />
      </View>
    </ScrollView>
  )
}
