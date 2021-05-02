import Constants from 'expo-constants'
import firebase from 'firebase'
import 'firebase/firestore'

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

export default Firebase
