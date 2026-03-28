// frontend/src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSy...", // Make sure there are NO spaces before or after this string
    authDomain: "driftkartt.firebaseapp.com",
    projectId: "driftkartt",
    storageBucket: "driftkartt.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);