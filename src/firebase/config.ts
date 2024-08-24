import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import * as firebaseAuth from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCoqxr8OT0HnxfM9P2sXHXEn554BK-G2yg",
  authDomain: "mu-music-470cb.firebaseapp.com",
  projectId: "mu-music-470cb",
  databaseURL: "https://mu-music-470cb.firebaseio.com",
  storageBucket: "mu-music-470cb.appspot.com",
  messagingSenderId: "1019425232695",
  appId: "1:1019425232695:web:85d639638e5b5924fa2cb2",
  measurementId: "G-EE1NZYGWHH",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = firebaseAuth.getAuth(app);

export { db, auth };
