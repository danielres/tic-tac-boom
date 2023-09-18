import {
  PUBLIC_FBASE_API_KEY,
  PUBLIC_FBASE_APP_ID,
  PUBLIC_FBASE_AUTH_DOMAIN,
  PUBLIC_FBASE_DATABASE_URL,
  PUBLIC_FBASE_MESSAGING_SENDER_ID,
  PUBLIC_FBASE_PROJECT_ID,
  PUBLIC_FBASE_STORAGE_BUCKET,
} from '$env/static/public'
import * as firebase from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'
import { GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: PUBLIC_FBASE_API_KEY,
  authDomain: PUBLIC_FBASE_AUTH_DOMAIN,
  databaseURL: PUBLIC_FBASE_DATABASE_URL,
  projectId: PUBLIC_FBASE_PROJECT_ID,
  storageBucket: PUBLIC_FBASE_STORAGE_BUCKET,
  messagingSenderId: PUBLIC_FBASE_MESSAGING_SENDER_ID,
  appId: PUBLIC_FBASE_APP_ID,
}

export const app = firebase.initializeApp(firebaseConfig)
export const db = getDatabase(app)
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
