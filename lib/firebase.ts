import Constants from 'expo-constants'
import dayjs from 'dayjs'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/functions'

import type { HourlyWeather } from '@/functions/src/types/weather'

/* eslint-disable camelcase */
export type NatureLog = {
  created_at: firebase.firestore.Timestamp
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

export type AirConId = {
  id: string
  deviceId: string
  room_name: string
  nickname: string
}

type Mode = 'warm' | 'cool' | 'dry' | 'auto'
/* eslint-enable camelcase */

const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.apiKey,
  authDomain: Constants.expoConfig?.extra?.authDomain,
  projectId: Constants.expoConfig?.extra?.projectId,
  storageBucket: Constants.expoConfig?.extra?.storageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.messagingSenderId,
  appId: Constants.expoConfig?.extra?.appId,
}

firebase.initializeApp(firebaseConfig)
firebase.firestore().settings({
  experimentalForceLongPolling: true,
  merge: true,
})
const db = firebase.firestore()
const functions = firebase.app().functions('asia-northeast1')

export const handleLogin = (
  email: string,
  password: string,
  callback: Function
) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((credential) => {
      return credential.user
    })
    .catch((e) => {
      if (e instanceof Error) {
        console.error(`message: ${e.message}`)
        alert('ログインに失敗しました')
        callback(false)
      }
    })
}

export const getNatureLogs = async (
  startAt: dayjs.Dayjs,
  numberOfDay: number,
  limit: number
) => {
  const endAt = startAt.add(numberOfDay, 'day')
  try {
    const snapshot = await db
      .collection('nature_log')
      .orderBy('created_at', 'asc')
      .startAt(firebase.firestore.Timestamp.fromDate(startAt.toDate()))
      .endAt(firebase.firestore.Timestamp.fromDate(endAt.toDate()))
      .limit(limit)
      .get()
    const res = snapshot.docs.map((doc) => doc.data())
    return res as NatureLog[]
  } catch (e) {
    if (e instanceof Error) {
      console.error(`message: ${e.message}`)
      alert('室温・湿度ログの取得に失敗しました')
    }
    return []
  }
}

export const getAirConIds = async () => {
  try {
    const res = await functions.httpsCallable('getAirConIds')()
    return res.data as AirConId[]
  } catch (e) {
    if (e instanceof Error) {
      console.error(`message: ${e.message}`)
      alert('エアコンIDの取得に失敗しました')
    }
    return []
  }
}

export const putAirConId = async (id: string, deviceId: string) => {
  try {
    await functions.httpsCallable('putTargetAirConId')({
      id,
      device: { id: deviceId },
    })
  } catch (e) {
    if (e instanceof Error) {
      console.error(`message: ${e.message}`)
      alert('エアコンIDの保存に失敗しました')
    }
  }
}

export const turnOnAirCon = async (mode?: Mode) => {
  try {
    await functions.httpsCallable('turnOnAirCon')({ mode })
  } catch (e) {
    if (e instanceof Error) {
      console.error(`message: ${e.message}`)
      alert('エアコンの起動に失敗しました')
    }
  }
}

export const turnOffAirCon = async () => {
  try {
    await functions.httpsCallable('turnOffAirCon')()
  } catch (e) {
    if (e instanceof Error) {
      console.error(`message: ${e.message}`)
      alert('エアコンの停止に失敗しました')
    }
  }
}

export const getHourlyForecasts = async (
  startAt: dayjs.Dayjs,
  numberOfDay: number,
  limit: number
) => {
  const endAt = startAt.add(numberOfDay, 'day')
  try {
    const snapshot = await db
      .collection('open_weather')
      .orderBy('dt', 'asc')
      .where('dt', '>=', Math.floor(startAt.toDate().getTime() / 1000))
      .where('dt', '<', Math.floor(endAt.toDate().getTime() / 1000))
      .limit(limit)
      .get()
    const res = snapshot.docs.map((doc) => doc.data())
    return res as HourlyWeather[]
  } catch (e) {
    if (e instanceof Error) {
      console.error(`message: ${e.message}`)
      alert('天気予報ログの取得に失敗しました')
    }
    return []
  }
}

export default firebase
