// ✅ Firebase ESM version for browser
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDy0I8E60PAIf7DnIv2-fu4eZK50OGHifM",
  authDomain: "login-interview-b2d85.firebaseapp.com",
  projectId: "login-interview-b2d85",
  storageBucket: "login-interview-b2d85.appspot.com",
  messagingSenderId: "467565649214",
  appId: "1:467565649214:web:d4dee8fa95692320c6606f",
  measurementId: "G-C87HTBE4FZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
