"use client";

import { use, useEffect, useState } from "react";
import { doc, onSnapshot, collection, query, orderBy, updateDoc, Timestamp, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Presentation, Slide } from "@/types/uw-interact";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, X, Users, Activity } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LiveSlideRenderer } from "@/components/presenter/LiveSlideRenderer";

export default function PresenterLivePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [presentation, setPresentation] = useState<Presentation | null>(null);
    const [slides, setSlides] = useState<Slide[]>([]);
    const [activeSlideIndex, setActiveSlideIndex] = useState<number>(-1);
    const [loading, setLoading] = useState(true);
    const [responseCount, setResponseCount] = useState(0);
    const [confusionCount, setConfusionCount] = useState(0);
    const [floatingReactions, setFloatingReactions] = useState<{ id: number; label: string }[]>([]);
    const [audienceCount, setAudienceCount] = useState(0);

    // Fetch Presentation & Slides
    useEffect(() => {
        const unsubPres = onSnapshot(doc(db, "presentations", id), (docSnap) => {
            if (docSnap.exists()) {
                setPresentation({ id: docSnap.id, ...docSnap.data() } as Presentation);
            }
        });

        const q = query(collection(db, "presentations", id, "slides"), orderBy("order", "asc"));
        const unsubSlides = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Slide[];
            setSlides(data);
            setLoading(false);
        });

        return () => {
            unsubPres();
            unsubSlides();
        };
    }, [id]);

    // Sync local index with activeSlideId
    useEffect(() => {
        if (presentation?.activeSlideId && slides.length > 0) {
            const index = slides.findIndex(s => s.id === presentation.activeSlideId);
            if (index !== -1) setActiveSlideIndex(index);
        } else if (!presentation?.activeSlideId && slides.length > 0) {
            // If no active slide, maybe start at 0? Or waiting screen.
            setActiveSlideIndex(-1);
        }
    }, [presentation?.activeSlideId, slides]);

    // Listen for reactions (for floating emojis + confusion count)
    useEffect(() => {
        const reactionsRef = collection(db, "presentations", id, "reactions");
        const unsub = onSnapshot(reactionsRef, (snapshot) => {
            // Count confusion (thinking/lost reactions)
            let confusion = 0;
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                if (data.type === 'thinking' || data.type === 'lost') {
                    confusion++;
                }
            });
            const total = snapshot.docs.length;
            setConfusionCount(total > 0 ? Math.round((confusion / total) * 100) : 0);
        });

        return () => unsub();
    }, [id]);

    // Listen for new reactions (for floating animation)
    useEffect(() => {
        const reactionsRef = collection(db, "presentations", id, "reactions");
        const q = query(reactionsRef, orderBy("createdAt", "desc"));
        let lastDocId: string | null = null;

        const unsub = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added' && change.doc.id !== lastDocId) {
                    lastDocId = change.doc.id;
                    const data = change.doc.data();
                    const reactionLabels: Record<string, string> = {
                        'heart': '❤️', 'thumbs_up': '👍', 'fire': '🔥',
                        'laugh': '😂', 'thinking': '🤔', 'lost': '✋'
                    };
                    const label = reactionLabels[data.type] || '❤️';
                    const newReaction = { id: Date.now() + Math.random(), label };
                    setFloatingReactions(prev => [...prev, newReaction]);
                    // Remove after animation
                    setTimeout(() => {
                        setFloatingReactions(prev => prev.filter(r => r.id !== newReaction.id));
                    }, 2000);
                }
            });
        });

        return () => unsub();
    }, [id]);

    // Listen for responses on active slide
    useEffect(() => {
        if (!presentation?.activeSlideId || !presentation?.currentSessionId) {
            setResponseCount(0);
            return;
        }

        const responsesRef = collection(
            db,
            "presentations", id,
            "liveSessions", presentation.currentSessionId,
            "slides", presentation.activeSlideId,
            "responses"
        );
        const unsub = onSnapshot(responsesRef, (snapshot) => {
            setResponseCount(snapshot.docs.length);
        });

        return () => unsub();
    }, [id, presentation?.activeSlideId, presentation?.currentSessionId]);

    // Listen for active sessions (audience count)
    useEffect(() => {
        const sessionsRef = collection(db, "presentations", id, "sessions");
        const unsub = onSnapshot(sessionsRef, (snapshot) => {
            // Count active sessions (last active within 2 minutes)
            const now = Date.now();
            const activeCount = snapshot.docs.filter(doc => {
                const data = doc.data();
                const lastActive = data.lastActiveAt?.seconds ? data.lastActiveAt.seconds * 1000 : 0;
                return (now - lastActive) < 120000; // Active within 2 minutes
            }).length;
            setAudienceCount(activeCount || snapshot.docs.length);
        });

        return () => unsub();
    }, [id]);

    const handleSlideChange = async (newIndex: number) => {
        if (newIndex < 0 || newIndex >= slides.length) return;

        const nextSlide = slides[newIndex];
        await updateDoc(doc(db, "presentations", id), {
            activeSlideId: nextSlide.id,
            updatedAt: Timestamp.now() // Use timestamp for freshness
        });
    };

    const handleEndSession = async () => {
        if (confirm("End this session? Audience will see the 'Ended' screen.")) {
            // Update current session end time if exists
            if (presentation?.currentSessionId) {
                await updateDoc(doc(db, "presentations", id, "liveSessions", presentation.currentSessionId), {
                    endedAt: serverTimestamp(),
                    participantCount: audienceCount
                });
            }
            await updateDoc(doc(db, "presentations", id), {
                status: "ended",
                activeSlideId: null
            });
            router.push("/admin/presenter");
        }
    };

    const handleStartSession = async () => {
        if (slides.length > 0) {
            // Create new live session
            const sessionRef = await addDoc(collection(db, "presentations", id, "liveSessions"), {
                presentationId: id,
                startedAt: serverTimestamp(),
                endedAt: null,
                participantCount: 0
            });

            await updateDoc(doc(db, "presentations", id), {
                status: "live",
                activeSlideId: slides[0].id,
                currentSessionId: sessionRef.id
            });
        }
    };

    const activeSlide = activeSlideIndex !== -1 ? slides[activeSlideIndex] : null;

    if (loading) return <div className="bg-black text-white h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="flex h-screen flex-col bg-black text-white overflow-hidden">
            {/* Header */}
            <header className="flex h-16 items-center justify-between border-b border-white/10 px-6 shrink-0 bg-zinc-900">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-mono font-bold truncate max-w-[300px]">{presentation?.title}</h1>
                    <div className="flex items-center gap-2 text-sm text-zinc-400 bg-zinc-800 px-3 py-1 rounded-full">
                        <Users size={14} /> {audienceCount}
                        <span className="w-px h-3 bg-zinc-600 mx-1"></span>
                        <div className="flex items-center gap-1 text-green-400">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Live
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2 text-zinc-400 mr-4">
                        Code: <span className="text-white font-mono text-xl tracking-widest">{presentation?.accessCode}</span>
                    </div>
                    <Button variant="destructive" size="sm" onClick={handleEndSession}>
                        <X className="mr-2 h-4 w-4" /> End
                    </Button>
                </div>
            </header>

            {/* Main Area */}
            <main className="flex-1 flex items-center justify-center p-8 relative">
                {/* Floating Reactions Display */}
                <div className="absolute top-4 right-4 pointer-events-none z-10">
                    {floatingReactions.map((r) => (
                        <div
                            key={r.id}
                            className="text-4xl animate-bounce"
                            style={{
                                animation: 'floatUp 2s ease-out forwards',
                            }}
                        >
                            {r.label}
                        </div>
                    ))}
                </div>

                {/* Live Preview / Stats placeholder */}
                <div className="w-full max-w-4xl flex flex-col items-center">
                    {activeSlide ? (
                        <>
                            <div className="w-full aspect-video bg-white text-black rounded-lg flex items-center justify-center p-8 shadow-2xl relative overflow-hidden">
                                <LiveSlideRenderer slide={activeSlide} />
                            </div>

                            <div className="mt-8 flex gap-8 w-full">
                                <div className="flex-1 bg-zinc-900 border border-white/10 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-zinc-400 mb-2">
                                        <Activity size={16} /> Responses
                                    </div>
                                    <div className="text-3xl font-bold">{responseCount}</div>
                                </div>
                                <div className="flex-1 bg-zinc-900 border border-white/10 rounded-lg p-4">
                                    <div className="flex items-center gap-2 text-zinc-400 mb-2">
                                        🤔 Confusion
                                    </div>
                                    <div className={`text-3xl font-bold ${confusionCount > 30 ? 'text-red-500' : 'text-green-500'}`}>{confusionCount}%</div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center">
                            <h2 className="text-3xl font-bold mb-4">Presentation Ready</h2>
                            <Button size="lg" onClick={handleStartSession} className="bg-blue-600 hover:bg-blue-500">
                                <Activity className="mr-2 h-5 w-5" /> Start Presenting
                            </Button>
                        </div>
                    )}
                </div>
            </main>

            {/* Footer / Controls */}
            <footer className="h-24 border-t border-white/10 flex items-center justify-between px-6 bg-zinc-900 shrink-0">
                <div className="flex items-center gap-4 w-1/3">
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => handleSlideChange(activeSlideIndex - 1)}
                        disabled={activeSlideIndex <= 0}
                    >
                        <ArrowLeft className="mr-2 h-5 w-5" /> Prev
                    </Button>
                </div>

                <div className="flex flex-col items-center justify-center w-1/3">
                    <span className="text-sm text-zinc-400 mb-1">
                        Slide {activeSlideIndex + 1} of {slides.length}
                    </span>
                    <div className="flex gap-1">
                        {slides.map((s, i) => (
                            <div
                                key={s.id}
                                className={`w-2 h-2 rounded-full transition-colors ${i === activeSlideIndex ? 'bg-blue-500' : 'bg-zinc-700'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4 w-1/3">
                    <Button
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-500 text-white px-8"
                        onClick={() => handleSlideChange(activeSlideIndex + 1)}
                        disabled={activeSlideIndex >= slides.length - 1}
                    >
                        Next <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </footer>
        </div>
    );
}
