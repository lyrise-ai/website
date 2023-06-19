import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: 'AIzaSyAT_zLSE8FIIBb_wpQGf0r-fid_kHBsPyE',
  authDomain: 'lyra-b1544.firebaseapp.com',
  databaseURL: 'https://lyra-b1544.firebaseio.com',
  projectId: 'lyra-b1544',
  storageBucket: 'lyra-b1544.appspot.com',
  messagingSenderId: '314420618929',
  appId: '1:314420618929:web:1b8d94e03ed829f4542490',
  measurementId: 'G-3S7WC7X9N3',
}

export const app = initializeApp(firebaseConfig)
