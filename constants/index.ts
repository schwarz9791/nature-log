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
}

// TODO
export type WeatherType = 'Clear' | 'Clouds'

// TODO
export const WeatherIconMap = {
  Clear: 'sun',
  Clouds: 'cloud',
}

export type Chart = {
  x: string
  y: number
}
