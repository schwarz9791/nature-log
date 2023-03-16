import Constants from 'expo-constants'
import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/functions'

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
const db = firebase.firestore()
const functions = firebase.app().functions('asia-northeast1')

export const getNatureLogs = async (limit: number) => {
  try {
    const snapshot = await db
      .collection('nature_log')
      .orderBy('created_at', 'desc')
      .limit(limit)
      .get()
    const res = snapshot.docs.map((doc) => doc.data())
    return res as NatureLog[]
  } catch (e) {
    console.error(`message: ${e.message}`)
    alert('ログの取得に失敗しました')
    return []
  }
}

export const getAirConIds = async () => {
  try {
    const res = await functions.httpsCallable('getAirConIds')()
    return res.data as AirConId[]
  } catch (e) {
    console.error(`message: ${e.message}`)
    alert('エアコンIDの取得に失敗しました')
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
    console.error(`message: ${e.message}`)
    alert('エアコンIDの保存に失敗しました')
  }
}

export const turnOnAirCon = async (mode?: Mode) => {
  try {
    await functions.httpsCallable('turnOnAirCon')({ mode })
  } catch (e) {
    console.error(`message: ${e.message}`)
    alert('エアコンの起動に失敗しました')
  }
}

export const turnOffAirCon = async () => {
  try {
    await functions.httpsCallable('turnOffAirCon')()
  } catch (e) {
    console.error(`message: ${e.message}`)
    alert('エアコンの停止に失敗しました')
  }
}

export default firebase
