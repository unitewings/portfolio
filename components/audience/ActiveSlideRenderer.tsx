"use client";

import { useMemo, useState } from "react";
import { Slide } from "@/types/uw-interact";
import { MCQAudience } from "@/components/interactions/mcq/MCQAudience";
import { WordCloudAudience } from "@/components/interactions/wordcloud/WordCloudAudience";

interface ActiveSlideRendererProps {
    slide: Slide;
    presentationId?: string;
    sessionId?: string;
}

export function ActiveSlideRenderer({ slide, presentationId, sessionId }: ActiveSlideRendererProps) {
    const [participantId] = useState(() => {
        if (typeof window === "undefined") return "anon";
        const stored = localStorage.getItem("uw-interact-participant-id");
        if (stored) return stored;
        const newId = `p-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        localStorage.setItem("uw-interact-participant-id", newId);
        return newId;
    });

    switch (slide.type) {
        case "heading":
            return (
                <div className="text-center">
                    <h1 className="text-2xl md:text-4xl font-extrabold mb-2">{slide.content.question}</h1>
                    {slide.content.subtext && (
                        <p className="text-sm md:text-lg text-muted-foreground">{slide.content.subtext}</p>
                    )}
                </div>
            );
        case "mcq":
            return (
                <MCQAudience
                    slide={slide}
                    participantId={participantId}
                    presentationId={presentationId}
                    sessionId={sessionId}
                />
            );
        case "wordcloud":
            return (
                <WordCloudAudience
                    slide={slide}
                    participantId={participantId}
                    presentationId={presentationId}
                    sessionId={sessionId}
                />
            );
        default:
            return (
                <div className="text-center p-4 border rounded-lg bg-muted/20">
                    <h3 className="font-bold text-base mb-1">Unsupported Slide Type</h3>
                    <p className="text-sm text-muted-foreground">Type: {slide.type}</p>
                </div>
            );
    }
}
