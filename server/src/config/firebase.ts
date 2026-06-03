import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

let db: any = null;
let auth: any = null;
let useMockDb = false;

try {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (serviceAccountPath) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
      databaseURL: `https://${projectId}.firebaseio.com`
    });
    db = admin.firestore();
    auth = admin.auth();
    console.log('Firebase Admin SDK initialized successfully via service account file.');
  } else if (privateKey && clientEmail && projectId) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
      databaseURL: `https://${projectId}.firebaseio.com`
    });
    db = admin.firestore();
    auth = admin.auth();
    console.log('Firebase Admin SDK initialized successfully via credentials env.');
  } else {
    // If no Firebase credentials, set flag to use in-memory Mock DB for testing Day 3 features.
    useMockDb = true;
    console.warn('No Firebase credentials found. Running in MOCK DB MODE.');
  }
} catch (error) {
  console.error('Failed to initialize Firebase Admin SDK. Falling back to MOCK DB MODE.', error);
  useMockDb = true;
}

export { admin, db, auth, useMockDb };
