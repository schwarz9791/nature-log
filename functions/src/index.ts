import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import fetch from 'node-fetch'

admin.initializeApp()

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

/* eslint-disable camelcase */
type NatureRemoNewestEvents = {
  hu: {
    created_at: Date
    val: number
  }
  il: {
    created_at: Date
    val: number
  }
  mo: {
    created_at: Date
    val: number
  }
  te: {
    created_at: Date
    val: number
  }
}
/* eslint-enable camelcase */

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
  const token = functions.config().nature_remo.access_token
  const headers = {
    'Content-Type': 'application/json;',
    Authorization: 'Bearer ' + token,
  }
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
      const result = await storeNatureRemoData(latestLog)
      // 直接実行する用のAPIなので、レスポンスに保存されたデータを返す
      res.json({ status: 200, result })
    } catch (e) {
      res.json({ status: e.status, message: e.message })
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
