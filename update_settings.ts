import * as admin from 'firebase-admin';

async function updateSettings() {
    console.log("Updating Firebase Settings...");
    let key;
    try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            key = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        }
    } catch (e) {
        console.error("Failed to parse key", e);
    }

    if (!admin.apps.length && key) {
        admin.initializeApp({
            credential: admin.credential.cert(key),
        });
    }

    const db = admin.firestore();
    const settingsRef = db.collection('settings').doc('global');

    const doc = await settingsRef.get();
    let currentData = doc.exists ? doc.data() : {};

    const updates = {
        profileName: "Swarn Shauryam",
        profileLabel: "AI, Growth & Journey",
        globalTitle: "Swarn Shauryam | AI, Growth & Journey",
        contactEmail: "swarn@unitewings.com",
        socialLinks: [{ network: "website", url: "https://swarn.unitewings.com", username: "" }]
    };

    console.log("Applying updates to Firestore:", updates);
    await settingsRef.set({ ...currentData, ...updates }, { merge: true });
    console.log("Successfully updated settings!");
}

updateSettings().catch(console.error);
