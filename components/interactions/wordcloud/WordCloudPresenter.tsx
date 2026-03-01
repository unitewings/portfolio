"use client";

import { useEffect, useState, useMemo } from "react";
import { Slide, Response } from "@/types/uw-interact";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface WordCloudPresenterProps {
    slide: Slide;
}

export function WordCloudPresenter({ slide }: WordCloudPresenterProps) {
    const [words, setWords] = useState<{ text: string, count: number }[]>([]);

    useEffect(() => {
        const q = query(
            collection(db, "responses"),
            where("slideId", "==", slide.id)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const responses = snapshot.docs.map(doc => doc.data()) as Response[];

            // Normalize and count
            const counts: Record<string, number> = {};
            responses.forEach(r => {
                if (r.data.text) {
                    const normalized = r.data.text.toLowerCase().trim();
                    if (normalized) {
                        counts[normalized] = (counts[normalized] || 0) + 1;
                    }
                }
            });

            // Sort by count
            const sortedWords = Object.entries(counts)
                .map(([text, count]) => ({ text, count }))
                .sort((a, b) => b.count - a.count);

            setWords(sortedWords);
        });

        return () => unsubscribe();
    }, [slide.id]);

    const maxCount = words.length > 0 ? words[0].count : 1;

    const wordItems = useMemo(() => {
        return words.map((word: any) => {
            let hash = 0;
            for (let i = 0; i < word.text.length; i++) {
                hash = word.text.charCodeAt(i) + ((hash << 5) - hash);
            }
            const hue = Math.abs(hash % 360);
            return {
                ...word,
                color: `hsl(${hue}, 70%, 70%)`
            };
        });
    }, [words]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 overflow-hidden">
            <h2 className="text-4xl font-bold mb-8 text-center text-white shadow-sm">{slide.content.question}</h2>

            <div className="w-full h-full flex flex-wrap items-center justify-center content-center gap-4 max-w-5xl">
                {wordItems.map((word: any) => {
                    // Simple sizing logic based on frequency
                    const size = 1 + (word.count / maxCount) * 4; // Scale 1rem to 5rem
                    return (
                        <span
                            key={word.text}
                            className="font-bold transition-all duration-500 ease-out hover:scale-110"
                            style={{
                                fontSize: `${size}rem`,
                                color: word.color // Pre-calculated assigned random color
                            }}
                        >
                            {word.text}
                        </span>
                    );
                })}
                {words.length === 0 && (
                    <div className="text-muted-foreground text-xl animate-pulse">Waiting for responses...</div>
                )}
            </div>

            <div className="mt-8 text-xl font-mono text-muted-foreground">
                Total Responses: {words.reduce((acc, curr) => acc + curr.count, 0)}
            </div>
        </div>
    );
}
