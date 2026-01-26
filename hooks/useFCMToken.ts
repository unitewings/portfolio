import { useEffect, useState } from 'react';
import { getToken, onMessage, Unsubscribe } from 'firebase/messaging';
import { app } from '@/lib/firebase';

const useFCMToken = () => {
    const [token, setToken] = useState<string | null>(null);
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null);

    useEffect(() => {
        const retrieveToken = async () => {
            if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                try {
                    const messaging = (await import('firebase/messaging')).getMessaging(app);

                    const permission = await Notification.requestPermission();
                    setNotificationPermission(permission);

                    if (permission === 'granted') {
                        const currentToken = await getToken(messaging, {
                            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                        });

                        if (currentToken) {
                            console.log('FCM Token:', currentToken);
                            setToken(currentToken);
                        } else {
                            console.log('No registration token available. Request permission to generate one.');
                        }
                    }
                } catch (error) {
                    console.error('An error occurred while retrieving token:', error);
                }
            }
        };

        retrieveToken();
    }, []);

    useEffect(() => {
        let unsubscribe: Unsubscribe | null = null;

        const setupOnMessage = async () => {
            if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                try {
                    const messaging = (await import('firebase/messaging')).getMessaging(app);
                    unsubscribe = onMessage(messaging, (payload) => {
                        console.log('Foreground message received:', payload);
                        // You can show a toast or update UI here
                        // e.g., toast(payload.notification?.title);
                    });
                } catch (error) {
                    console.error("Error setting up onMessage:", error);
                }
            }
        };

        setupOnMessage();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []); // Only run once

    return { token, notificationPermission };
};

export default useFCMToken;
