// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcT8iVYg-JBvq4xrbfHJ-UovwUQvKreOU",
  authDomain: "applemart-24e60.firebaseapp.com",
  projectId: "applemart-24e60",
  storageBucket: "applemart-24e60.firebasestorage.app",
  messagingSenderId: "117235660618",
  appId: "1:117235660618:web:049985a03d92c04c2073b3",
  measurementId: "G-D1V5E0JV90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);