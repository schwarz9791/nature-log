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
  Unknown: 'Unknown',
} as const
// export type WeatherType = typeof Weathers[number]

// TODO
export const WeatherIconMap = {
  [WeatherType.Clear]: 'sun',
  [WeatherType.Clouds]: 'cloud',
  [WeatherType.Unknown]: 'help-circle',
} as const

// TODO
export const WeatherColorMap = {
  [WeatherType.Clear]: Colors.Warm,
  [WeatherType.Clouds]: Colors.Gray,
  [WeatherType.Unknown]: Colors.LightGray,
} as const

export type Chart = {
  x: string
  y: number
}
