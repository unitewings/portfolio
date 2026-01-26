import { NextRequest, NextResponse } from 'next/server';
import { getAdminMessaging, getAdminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
    try {
        const { title, body, targetToken, userId, broadcast, link, imageUrl, iconUrl, tag } = await req.json();

        if (!title || !body) {
            return NextResponse.json({ error: 'Title and body are required' }, { status: 400 });
        }

        const clickUrl = link || '/';

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

        // Base message validation
        // Remove undefined values cleanly
        const cleanPayload = (obj: any) => {
            return Object.entries(obj)
                .filter(([_, v]) => v != null && v !== '')
                .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
        };

        const baseMessage = {
            notification: cleanPayload({
                title,
                body,
                imageUrl: imageUrl || undefined,
            }),
            webpush: {
                notification: cleanPayload({
                    title,
                    body,
                    icon: iconUrl || '/icon.png',
                    image: imageUrl || undefined,
                    tag: tag || undefined,
                    requireInteraction: true,
                }),
                fcm_options: {
                    link: clickUrl
                }
            },
            data: {
                link: clickUrl,
                url: clickUrl,
                click_action: clickUrl
            }
        };

        if (broadcast) {
            // Fetch all tokens from Firestore
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
            const uniqueTokens = Array.from(new Set(tokens));

            if (uniqueTokens.length === 0) {
                return NextResponse.json({ success: false, message: 'No valid tokens found' });
            }

            // Construct message for multicast
            // Multicast uses "tokens" array, singular "token" is for single
            const message = {
                ...baseMessage,
                tokens: uniqueTokens,
            };

            const response = await adminMessaging.sendEachForMulticast(message as any);

            // Cleanup invalid tokens with smart logic
            if (response.failureCount > 0) {
                const cleanupPromises = response.responses.map(async (resp, idx) => {
                    if (!resp.success) {
                        const invalidToken = uniqueTokens[idx];
                        const docRef = adminDb.collection('fcm_tokens').doc(invalidToken);
                        const errCode = resp.error?.code || '';

                        // List of permanent errors where we should delete immediately
                        const permanentErrors = [
                            'messaging/registration-token-not-registered',
                            'messaging/invalid-registration-token',
                            'messaging/invalid-argument'
                        ];

                        if (permanentErrors.includes(errCode)) {
                            console.log(`Deleting invalid token (Permanent Error: ${errCode}): ${invalidToken}`);
                            return docRef.delete();
                        } else {
                            // Transient error: Increment failure count
                            try {
                                return adminDb.runTransaction(async (t: any) => {
                                    const doc = await t.get(docRef);
                                    if (!doc.exists) return; // Already gone

                                    const currentFailures = (doc.data().failureCount || 0) + 1;

                                    if (currentFailures >= 5) {
                                        console.log(`Deleting token after ${currentFailures} failures: ${invalidToken}`);
                                        t.delete(docRef);
                                    } else {
                                        t.update(docRef, {
                                            failureCount: currentFailures,
                                            lastFailureError: errCode,
                                            lastFailure: new Date()
                                        });
                                    }
                                });
                            } catch (err) {
                                console.error(`Failed to update failure count for ${invalidToken}`, err);
                            }
                        }
                    } else {
                        // Optional: Reset failure count on success if it exists
                        // To save writes, we usually don't do this for every success, 
                        // but if you want strict "consecutive fails", you would update here.
                        // For now, ignoring successes to minimize DB writes.
                        return Promise.resolve();
                    }
                });

                // Wait for all cleanup ops (non-blocking for the response, but good to wait for logging)
                await Promise.allSettled(cleanupPromises);
            }

            return NextResponse.json({
                success: true,
                message: `Sent to ${response.successCount} devices. Failed: ${response.failureCount}`,
                response
            });
        }

        // Single Send Logic
        let token = targetToken;

        if (!token && userId) {
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
            ...baseMessage,
            token: token,
        };

        const response = await adminMessaging.send(message as any);

        return NextResponse.json({ success: true, response });
    } catch (error: any) {
        console.error('Error sending notification:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
