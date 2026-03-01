"use client";

import { useState, useEffect } from "react";
import { addReaction } from "@/lib/actions";

export function ReactionWidget() {
    const [hasClapped, setHasClapped] = useState(false);
    const [hasHighFived, setHasHighFived] = useState(false);
    const [animatingClap, setAnimatingClap] = useState(false);
    const [animatingHighFive, setAnimatingHighFive] = useState(false);

    useEffect(() => {
        // Load state from local storage to prevent spamming
        const clapped = localStorage.getItem("site_reaction_clap") === "true";
        const highFived = localStorage.getItem("site_reaction_highfive") === "true";
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (clapped) setHasClapped(true);
         
        if (highFived) setHasHighFived(true);
    }, []);

    const handleClap = async () => {
        if (hasClapped) return;
        setAnimatingClap(true);
        setHasClapped(true);
        localStorage.setItem("site_reaction_clap", "true");
        // Remove animation class after a short delay
        setTimeout(() => setAnimatingClap(false), 500);

        await addReaction('claps');
    };

    const handleHighFive = async () => {
        if (hasHighFived) return;
        setAnimatingHighFive(true);
        setHasHighFived(true);
        localStorage.setItem("site_reaction_highfive", "true");
        // Remove animation class after a short delay
        setTimeout(() => setAnimatingHighFive(false), 500);

        await addReaction('highFives');
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-16 bg-surface-light dark:bg-surface-dark rounded-full shadow-sm border border-gray-100 dark:border-gray-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 px-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center shrink-0">
                    <span className="material-icons-round text-primary text-2xl">sentiment_satisfied_alt</span>
                </div>
                <div>
                    <h3 className="text-gray-900 dark:text-white font-bold text-lg">Like what you see?</h3>
                    <p className="text-muted-light dark:text-muted-dark text-sm">Give a quick high-five or clap!</p>
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                <button
                    onClick={handleClap}
                    disabled={hasClapped}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl border font-semibold text-sm transition-all duration-300 ${hasClapped
                        ? 'bg-orange-50 dark:bg-orange-900/20 border-primary/20 text-primary cursor-default'
                        : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                        } ${animatingClap ? 'scale-110' : ''}`}
                >
                    <span className="text-xl">👏</span>
                    <span>{hasClapped ? 'Clapped!' : 'Quick Clap'}</span>
                </button>

                <button
                    onClick={handleHighFive}
                    disabled={hasHighFived}
                    className={`flex items-center gap-2 px-5 py-3 rounded-2xl border font-semibold text-sm transition-all duration-300 ${hasHighFived
                        ? 'bg-orange-50 dark:bg-orange-900/20 border-primary/20 text-primary cursor-default'
                        : 'bg-white dark:bg-surface-dark border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
                        } ${animatingHighFive ? 'scale-110 -rotate-12' : ''}`}
                >
                    <span className="text-xl">✋</span>
                    <span>{hasHighFived ? 'High Fived!' : 'High Five'}</span>
                </button>
            </div>
        </div>
    );
}
