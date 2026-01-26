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
        icon: payload.notification.icon || '/icon.png',
        image: payload.notification.image,
        tag: payload.notification.tag,
        renotify: payload.notification.renotify,
        requireInteraction: payload.notification.requireInteraction,
        actions: payload.notification.actions ? JSON.parse(payload.notification.actions) : undefined,
        data: payload.data
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function (event) {
    console.log('[firebase-messaging-sw.js] Notification click Received.', event);
    event.notification.close();

    // Custom handling for 'link' in data or fcm_options
    const link = event.notification.data?.link || event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (let i = 0; i < windowClients.length; i++) {
                const client = windowClients[i];
                if (client.url === link && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(link);
            }
        })
    );
});
