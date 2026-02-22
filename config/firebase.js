// Firebase v9 modular SDK (Production Safe)

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyCYJLGlg81RfBVcBLFogPX3Llnw9j77Oy8",
authDomain: "mocmed-auth.firebaseapp.com",
projectId: "mocmed-auth",
storageBucket: "mocmed-auth.firebasestorage.app",
messagingSenderId: "310034022210",
appId: "1:310034022210:web:e6dcbc9278e3be15c092db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);

export default app;
