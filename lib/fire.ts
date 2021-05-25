import Constants from 'expo-constants'
import firebase from 'firebase'
import 'firebase/firestore'
// import 'firebase/functions'
// import functions from '@react-native-firebase/functions'

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

export type AirConId = { id: string; room_name: string; nickname: string }
/* eslint-enable camelcase */

const firebaseConfig = {
  apiKey: Constants.manifest.extra?.apiKey,
  authDomain: Constants.manifest.extra?.authDomain,
  projectId: Constants.manifest.extra?.projectId,
  storageBucket: Constants.manifest.extra?.storageBucket,
  messagingSenderId: Constants.manifest.extra?.messagingSenderId,
  appId: Constants.manifest.extra?.appId,
}
const Firebase = firebase.initializeApp(firebaseConfig)
const db = Firebase.firestore()
// const functions = firebase.functions(Firebase)

const getFuncUrl = (func: string) => {
  return `https://asia-northeast1-${firebaseConfig.projectId}.cloudfunctions.net/${func}`
}

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
}

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
    return []
  }
}

export const getAirConIds = async () => {
  try {
    const res = await fetch(getFuncUrl('getAirConIds'), { headers })
    return (await res.json()) as AirConId[]
  } catch (e) {
    console.error(`message: ${e.message}`)
    return []
  }
}

export const putAirConId = async (id: string) => {
  try {
    await fetch(getFuncUrl('putTargetAirConId'), {
      method: 'PUT',
      headers,
      body: JSON.stringify({ id }),
    })
  } catch (e) {
    console.error(`message: ${e.message}`)
  }
}

export default Firebase
