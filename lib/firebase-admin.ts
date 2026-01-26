import admin from 'firebase-admin';

function formatPrivateKey(key: string) {
    return key.replace(/\\n/g, '\n');
}

export function initAdmin() {
    if (!admin.apps.length) {
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

        if (!serviceAccountKey) {
            console.error('FIREBASE_SERVICE_ACCOUNT_KEY is missing from env!');
            return null;
        }

        try {
            const serviceAccount = JSON.parse(serviceAccountKey);

            // Handle private key newlines if they aren't formatted correctly
            if (serviceAccount.private_key) {
                serviceAccount.private_key = formatPrivateKey(serviceAccount.private_key);
            }

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });
            console.log('Firebase Admin Initialized successfully.');
        } catch (error) {
            console.error('Firebase admin initialization error:', error);
            return null;
        }
    }
    return admin;
}

export const getAdminAuth = () => {
    const app = initAdmin();
    if (!app) throw new Error("Firebase Admin not initialized");
    return app.auth();
};

export const getAdminDb = () => {
    const app = initAdmin();
    if (!app) throw new Error("Firebase Admin not initialized");
    return app.firestore();
};

export const getAdminMessaging = () => {
    const app = initAdmin();
    if (!app) throw new Error("Firebase Admin not initialized");
    return app.messaging();
};
