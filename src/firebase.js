import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCyk4BbTwftwxWRT4ZwMDuzoJcdROmj8o0",
  authDomain: "gamerstatistics-da9eb.firebaseapp.com",
  projectId: "gamerstatistics-da9eb",
  storageBucket: "gamerstatistics-da9eb.firebasestorage.app",
  messagingSenderId: "518646351255",
  appId: "1:518646351255:web:47d2f5a4c00014a18d30d2"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)