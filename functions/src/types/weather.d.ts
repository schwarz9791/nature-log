import type { WeatherType } from '../../../constants'

/* eslint-disable camelcase */
interface Weather {
  id: number
  main: WeatherType
  description: string
  icon: string
}

interface Rain {
  '1h': number
}

export interface CurrentWeather {
  dt: number
  sunrise: number
  sunset: number
  temp: number
  feels_like: number
  pressure: number
  humidity: number
  dew_point: number
  uvi: number
  clouds: number
  visibility: number
  wind_speed: number
  wind_deg: number
  weather: Weather[]
  rain?: Rain
}

export interface HourlyWeather {
  dt: number
  temp: number
  feels_like: number
  pressure: number
  humidity: number
  dew_point: number
  uvi: number
  clouds: number
  visibility: number
  wind_speed: number
  wind_deg: number
  wind_gust?: number
  weather: Weather[]
  pop?: number
  rain?: Rain
}

export interface WeatherData {
  lat: number
  lon: number
  timezone: string
  timezone_offset: number
  current: CurrentWeather
  hourly: HourlyWeather[]
}
/* eslint-enable camelcase */
