import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import fetch from 'node-fetch'

admin.initializeApp()

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

/* eslint-disable camelcase */
type NatureRemoNewestEvents = {
  hu: {
    created_at: string
    val: number
  }
  il: {
    created_at: string
    val: number
  }
  mo: {
    created_at: string
    val: number
  }
  te: {
    created_at: string
    val: number
  }
}

type Device = {
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

type AirConParams = {
  temp: string
  temp_unit: string
  mode: string
  vol: string
  dir: string
  dirh: string
  button: string
  updated_at: string
}

type ApplianceModal = {
  id: string
  country: string
  manufacturer: string
  remote_name: string
  series: string
  name: string
  image: string
}

type Aircon = {}
type Tv = {}
type Light = {}
type SmartMeter = {}

type Signal = {
  id: string
  name: string
  image: string
}

type Appliance = {
  id: string
  device: Device
  model: ApplianceModal
  nickname: string
  image: string
  type: string
  settings: AirConParams
  aircon?: Aircon
  tv?: Tv
  light?: Light
  smart_meter?: SmartMeter
  signals: Signal[]
}

type Settings = {
  automation: boolean
  threshold: {
    cool: {
      hu: number
      te: number
    }
    dry: {
      hu: number
      te: number
    }
    warm: {
      hu: number
      te: number
    }
  }
  wind_ve: number
  target_aircon_id: string
}
/* eslint-enable camelcase */

const token = functions.config().nature_remo.access_token
const settingsKey = functions.config().user.settings_key
const headers = {
  'Content-Type': 'application/json;charset=UTF-8',
  Authorization: 'Bearer ' + token,
  accept: 'application/json',
}
const postHeaders = {
  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  Authorization: 'Bearer ' + token,
  accept: 'application/json',
}

const fetchAppliances = async () => {
  const url = 'https://api.nature.global/1/appliances'
  const res = await fetch(url, {
    method: 'GET',
    headers,
  })
  const data = (await res.json()) as Appliance[]
  return data
}

export const putTargetAirConId = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    try {
      if (!req.params?.id) throw new Error('Require id.')

      await admin.firestore().collection('settings').doc(settingsKey).update({
        target_aircon_id: req.params.id,
      })

      // output log
      functions.logger.log({
        result: `Set target AirCon ID: ${req.params.id} succeeded.`,
      })
      res.status(200).send()
    } catch (e) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        `message: ${e.message}`
      )
    }
  })

const getTargetAirConId = async () => {
  const snapshot = await admin
    .firestore()
    .collection('settings')
    .doc(settingsKey)
    .get()
  const settings = snapshot.data() as Settings
  // eslint-disable-next-line camelcase
  return settings.target_aircon_id
}

export const getAirConIds = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    try {
      const appliances = await fetchAppliances()
      const airConIds = appliances
        .filter((appliance) => appliance.type === 'AC')
        .map((appliance) => appliance.id)
      res.status(200).json(airConIds)
    } catch (e) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        `message: ${e.message}`
      )
    }
  })

export const turnOffAirCon = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    try {
      const id = await getTargetAirConId()
      const url = `https://api.nature.global/1/appliances/${id}/aircon_settings`
      const body = 'button=power-off'
      await fetch(url, {
        method: 'POST',
        headers: postHeaders,
        body,
      })
      res.status(200).json({ data: 'Turn off AirCon succeeded.' })
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  })

export const turnOnAirCon = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    try {
      const id = await getTargetAirConId()
      const url = `https://api.nature.global/1/appliances/${id}/aircon_settings`
      let mode = ''
      switch (req.query.mode) {
        case 'warm':
        case 'cool':
        case 'dry':
          mode = req.query.mode
          break
        default:
          mode = 'auto'
      }
      await fetch(url, {
        method: 'POST',
        headers: postHeaders,
        body: `operation_mode=${mode}`,
      })
      res.status(200).json({
        data: `Turn on AirCon for ${mode} mode succeeded.`,
      })
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  })

const storeNatureRemoData = async (data: NatureRemoNewestEvents) => {
  const result = await admin
    .firestore()
    .collection('nature_log')
    .add({
      ...data,
      created_at: admin.firestore.Timestamp.now(),
    })

  // output log
  functions.logger.log({
    result: `Nature log with ID: ${result.id} added.`,
  })

  return {
    id: result.id,
    data,
  }
}

const fetchNatureRemoData = async () => {
  const url = 'https://api.nature.global/1/devices'
  const res = await fetch(url, {
    method: 'GET',
    headers,
  })
  const data = await res.json()

  // output log
  functions.logger.info(
    `Get NatureRemo data succeeded. ${JSON.stringify(data)}`
  )

  return data[0].newest_events as NatureRemoNewestEvents
}

export const getNatureRemoData = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    try {
      const latestLog = await fetchNatureRemoData()
      // Nature Remo APIから値を取得するだけで、firestoreには保存しないようにしておく
      // const result = await storeNatureRemoData(latestLog)
      // 直接実行する用のAPIなので、レスポンスに取得できたデータを返す
      res.status(200).json({ data: latestLog })
    } catch (e) {
      res.status(500).json({ message: e.message })
    }
  })

export const cronGetNatureRemoData = functions
  .region('asia-northeast1')
  .pubsub.schedule('every 15 minutes')
  .onRun(async (context) => {
    functions.logger.log(
      'Get start Nature Remo data!!!',
      JSON.stringify(context)
    )
    try {
      const latestLog = await fetchNatureRemoData()
      await storeNatureRemoData(latestLog)
      return null
    } catch (e) {
      functions.logger.error(
        `Get NatureRemo data failed.\n[MESSAGE]: ${e.message}`
      )
      return null
    }
  })
