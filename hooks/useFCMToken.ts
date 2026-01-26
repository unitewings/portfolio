import { useEffect, useState, useRef } from 'react';
import { getToken, onMessage, Unsubscribe, getMessaging } from 'firebase/messaging';
import { app, db, auth } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'sonner';

const useFCMToken = () => {
    const [token, setToken] = useState<string | null>(null);
    const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null);

    const isInitializing = useRef(false);

    // Function to trigger permission request manually (User Gesture)
    const requestPermission = async () => {
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

        try {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);
            if (permission === 'granted') {
                retrieveToken();
            } else {
                toast.error("Notifications blocked", { description: "Please enable them in browser settings." });
            }
        } catch (error) {
            console.error("Error requesting permission:", error);
        }
    };

    const retrieveToken = async () => {
        // Prevent double initialization
        if (isInitializing.current) return;
        isInitializing.current = true;

        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            try {
                const messaging = getMessaging(app);

                // Permission check (don't request if not granted yet, unless manual)
                if (Notification.permission !== 'granted') {
                    isInitializing.current = false;
                    return;
                }

                const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

                if (!vapidKey) {
                    console.error('VAPID Key is missing!');
                    isInitializing.current = false;
                    return;
                }

                // Explicitly register Service Worker
                try {
                    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
                    console.log('Service Worker registered:', registration);
                } catch (err) {
                    console.error('Service Worker registration failed:', err);
                    isInitializing.current = false;
                    return;
                }

                // Wait for it to be ready
                const swRegistration = await navigator.serviceWorker.ready;
                console.log('Service Worker is ready:', swRegistration);

                // Small delay to ensure SW is fully initialized in browser context
                await new Promise(resolve => setTimeout(resolve, 1000));

                try {
                    const currentToken = await getToken(messaging, {
                        vapidKey: vapidKey,
                        serviceWorkerRegistration: swRegistration,
                    });

                    if (currentToken) {
                        console.log('FCM Token:', currentToken);
                        setToken(currentToken);
                        await saveTokenToFirestore(currentToken);
                    } else {
                        console.log('No registration token available.');
                    }
                } catch (tokenError: any) {
                    if (tokenError.message && tokenError.message.includes('Registration failed')) {
                        console.warn('FCM Registration failed (likely transient or already subscribed):', tokenError);
                    } else {
                        console.error('Error getting token:', tokenError);
                    }
                }
            } catch (error) {
                console.error('An error occurred while retrieving token:', error);
            } finally {
                isInitializing.current = false;
            }
        }
    };

    useEffect(() => {
        // Attempt to auto-load token if already granted OR if user wants it automatic (best effort)
        // Note: Browsers will block this if it's not a user gesture, but it doesn't hurt to try
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            if (Notification.permission === 'granted') {
                retrieveToken();
            } else if (Notification.permission === 'default') {
                // Try to request, but it might fail or be ignored by browser
                requestPermission();
            }
            setNotificationPermission(Notification.permission);
        }
    }, []);

    const saveTokenToFirestore = async (token: string) => {
        try {
            const user = auth.currentUser;
            const userId = user ? user.uid : 'anonymous';

            const tokenRef = doc(db, 'fcm_tokens', token);
            await setDoc(tokenRef, {
                token: token,
                userId: userId,
                deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
                lastUpdated: serverTimestamp(),
            }, { merge: true });

            console.log('Token saved to Firestore');
        } catch (error) {
            console.error('Error saving token to Firestore:', error);
        }
    };

    useEffect(() => {
        let unsubscribe: Unsubscribe | null = null;

        const setupOnMessage = async () => {
            if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                try {
                    const messaging = getMessaging(app);
                    unsubscribe = onMessage(messaging, (payload) => {
                        console.log('Foreground message received:', payload);

                        // Show in-app toast
                        if (payload.notification) {
                            toast(payload.notification.title, {
                                description: payload.notification.body,
                            });

                            // also try to show system notification for mobile feel
                            if ('serviceWorker' in navigator) {
                                navigator.serviceWorker.ready.then(registration => {
                                    registration.showNotification(payload.notification?.title || 'New Message', {
                                        body: payload.notification?.body,
                                        icon: '/icon.png',
                                        data: payload.data, // pass data for click handling
                                        tag: 'foreground-notification'
                                    });
                                });
                            }
                        }
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

    return { token, notificationPermission, requestPermission };
};

export default useFCMToken;
