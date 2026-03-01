"use client";

import { useState } from "react";
import { Slide } from "@/types/uw-interact";
import { Button } from "@/components/ui/button";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2, CheckCircle2 } from "lucide-react";

interface MCQAudienceProps {
    slide: Slide;
    participantId: string;
    presentationId?: string;
    sessionId?: string;
}

export function MCQAudience({ slide, participantId, presentationId, sessionId }: MCQAudienceProps) {
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleVote = async (optionId: string) => {
        if (submitting || submitted) return;

        setSelectedOptionId(optionId);
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
                data: { optionId },
                createdAt: serverTimestamp()
            });
            setSubmitted(true);
        } catch (err) {
            console.error("Error submitting vote:", err);
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="text-center space-y-2 animate-in fade-in zoom-in duration-300">
                <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto" />
                <h3 className="text-lg font-bold">Vote Submitted!</h3>
                <p className="text-xs text-muted-foreground">Waiting for presenter...</p>
                <div className="mt-3">
                    <div className="p-2 bg-muted/30 rounded-lg border inline-block text-sm">
                        You selected: <span className="font-semibold">{slide.content.options?.find(o => o.id === selectedOptionId)?.label}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-2 w-full">
            <h2 className="text-lg font-bold text-center mb-3">{slide.content.question}</h2>
            <div className="grid gap-2">
                {slide.content.options?.map(opt => (
                    <button
                        key={opt.id}
                        onClick={() => handleVote(opt.id)}
                        disabled={submitting}
                        className={`p-3 rounded-lg border-2 transition-all text-left font-medium text-base relative overflow-hidden
                            ${selectedOptionId === opt.id
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border hover:border-primary/50 bg-card hover:bg-accent'
                            }
                        `}
                    >
                        <span className="relative z-10">{opt.label}</span>
                        {selectedOptionId === opt.id && submitting && (
                            <div className="absolute inset-0 flex items-center justify-end pr-3">
                                <Loader2 className="animate-spin h-4 w-4 opacity-50" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
