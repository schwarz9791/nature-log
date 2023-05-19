export const Colors = {
  Gray: '#999999',
  LightGray: '#C6C6C6',
  BackgroundGray: '#F7F7F7',
  Hot: '#EB5757',
  Warm: '#FBBC00',
  Comfort: '#6ECC00',
  Cool: '#2D9CDB',
  Cold: '#1F47AF',
  Black: '#000000',
  White: '#FFFFFF',
} as const

// TODO
// export type WeatherType = 'Clear' | 'Clouds' | 'Unknown'
export const WeatherType = {
  Clear: 'Clear',
  Clouds: 'Clouds',
  Rain: 'Rain',
  Drizzle: 'Drizzle',
  Thunderstorm: 'Thunderstorm',
  Snow: 'Snow',
  Mist: 'Mist',
  Smoke: 'Smoke',
  Haze: 'Haze',
  Dust: 'Dust',
  Fog: 'Fog',
  Sand: 'Sand',
  Ash: 'Ash',
  Squall: 'Squall',
  Tornado: 'Tornado',
  Unknown: 'Unknown',
} as const
// export type WeatherType = typeof Weathers[number]

// TODO
export const WeatherIconMap = {
  [WeatherType.Clear]: 'sun',
  [WeatherType.Clouds]: 'cloud',
  [WeatherType.Rain]: 'umbrella',
  [WeatherType.Drizzle]: 'umbrella',
  [WeatherType.Thunderstorm]: 'zap',
  [WeatherType.Snow]: 'cloud-snow',
  [WeatherType.Mist]: 'loader',
  [WeatherType.Smoke]: 'loader',
  [WeatherType.Haze]: 'loader',
  [WeatherType.Dust]: 'loader',
  [WeatherType.Fog]: 'loader',
  [WeatherType.Sand]: 'loader',
  [WeatherType.Ash]: 'loader',
  [WeatherType.Squall]: 'loader',
  [WeatherType.Tornado]: 'aperture',
  [WeatherType.Unknown]: 'help-circle',
} as const

// TODO
export const WeatherColorMap = {
  [WeatherType.Clear]: Colors.Hot,
  [WeatherType.Clouds]: Colors.Gray,
  [WeatherType.Rain]: Colors.Cool,
  [WeatherType.Drizzle]: Colors.Cool,
  [WeatherType.Thunderstorm]: Colors.Warm,
  [WeatherType.Snow]: Colors.LightGray,
  [WeatherType.Mist]: Colors.LightGray,
  [WeatherType.Smoke]: Colors.LightGray,
  [WeatherType.Haze]: Colors.LightGray,
  [WeatherType.Dust]: Colors.LightGray,
  [WeatherType.Fog]: Colors.LightGray,
  [WeatherType.Sand]: Colors.Warm,
  [WeatherType.Ash]: Colors.LightGray,
  [WeatherType.Squall]: Colors.LightGray,
  [WeatherType.Tornado]: Colors.LightGray,
  [WeatherType.Unknown]: Colors.LightGray,
} as const

export type Chart = {
  x: number
  y: number
}
