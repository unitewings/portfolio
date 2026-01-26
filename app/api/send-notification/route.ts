import { NextRequest, NextResponse } from 'next/server';
import { getAdminMessaging, getAdminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
    try {
        const { title, body, targetToken, userId, broadcast } = await req.json();

        if (!title || !body) {
            return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
        }

        // Initialize Admin SDK services lazily inside the handler
        let adminMessaging;
        let adminDb;

        try {
            adminMessaging = getAdminMessaging();
            adminDb = getAdminDb();
        } catch (e: any) {
            console.error("Firebase Admin Init Error:", e);
            return NextResponse.json({ error: "Firebase Admin Init Failed: " + e.message }, { status: 500 });
        }

        if (broadcast) {
            // Fetch all tokens from Firestore (Batching might be needed for huge datasets)
            let tokensSnapshot;
            try {
                tokensSnapshot = await adminDb.collection('fcm_tokens').get();
            } catch (e: any) {
                console.error("Firestore Error:", e);
                return NextResponse.json({ error: "Firestore Access Failed: " + e.message }, { status: 500 });
            }

            if (tokensSnapshot.empty) {
                return NextResponse.json({ success: false, message: 'No registered devices found' });
            }

            const tokens = tokensSnapshot.docs.map(doc => doc.data().token).filter(t => !!t);

            // Deduplicate tokens just in case
            const uniqueTokens = Array.from(new Set(tokens));

            if (uniqueTokens.length === 0) {
                return NextResponse.json({ success: false, message: 'No valid tokens found' });
            }

            const message = {
                notification: { title, body },
                tokens: uniqueTokens,
            };

            const response = await adminMessaging.sendEachForMulticast(message);

            // Cleanup invalid tokens
            if (response.failureCount > 0) {
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        // Remove invalid token from DB
                        // Note: We used Set() so idx matches uniqueTokens array
                        const invalidToken = uniqueTokens[idx];
                        // Ideally, delete from Firestore here. 
                        // adminDb.collection('fcm_tokens').doc(invalidToken).delete();
                        console.log(`Failed to send to ${invalidToken}: ${resp.error}`);
                    }
                });
            }

            return NextResponse.json({
                success: true,
                message: `Sent to ${response.successCount} devices. Failed: ${response.failureCount}`,
                response
            });
        }

        let token = targetToken;

        if (!token && userId) {
            // Look up token by userId
            // This assumes 1:amp mapping or just taking one. 
            // Real world: you might want to send to ALL tokens for that user.
            const tokensSnapshot = await adminDb.collection('fcm_tokens')
                .where('userId', '==', userId)
                .orderBy('lastUpdated', 'desc')
                .limit(1)
                .get();

            if (!tokensSnapshot.empty) {
                token = tokensSnapshot.docs[0].data().token;
            }
        }

        if (!token) {
            return NextResponse.json({ error: 'Target token or valid UserId not provided' }, { status: 400 });
        }

        const message = {
            notification: {
                title,
                body,
            },
            token: token,
        };

        const response = await adminMessaging.send(message);

        return NextResponse.json({ success: true, response });
    } catch (error: any) {
        console.error('Error sending notification:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
