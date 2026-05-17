// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkNWs8ZJPb8Nsw1stvJs-1RPIBt1u1mOc",
  authDomain: "gen-lang-client-0442648447.firebaseapp.com",
  projectId: "gen-lang-client-0442648447",
  storageBucket: "gen-lang-client-0442648447.firebasestorage.app",
  messagingSenderId: "1064087548698",
  appId: "1:1064087548698:web:6d036feaef919716b272a3",
  measurementId: "G-YC9F0SSX4L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and export it
const auth = getAuth(app);

export { app, auth };
