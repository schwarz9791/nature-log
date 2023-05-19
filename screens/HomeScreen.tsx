import { useState, useCallback } from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { Icon } from '@rneui/themed'
import useSWR from 'swr'
import dayjs from 'dayjs'

import { getNatureLogs, getHourlyForecasts } from '../lib/firebase'
import { fetchCurrentWeather } from '../lib/openWeather'

import { Colors, WeatherType, Chart } from '../constants'
import { Weather } from '../components/Weather'
import { Ring } from '../components/Ring'
import { LogChart } from '../components/LogChart'

const date = dayjs(new Date().toLocaleDateString('ja'))

export default function HomeScreen() {
  const [currentTime, setCurrentTime] = useState(new Date())

  const currentWeather: {
    weather: keyof typeof WeatherType
    temp: number
    humidity: number
  } = { weather: 'Clear', temp: 24, humidity: 35 }

  const { data: logData, error: logError, isLoading: isLogLoading } = useSWR(
    ['nature_log', 24 * 4],
    // eslint-disable-next-line no-unused-vars
    ([_, limit]) => getNatureLogs(date, 1, limit)
  )
  const {
    data: weatherForecastData,
    error: wetherForecastError,
    isLoading: isWeatherForecastLoading,
  } = useSWR(
    ['open_weather', 24],
    // eslint-disable-next-line no-unused-vars
    ([_, limit]) => getHourlyForecasts(date, 1, limit)
  )
  const currentLog = logData ? logData[0] : null
  const currentWether = weatherForecastData ? weatherForecastData[0] : null

  // const formatDate = useCallback((date: Date) => {
  //   return dayjs(date).format('YY/MM/DD HH:mm')
  // }, [])

  const getTemperature = useCallback(
    (i: number): number => {
      return logData?.[i].te?.val || 0
    },
    [logData]
  )

  const getTemperatures = useCallback((): Chart[] => {
    return (
      logData?.map((log) => ({
        x: Math.floor(log.created_at.toDate().getTime() / 1000),
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
        x: Math.floor(log.created_at.toDate().getTime() / 1000),
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
          x: Math.floor(log.created_at.toDate().getTime() / 1000),
          y: 37 - (37 - te) / denominator - 0.29 * te * (1 - hu / 100), // ミスナール改良計算式
        }
      }) || [{ x: 0, y: 0 }]
    )
  }, [logData])

  const getTemperatureForecasts = useCallback((): Chart[] => {
    return (
      weatherForecastData?.map((forecast) => {
        return {
          x: forecast.dt,
          y: forecast.temp,
        }
      }) || [{ x: 0, y: 0 }]
    )
  }, [weatherForecastData])

  const getHumidityForecasts = useCallback((): Chart[] => {
    return (
      weatherForecastData?.map((forecast) => {
        return {
          x: forecast.dt,
          y: forecast.humidity,
        }
      }) || [{ x: 0, y: 0 }]
    )
  }, [weatherForecastData])

  const getDisplayCurrentTime = () => {
    return dayjs(currentTime).format('YYYY/MM/DD HH:mm')
  }

  if (logError || wetherForecastError) {
    return (
      <View>
        <Text>Failed to load</Text>
      </View>
    )
  }

  if (isLogLoading || isWeatherForecastLoading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateTime}>{getDisplayCurrentTime()}</Text>
          <Icon
            style={styles.selectDate}
            name="chevron-down"
            type="feather"
            color={Colors.Gray}
            size={16}
          />
        </View>
        <View style={styles.currentDataContainer}>
          {/* 選択時点のの天気 */}
          <View style={styles.weatherDataContainer}>
            <Weather
              weather={currentWeather.weather}
              temperature={currentWeather.temp}
              humidity={currentWeather.humidity}
            />
          </View>
          {/* 垂直線 */}
          <View style={styles.hr} />
          {/* 選択時点の室内気温・湿度 */}
          <View style={styles.roomDataContainer}>
            <Ring
              color={Colors.Comfort}
              max={40}
              temperature={currentLog?.te?.val}
              humidity={currentLog?.hu?.val}
            />
            <View style={styles.swapPhysicalAndEffective}>
              <Icon name="code" type="feather" color={Colors.Gray} size={16} />
            </View>
          </View>
        </View>
        {/* 気温ログ */}
        <View>
          <LogChart
            title="Temperature"
            background={Colors.Comfort}
            unit="℃"
            domain={{
              x: [
                weatherForecastData?.[0]?.dt ?? 0,
                weatherForecastData?.[weatherForecastData.length - 1]?.dt ?? 0,
              ],
              y: [10, 25],
            }}
            guideLine={{ lower: 14.5, upper: 20.5 }}
            logData={getFeelingTemperatures()}
            forecastData={getTemperatureForecasts()}
          />
        </View>
        {/* 湿度ログ */}
        <View>
          <LogChart
            title="Humidity"
            background={Colors.Cool}
            unit="%"
            domain={{
              x: [
                weatherForecastData?.[0]?.dt ?? 0,
                weatherForecastData?.[weatherForecastData.length - 1]?.dt ?? 0,
              ],
              y: [10, 90],
            }}
            guideLine={{ lower: 30, upper: 75 }}
            logData={getHumidities()}
            forecastData={getHumidityForecasts()}
          />
        </View>
        {/* グラフのZoom */}
        <View style={styles.zoomControlContainer}>
          <Icon
            style={styles.zoomIcon}
            name="minus-circle"
            type="feather"
            color={Colors.Gray}
            size={16}
          />
          <Text style={styles.zoomLevel}>24h</Text>
          <Icon
            style={styles.zoomIcon}
            name="plus-circle"
            type="feather"
            color={Colors.Gray}
            size={16}
          />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.White,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    marginTop: 16,
    marginBottom: 8,
  },
  dateTime: {
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  selectDate: {
    marginLeft: 4,
    paddingTop: 2,
  },
  currentDataContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  weatherDataContainer: {
    flex: 4,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 32,
  },
  roomDataContainer: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingLeft: 32,
  },
  swapPhysicalAndEffective: {
    padding: 8,
  },
  hr: {
    marginVertical: 8,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: Colors.LightGray,
  },
  zoomControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  zoomIcon: {
    padding: 8,
  },
  zoomLevel: {
    color: Colors.Gray,
    fontSize: 13,
  },
})
