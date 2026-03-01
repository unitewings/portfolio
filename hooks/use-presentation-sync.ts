"use client";

import { useEffect, useState, useRef } from "react";
import { doc, onSnapshot, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Presentation, Slide } from "@/types/uw-interact";

export function usePresentationSync(accessCode: string) {
    const [presentation, setPresentation] = useState<Presentation | null>(null);
    const [activeSlide, setActiveSlide] = useState<Slide | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const presentationIdRef = useRef<string | null>(null);

    // Find presentation by access code and listen to updates
    useEffect(() => {
        if (!accessCode) {
            return;
        }

        setLoading(true);
        setError(null);

        let unsubPres: (() => void) | null = null;

        const findAndListenToPresentation = async () => {
            try {
                const q = query(
                    collection(db, "presentations"),
                    where("accessCode", "==", accessCode),
                    where("status", "in", ["live", "ended"])
                );

                const snapshot = await getDocs(q);

                if (snapshot.empty) {
                    setError("Presentation not found or not active");
                    setLoading(false);
                    return;
                }

                const presentationDoc = snapshot.docs[0];
                const presentationId = presentationDoc.id;
                presentationIdRef.current = presentationId;

                // Set initial data
                setPresentation({ id: presentationId, ...presentationDoc.data() } as Presentation);

                // Listen to the specific document for realtime updates
                unsubPres = onSnapshot(doc(db, "presentations", presentationId), (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        const updatedPresentation = { ...data, id: docSnap.id } as Presentation;
                        setPresentation(updatedPresentation);
                    } else {
                        setError("Presentation ended or removed");
                    }
                });
            } catch (err: unknown) {
                console.error("Error finding presentation:", err);
                setError(err instanceof Error ? err.message : String(err));
                setLoading(false);
            }
        };

        findAndListenToPresentation();

        return () => {
            if (unsubPres) unsubPres();
        };
    }, [accessCode]);

    // Listen to active slide - this effect triggers when activeSlideId changes
    useEffect(() => {
        const presentationId = presentationIdRef.current;

        if (!presentationId || !presentation?.activeSlideId) {
            if (activeSlide !== null) setActiveSlide(null);
            return;
        }

        console.log("[usePresentationSync] Active slide changed to:", presentation.activeSlideId);

        const unsubSlide = onSnapshot(
            doc(db, "presentations", presentationId, "slides", presentation.activeSlideId),
            (docSnap) => {
                if (docSnap.exists()) {
                    const slideData = { id: docSnap.id, ...docSnap.data() } as Slide;
                    console.log("[usePresentationSync] Loaded slide:", slideData.content?.question);
                    setActiveSlide(slideData);
                    setLoading(false);
                } else {
                    console.log("[usePresentationSync] Slide doc not found");
                    setActiveSlide(null);
                    setLoading(false);
                }
            },
            (err) => {
                console.error("Error fetching slide:", err);
                setError("Error loading active slide");
            }
        );

        return () => unsubSlide();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [presentation?.activeSlideId, presentation?.id, loading]);

    return { presentation, activeSlide, loading, error };
}
