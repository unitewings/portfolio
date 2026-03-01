import { readFileSync, writeFileSync, readdirSync, existsSync } from 'fs';
import * as path from 'path';
import crypto from 'crypto';

const uploadUrlMap = new Map<string, string>();

async function uploadFileToCloudinary(filePath: string): Promise<string | null> {
    if (!existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return null;
    }

    const { CLOUDINARY_URL } = process.env;
    if (!CLOUDINARY_URL) {
        throw new Error("Missing CLOUDINARY_URL");
    }

    const match = CLOUDINARY_URL.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
    if (!match) throw new Error("Invalid CLOUDINARY_URL format");
    const [, apiKey, apiSecret, cloudName] = match;

    const fileBuffer = readFileSync(filePath);
    const base64Data = fileBuffer.toString('base64');

    // Determine mime type roughly
    let mimeType = 'application/octet-stream';
    if (filePath.endsWith('.png')) mimeType = 'image/png';
    else if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) mimeType = 'image/jpeg';
    else if (filePath.endsWith('.pdf')) mimeType = 'application/pdf';
    else if (filePath.endsWith('.pptx')) mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    else if (filePath.endsWith('.txt')) mimeType = 'text/plain';

    const fileDataUri = `data:${mimeType};base64,${base64Data}`;
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signatureStr = `timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(signatureStr).digest("hex");

    const submitData = new FormData();
    submitData.append("file", fileDataUri);
    submitData.append("api_key", apiKey);
    submitData.append("timestamp", timestamp.toString());
    submitData.append("signature", signature);

    // Using auto resource type to support pptx/pdf as raw or auto
    const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
        method: "POST",
        body: submitData,
    });

    if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        console.error(`Cloudinary upload failed for ${filePath}:`, errorData);
        return null;
    }

    const result = await uploadRes.json();
    return result.secure_url;
}

// Ensure the code runs via tsx
async function run() {
    console.log("Starting Cloudinary migration...");

    // We will list all files in public/uploads and upload them
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (existsSync(uploadsDir)) {
        const files = readdirSync(uploadsDir);
        for (const file of files) {
            const filePath = path.join(uploadsDir, file);
            const localUrl = `/uploads/${file}`;
            console.log(`Uploading ${localUrl} ...`);
            const secureUrl = await uploadFileToCloudinary(filePath);
            if (secureUrl) {
                console.log(` -> ${secureUrl}`);
                uploadUrlMap.set(localUrl, secureUrl);
            }
        }
    } else {
        console.log("No public/uploads directory found.");
    }

    // Also list and upload all files in public/Images
    const imagesDir = path.join(process.cwd(), 'public', 'Images');
    if (existsSync(imagesDir)) {
        const imageFiles = readdirSync(imagesDir);
        for (const file of imageFiles) {
            if (file === "favicon.ico") continue;

            const filePath = path.join(imagesDir, file);
            const localUrl = `/Images/${file}`;
            console.log(`Uploading ${localUrl} ...`);
            const secureUrl = await uploadFileToCloudinary(filePath);
            if (secureUrl) {
                console.log(` -> ${secureUrl}`);
                uploadUrlMap.set(localUrl, secureUrl);
            }
        }
    } else {
        console.log("No public/Images directory found.");
    }

    console.log("Uploads complete. Updating Firestore...");

    // Instead of directly querying Firestore, let's use the local API if possible or just use firebase-admin
    // Since this is a standalone script, we need to initialize firebase-admin manually
    const admin = await import('firebase-admin');

    let key;
    try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            key = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        }
    } catch (e) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY in run script", e);
    }

    if (!admin.apps.length && key) {
        admin.initializeApp({
            credential: admin.credential.cert(key),
        });
    }

    const db = admin.firestore();

    // Update Posts
    const postsSnap = await db.collection("posts").get();
    for (const doc of postsSnap.docs) {
        const data = doc.data();
        let updated = false;

        // Check thumbnailUrl
        if (data.thumbnailUrl && uploadUrlMap.has(data.thumbnailUrl)) {
            data.thumbnailUrl = uploadUrlMap.get(data.thumbnailUrl);
            updated = true;
        }

        // Check content references
        if (data.content && typeof data.content === 'string') {
            let newContent = data.content;
            for (const [localUrl, secureUrl] of uploadUrlMap.entries()) {
                if (newContent.includes(localUrl)) {
                    // Global replace
                    newContent = newContent.split(localUrl).join(secureUrl);
                    updated = true;
                }
            }
            if (updated) {
                data.content = newContent;
            }
        }

        if (updated) {
            await doc.ref.update(data);
            console.log(`Updated post: ${doc.id}`);
        }
    }

    // Update Pages
    const pagesSnap = await db.collection("pages").get();
    for (const doc of pagesSnap.docs) {
        const data = doc.data();
        let updated = false;

        if (data.content && typeof data.content === 'string') {
            let newContent = data.content;
            for (const [localUrl, secureUrl] of uploadUrlMap.entries()) {
                if (newContent.includes(localUrl)) {
                    newContent = newContent.split(localUrl).join(secureUrl);
                    updated = true;
                }
            }
            if (updated) {
                data.content = newContent;
            }
        }

        if (updated) {
            await doc.ref.update(data);
            console.log(`Updated page: ${doc.id}`);
        }
    }

    // Update Settings
    const settingsSnap = await db.collection("settings").doc("global").get();
    if (settingsSnap.exists) {
        const data = settingsSnap.data()!;
        let updated = false;

        if (data.homeIntroContent) {
            let newContent = data.homeIntroContent;
            for (const [localUrl, secureUrl] of uploadUrlMap.entries()) {
                if (newContent.includes(localUrl)) {
                    newContent = newContent.split(localUrl).join(secureUrl);
                    updated = true;
                }
            }
            if (updated) data.homeIntroContent = newContent;
        }

        if (data.globalTitle && uploadUrlMap.has(data.globalTitle)) {
            // unlikely, but just in case
        }

        // maybe basic image
        if (data.basics?.image && uploadUrlMap.has(data.basics.image)) {
            data.basics.image = uploadUrlMap.get(data.basics.image);
            updated = true;
        }

        if (updated) {
            await settingsSnap.ref.update(data);
            console.log(`Updated settings`);
        }
    }

    // Save mappings for manual replacement of hardcoded strings
    writeFileSync('migration_mappings.json', JSON.stringify(Object.fromEntries(uploadUrlMap), null, 2));

    console.log("Migration finished successfully!");
}

run().catch(console.error);
