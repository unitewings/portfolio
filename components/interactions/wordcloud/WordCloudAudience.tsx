"use client";

import { useState } from "react";
import { Slide } from "@/types/uw-interact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, CheckCircle2 } from "lucide-react";

interface WordCloudAudienceProps {
    slide: Slide;
    participantId: string;
    presentationId?: string;
    sessionId?: string;
}

export function WordCloudAudience({ slide, participantId, presentationId, sessionId }: WordCloudAudienceProps) {
    const [text, setText] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim() || submitting) return;

        setSubmitting(true);
        try {
            const pId = presentationId || slide.presentationId;

            // Store response under session if available, otherwise use legacy path
            const responsePath = sessionId
                ? collection(db, "presentations", pId, "liveSessions", sessionId, "slides", slide.id, "responses")
                : collection(db, "presentations", pId, "slides", slide.id, "responses");

            await addDoc(responsePath, {
                presentationId: pId,
                slideId: slide.id,
                sessionId: sessionId || null,
                participantId,
                data: { text: text.trim().slice(0, 30) },
                createdAt: serverTimestamp()
            });
            setSubmitted(true);
            setText("");
        } catch (err) {
            console.error("Error submitting word:", err);
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="text-center space-y-3 animate-in fade-in zoom-in duration-300">
                <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto" />
                <h3 className="text-lg font-bold">Word Sent!</h3>
                <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                    Send Another
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-3 w-full max-w-md mx-auto">
            <div className="text-center">
                <h2 className="text-lg font-bold mb-1">{slide.content.question}</h2>
                <p className="text-xs text-muted-foreground">Enter a word (max 30 chars)</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    maxLength={30}
                    placeholder="Type your answer..."
                    className="text-center text-lg h-12"
                    autoFocus
                />
                <Button type="submit" size="lg" className="w-full" disabled={!text.trim() || submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit
                </Button>
            </form>
        </div>
    );
}
