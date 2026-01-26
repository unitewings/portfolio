import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Analytics (Client-side only)
let analytics: any;

if (typeof window !== "undefined") {
    isSupported().then((supported) => {
        if (supported) {
            analytics = getAnalytics(app);
        }
    });
}

// Initialize Firestore with settings optimized for Node.js/Server environments
// 'experimentalForceLongPolling' helps avoid WebSocket issues in some node runtimes
// We also use 'initializeFirestore' to ensure specific settings are applied
import { getAuth } from "firebase/auth";
import { initializeFirestore } from "firebase/firestore";

const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});

const auth = getAuth(app);

let messaging: any;
if (typeof window !== "undefined") {
    import("firebase/messaging").then(({ getMessaging }) => {
        messaging = getMessaging(app);
    });
}

export { app, analytics, db, auth, messaging };
