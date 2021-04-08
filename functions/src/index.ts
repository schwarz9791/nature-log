import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import fetch from 'node-fetch'

admin.initializeApp()

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info('Hello logs!', {structuredData: true});
//   response.send('Hello from Firebase!');
// });
export const addMessage = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    const original = req.query.text
    const writeResult = await admin.firestore().collection('messages').add({
      original,
      created_at: admin.firestore.Timestamp.now(),
    })
    res.json({
      result: `Message with ID: ${writeResult.id} added.`,
    })
  })

export const makeUppercase = functions
  .region('asia-northeast1')
  .firestore.document('/messages/{documentId}')
  .onCreate((snap, context) => {
    const original = snap.data().original
    functions.logger.log('Uppercasing', context.params.documentId, original)
    const uppercase = original.toUpperCase()
    return snap.ref.set(
      {
        uppercase,
      },
      {
        merge: true,
      }
    )
  })

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
  const lastData = data[0].newest_events

  functions.logger.info(
    `Get NatureRemo data succeeded. ${JSON.stringify(lastData)}`
  )

  const writeResult = await admin
    .firestore()
    .collection('nature_log')
    .add(lastData)
  functions.logger.log({
    result: `Nature log with ID: ${writeResult.id} added.`,
  })

  return {
    [writeResult.id]: lastData,
  }
}

export const getNatureRemoData = functions
  .region('asia-northeast1')
  .https.onRequest(async (req, res) => {
    try {
      const result = await fetchNatureRemoData()
      res.json({
        result: `Nature log with ID: ${Object.keys(result)[0]} added.`,
      })
    } catch (e) {
      res.json(e.message)
    }
  })

export const cronGetNatureRemoData = functions
  .region('asia-northeast1')
  .pubsub.schedule('every 15 minutes')
  .onRun(async (context) => {
    functions.logger.log('Get NatureRemo Data!!!', JSON.stringify(context))
    try {
      await fetchNatureRemoData()
      return null
    } catch (e) {
      return null
    }
  })
