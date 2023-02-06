import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCUtIiPwoyZFwvxwDYzuPPYWi6QRdTZEnA',
  authDomain: 'desktop-chattng.firebaseapp.com',
  projectId: 'desktop-chattng',
  storageBucket: 'desktop-chattng.appspot.com',
  messagingSenderId: '398592865170',
  appId: '1:398592865170:web:c3ac2f6c046e3bfe9fc74b',
  measurementId: 'G-2WC8KV7YFM',
}

const firebaseApp = initializeApp(firebaseConfig)

export const firebaseAuthService = getAuth(firebaseApp)

export const firebaseDBService = getFirestore(firebaseApp)
