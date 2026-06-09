import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import { mockDb, mockAuth } from './mockdb';

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
    // No Firebase credentials → use in-memory Mock DB
    useMockDb = true;
    db = mockDb;
    auth = mockAuth;
    console.warn('No Firebase credentials found. Running in MOCK DB MODE.');
  }
} catch (error) {
  console.error('Failed to initialize Firebase Admin SDK. Falling back to MOCK DB MODE.', error);
  useMockDb = true;
  db = mockDb;
  auth = mockAuth;
}

export { admin, db, auth, useMockDb };
