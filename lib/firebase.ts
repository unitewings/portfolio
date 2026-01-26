import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCQmTrkrxIWGUSnjowhzSvSgvnSJbYWW9A",
    authDomain: "portfolio-ce6d7.firebaseapp.com",
    projectId: "portfolio-ce6d7",
    storageBucket: "portfolio-ce6d7.firebasestorage.app",
    messagingSenderId: "343276605699",
    appId: "1:343276605699:web:6d395e8a695d5746d3d936",
    measurementId: "G-LVKZNX00T9"
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
