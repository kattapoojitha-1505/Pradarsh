import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged   // <-- added
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDny1AuXs3Nd0sIJx6hD4f10FDjWIl6rkE",
    authDomain: "pradarsh-f84e9.firebaseapp.com",
    projectId: "pradarsh-f84e9",
    storageBucket: "pradarsh-f84e9.firebasestorage.app",
    messagingSenderId: "446649116405",
    appId: "1:446649116405:web:dba79a261a4240a45ec7bc",
    measurementId: "G-YJDMVZ2RSM"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Re-export so components can import everything from one place if convenient
export { onAuthStateChanged };

// Backend Sync Helper
export const syncWithBackend = async (user) => {
    const idToken = await user.getIdToken();
    const backendUrl = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

    const response = await fetch(`${backendUrl}/auth/verify-firebase`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${idToken}`,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) throw new Error("Backend sync failed");
    return await response.json();
};

export const loginWithGoogle = () => {
    signInWithPopup(auth, googleProvider).catch(err => console.log("Popup closed/blocked", err));
};

export const loginWithEmail = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return await syncWithBackend(userCredential.user);
};

export const registerWithEmail = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return await syncWithBackend(userCredential.user);
};