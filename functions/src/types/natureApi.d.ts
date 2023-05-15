/* eslint-disable camelcase */
interface Device {
  name: string
  id: string
  created_at: string
  updated_at: string
  mac_address: string
  bt_mac_address: string
  serial_number: string
  firmware_version: string
  temperature_offset: number
  humidity_offset: number
}

interface Model {
  id: string
  country: string
  manufacturer: string
  remote_name: string
  series?: string
  name: string
  image: string
}

interface AirconRange {
  modes: {
    cool?: Mode
    dry?: Mode
    warm?: Mode
  }
  fixedButtons: string[]
}

interface Mode {
  temp: string[]
  dir: string[]
  dirh: string[]
  vol: string[]
}

interface Settings {
  temp: string
  temp_unit: string
  mode: string
  vol: string
  dir: string
  dirh: string
  button: string
  updated_at: string
}

interface Aircon {
  range: AirconRange
  tempUnit: string
}

interface Signal {
  id: string
  name: string
  image: string
}

interface LightButton {
  name: string
  image: string
  label: string
}

interface LightState {
  brightness: string
  power: string
  last_button: string
}

interface Light {
  buttons: LightButton[]
  state: LightState
}

interface Tv {
  [string]: unknown
}

interface SmartMeter {
  [string]: unknown
}

export interface Appliance {
  id: string
  device: Device
  model: Model
  type: string
  nickname: string
  image: string
  settings: Settings | null
  aircon: Aircon | null
  signals: Signal[]
  light?: Light
  tv?: Tv
  smart_meter?: SmartMeter
}
/* eslint-enable camelcase */
