import Constants from 'expo-constants'
import type { CurrentWeather } from '../functions/src/types/weather'

const url = Constants.expoConfig?.extra?.openWeatherApiUrl
const apiKey = Constants.expoConfig?.extra?.openWeatherApiKey
// TODO: 仮で東京のlat,lon、Settings画面で位置情報などから設定可能にする
const lat = 35.6828387
const lon = 139.7594549

export const fetchCurrentWeather = async () => {
  const params = `?appid=${apiKey}&lat=${lat}&lon=${lon}&units=metric&lang=ja&exclude=minutely,hourly,daily`

  try {
    const res = await fetch(`${url}${params}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    })

    const data = (await res.json()).current as CurrentWeather

    return data
  } catch (e) {
    if (e instanceof Error) {
      console.error(`message: ${e.message}`)
      alert('天気情報の取得に失敗しました')
    }
  }
}
