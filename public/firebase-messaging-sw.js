importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyCQmTrkrxIWGUSnjowhzSvSgvnSJbYWW9A",
    authDomain: "portfolio-ce6d7.firebaseapp.com",
    projectId: "portfolio-ce6d7",
    storageBucket: "portfolio-ce6d7.firebasestorage.app",
    messagingSenderId: "343276605699",
    appId: "1:343276605699:web:6d395e8a695d5746d3d936",
    measurementId: "G-LVKZNX00T9"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon || '/icon.png' // You might want to add an icon to public/
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
