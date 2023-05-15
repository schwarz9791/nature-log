import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import fetch from 'node-fetch'

import type { Appliance, Device } from './types/natureApi'
import type { WeatherData, HourlyWeather } from './types/weather'

admin.initializeApp()

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

/* eslint-disable camelcase */
export type NatureRemoEvent = {
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
  target_device_id: string
}
/* eslint-enable camelcase */

const token = functions.config().nature_remo.access_token
const settingsKey = functions.config().user.settings_key
const openWeatherApiKey = functions.config().open_weather.api_key
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

const checkAuth = (context: functions.https.CallableContext) => {
  if (!context.auth)
    throw new functions.https.HttpsError('permission-denied', 'Auth Error')
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
  .https.onCall(async (data, context) => {
    checkAuth(context)
    if (!data?.id)
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid Argument'
      )

    await admin.firestore().collection('settings').doc(settingsKey).update({
      target_aircon_id: data.id,
      target_device_id: data.device.id,
    })

    const message = `Set target AirCon ID: ${data.id} succeeded.`
    // output log
    functions.logger.log({ message })
    return { result: 'succeeded', message }
  })

const getTargetAirConId = async () => {
  const snapshot = await admin
    .firestore()
    .collection('settings')
    .doc(settingsKey)
    .get()
  const settings = snapshot.data() as Settings
  functions.logger.log(settings)
  // eslint-disable-next-line camelcase
  return settings.target_aircon_id
}

const getTargetDeviceId = async () => {
  const snapshot = await admin
    .firestore()
    .collection('settings')
    .doc(settingsKey)
    .get()
  const settings = snapshot.data() as Settings
  functions.logger.log(settings)
  // eslint-disable-next-line camelcase
  return settings.target_device_id
}

export const getAirConIds = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    checkAuth(context)
    const appliances = await fetchAppliances()
    const airConIds = appliances
      .filter((appliance) => appliance.type === 'AC')
      .map((appliance) => ({
        id: appliance.id,
        deviceId: appliance.device.id,
        room_name: appliance.device.name,
        nickname: appliance.nickname,
      }))
    return airConIds
  })

export const turnOffAirCon = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    checkAuth(context)
    const id = await getTargetAirConId()
    const url = `https://api.nature.global/1/appliances/${id}/aircon_settings`
    const body = 'button=power-off'
    await fetch(url, {
      method: 'POST',
      headers: postHeaders,
      body,
    })

    const message = `Turn on AirCon succeeded.`
    // output log
    functions.logger.log({ message })
    return { result: 'succeeded', message }
  })

export const turnOnAirCon = functions
  .region('asia-northeast1')
  .https.onCall(async (data, context) => {
    checkAuth(context)
    const id = await getTargetAirConId()
    const url = `https://api.nature.global/1/appliances/${id}/aircon_settings`
    let mode = ''
    switch (data?.mode) {
      case 'warm':
      case 'cool':
      case 'dry':
        mode = data.mode
        break
      default:
        mode = 'auto'
    }
    await fetch(url, {
      method: 'POST',
      headers: postHeaders,
      body: `operation_mode=${mode}`,
    })

    const message = `Turn on AirCon for ${mode} mode succeeded.`
    // output log
    functions.logger.log({ message })
    return { result: 'succeeded', message }
  })

const storeNatureRemoData = async (data: NatureRemoEvent) => {
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
  const deviceId = await getTargetDeviceId()

  // output log
  functions.logger.info(
    `Get NatureRemo data succeeded. ${JSON.stringify(data)}`
  )

  // TODO: とりあえずSettingsで選択しているデバイスの最新ログを取得、全デバイスのログを保存するようにしたい
  return data.filter((d: Device) => d.id === deviceId)[0]
    .newest_events as NatureRemoEvent
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
      if (e instanceof Error) {
        res.status(500).json({ status: 500, message: e.message })
      }
    }
  })

export const cronGetNatureRemoData = functions
  .region('asia-northeast1')
  .pubsub.schedule('every 15 minutes synchronized')
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
      if (e instanceof Error) {
        functions.logger.error(
          `Get NatureRemo data failed.\n[MESSAGE]: ${e.message}`
        )
      }
      return null
    }
  })

const storeHourlyForecast = async (data: HourlyWeather[]) => {
  const collection = await admin.firestore().collection('open_weather')
  const results: FirebaseFirestore.DocumentData[] = []
  data.forEach(async (forecast) => {
    results.push(
      await collection
        .doc(
          admin.firestore.Timestamp.fromMillis(forecast.dt * 1000).toString()
        )
        .set({
          ...data,
          created_at: admin.firestore.Timestamp.now(),
        })
    )
  })

  // output log
  const ids = results.map((result) => result.id).join(', ')
  functions.logger.log({
    result: `Open Weather forecast data with IDs: ${ids} added.`,
  })

  return {
    ids: ids.split(', '),
    data,
  }
}

const fetchHourlyForecast = async () => {
  const url = 'https://api.openweathermap.org/data/3.0/onecall'
  // TODO: 仮で東京のlat,lon、Settings画面で位置情報などから設定可能にする
  const lat = 35.6828387
  const lon = 139.7594549
  const params = `?appid=${openWeatherApiKey}&lat=${lat}&lon=${lon}&units=metric&lang=ja&exclude=minutely,daily`

  const res = await fetch(`${url}${params}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  })

  const data = (await res.json()) as WeatherData
  return data
}

export const cronGetForecast = functions
  .region('asia-northeast1')
  // TODO: とりあえず毎時実行、0:00だけでも良い？
  .pubsub.schedule('every 1 hours synchronized')
  // .pubsub.schedule('every day at 00:00')
  .onRun(async (context) => {
    functions.logger.log(
      'Get start Open Weather forecast data!!!',
      JSON.stringify(context)
    )
    try {
      const hourlyForecast = await fetchHourlyForecast()
      await storeHourlyForecast(hourlyForecast.hourly.slice(0, 24))
      return null
    } catch (e) {
      if (e instanceof Error) {
        functions.logger.error(
          `Get Open Weather forecast data failed.\n[MESSAGE]: ${e.message}`
        )
      }
      return null
    }
  })
