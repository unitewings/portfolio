"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const REACTIONS = [
    { type: 'heart', label: '❤️' },
    { type: 'thumbs_up', label: '👍' },
    { type: 'fire', label: '🔥' },
    { type: 'laugh', label: '😂' },
    { type: 'thinking', label: '🤔' },
    { type: 'lost', label: '✋', className: "bg-red-100 dark:bg-red-900 border-red-500" }
];

interface ReactionDockProps {
    presentationId: string;
}

export default function ReactionDock({ presentationId }: ReactionDockProps) {
    const [clicks, setClicks] = useState<{ id: number, label: string, x: number }[]>([]);

    const handleReaction = async (type: string, label: string, e: React.MouseEvent) => {
        // Optimistic UI: Float up
        // eslint-disable-next-line react-hooks/purity
        const id = Date.now();
         
        setClicks(prev => [...prev, { id, label, x: Math.random() * 20 - 10 }]); // Random jitter

        // Clean up animation after 1s
        setTimeout(() => {
            setClicks(prev => prev.filter(c => c.id !== id));
        }, 1500);

        // Send to Firestore (fire & forget)
        try {
            // Rate limiting could go here (e.g. max 5 per second)
            await addDoc(collection(db, "presentations", presentationId, "reactions"), {
                type,
                createdAt: serverTimestamp()
            });
        } catch (err) {
            console.error("Failed to send reaction", err);
        }
    };

    return (
        <div className="relative w-full max-w-md mx-auto">
            {/* Floating Particles Area */}
            <div className="absolute bottom-16 left-0 right-0 h-64 pointer-events-none overflow-visible">
                <AnimatePresence>
                    {clicks.map((click) => (
                        <motion.div
                            key={click.id}
                            initial={{ opacity: 1, y: 0, x: click.x }}
                            animate={{ opacity: 0, y: -200 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="absolute bottom-0 text-2xl left-1/2"
                            style={{ marginLeft: `${click.x}px` }}
                        >
                            {click.label}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Dock */}
            <div className="flex items-center justify-center gap-2 p-2 bg-background/80 backdrop-blur-md rounded-full border shadow-lg">
                {REACTIONS.map((r) => (
                    <Button
                        key={r.type}
                        variant="ghost"
                        size="icon"
                        className={`rounded-full hover:scale-110 transition-transform ${r.className || ""}`}
                        onClick={(e) => handleReaction(r.type, r.label, e)}
                    >
                        <span className="text-xl">{r.label}</span>
                    </Button>
                ))}
            </div>
        </div>
    );
}
