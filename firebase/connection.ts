// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsNi_hftpHHLazyAzD3EUKXmNidvx2AME",
  authDomain: "reminds-da3ec.firebaseapp.com",
  projectId: "reminds-da3ec",
  storageBucket: "reminds-da3ec.appspot.com",
  messagingSenderId: "238684983224",
  appId: "1:238684983224:web:3fc224bd9abafc1893494d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
})
export const storage = getStorage(app)
export const db = getFirestore(app)