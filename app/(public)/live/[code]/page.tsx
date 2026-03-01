"use client";

import { use, useState, useEffect, useRef } from "react";
import { usePresentationSync } from "@/hooks/use-presentation-sync";
import { Loader2 } from "lucide-react";
import { ActiveSlideRenderer } from "@/components/audience/ActiveSlideRenderer";
import ReactionDock from "@/components/audience/ReactionDock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AudienceLivePage({ params }: { params: Promise<{ code: string }> }) {
    const { code } = use(params);
    const { presentation, activeSlide, loading, error } = usePresentationSync(code);
    const [userName, setUserName] = useState<string>("");
    const [hasJoined, setHasJoined] = useState(false);

    // Check localStorage for saved name on mount, use a ref to prevent loops
    const initialCheckRef = useRef(false);
    useEffect(() => {
        if (initialCheckRef.current) return;
        initialCheckRef.current = true;

        const savedName = localStorage.getItem(`uw-interact-name-${code}`);
        // Combine state updates correctly or defer them safely if needed,
        // but since this is initial mount only, we can set state once safely
        if (savedName) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setUserName(savedName);
             
            setHasJoined(true);
        }
    }, [code]);

    // Auto-join if anonymous is allowed and no name required
    const autoJoinRef = useRef(false);
    useEffect(() => {
        if (presentation && !presentation.config?.requireName && !hasJoined && !autoJoinRef.current) {
            autoJoinRef.current = true;
            // Use setTimeout to avoid synchronous state update in effect
            setTimeout(() => {
                setHasJoined(true);
            }, 0);
        }
    }, [presentation, hasJoined]);

    // Create/update session when audience joins (for live counter)
    useEffect(() => {
        if (!hasJoined || !presentation) return;

        const sessionId = localStorage.getItem(`uw-interact-session-${code}`) ||
            `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;

        // Save session ID for reuse
        localStorage.setItem(`uw-interact-session-${code}`, sessionId);

        const sessionRef = doc(db, "presentations", presentation.id, "sessions", sessionId);

        // Create/update session
        const updateSession = async () => {
            await setDoc(sessionRef, {
                name: userName || "Anonymous",
                joinedAt: serverTimestamp(),
                lastActiveAt: serverTimestamp(),
                status: "active"
            }, { merge: true });
        };

        updateSession();

        // Update lastActiveAt every 30 seconds
        const interval = setInterval(async () => {
            await setDoc(sessionRef, {
                lastActiveAt: serverTimestamp()
            }, { merge: true });
        }, 30000);

        return () => clearInterval(interval);
    }, [hasJoined, presentation, code, userName]);

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (userName.trim()) {
            localStorage.setItem(`uw-interact-name-${code}`, userName.trim());
            setHasJoined(true);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="ml-4 text-muted-foreground">Connecting...</p>
            </div>
        );
    }

    if (error || !presentation) {
        return (
            <div className="flex h-screen items-center justify-center bg-background px-4 text-center">
                <div>
                    <h1 className="text-2xl font-bold text-destructive">Connection Failed</h1>
                    <p className="mt-2 text-muted-foreground">{error || "Presentation not found"}</p>
                </div>
            </div>
        );
    }

    // Show name collection form if requireName is enabled and user hasn't joined
    if (presentation.config?.requireName && !hasJoined) {
        return (
            <div className="flex h-screen items-center justify-center bg-background px-4">
                <div className="w-full max-w-md space-y-6 text-center">
                    <div>
                        <h1 className="text-2xl font-bold">{presentation.title}</h1>
                        <p className="text-muted-foreground mt-2">Enter your name to join</p>
                    </div>
                    <form onSubmit={handleJoin} className="space-y-4">
                        <div className="space-y-2 text-left">
                            <Label htmlFor="name">Your Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter your name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="h-12 text-lg"
                                autoFocus
                            />
                        </div>
                        <Button
                            type="submit"
                            size="lg"
                            className="w-full"
                            disabled={!userName.trim()}
                        >
                            Join Presentation
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen bg-background p-2 flex flex-col overflow-hidden" style={{
            "--accent-color": presentation.config?.accentColor || "#2563EB"
        } as React.CSSProperties}>
            <header className="flex h-10 items-center justify-between shrink-0">
                <div className="font-bold text-sm truncate">{presentation.title}</div>
                <div className="flex items-center gap-2">
                    {userName && <span className="text-xs text-muted-foreground">Hi, {userName}</span>}
                    <span className="text-xs text-green-500 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        Live
                    </span>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center min-h-0">
                {!activeSlide ? (
                    <div className="text-center animate-pulse">
                        <h2 className="text-lg font-medium">Wait for presenter...</h2>
                        <p className="text-xs text-muted-foreground">The slide will appear here instantly.</p>
                    </div>
                ) : (
                    <div className="w-full max-w-lg px-2">
                        <ActiveSlideRenderer
                            slide={activeSlide}
                            presentationId={presentation.id}
                            sessionId={presentation.currentSessionId || undefined}
                        />
                    </div>
                )}
            </main>

            <div className="h-14 border-t shrink-0 flex items-center justify-center gap-4">
                <ReactionDock presentationId={presentation.id} />
            </div>
        </div>
    );
}
