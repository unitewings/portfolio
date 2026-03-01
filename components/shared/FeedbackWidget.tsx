"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Smile } from "lucide-react";

export function FeedbackWidget() {
    const [isAnimatingClap, setIsAnimatingClap] = useState(false);
    const [isAnimatingHighFive, setIsAnimatingHighFive] = useState(false);

    const handleClap = () => {
        setIsAnimatingClap(true);
        toast.success("Thanks for the clap! 👏");
        setTimeout(() => setIsAnimatingClap(false), 1000);
    };

    const handleHighFive = () => {
        setIsAnimatingHighFive(true);
        toast.success("High five received! 🙌");
        setTimeout(() => setIsAnimatingHighFive(false), 1000);
    };

    return (
        <div className="w-full max-w-4xl mx-auto my-12 px-4">
            <div className="bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-700 shadow-sm rounded-[3rem] p-4 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">

                {/* Left Side: Icon and Text */}
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 text-primary flex items-center justify-center">
                        <Smile size={24} className="opacity-80" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white pb-0.5">
                            Like what you see?
                        </h3>
                        <p className="text-sm text-muted-light dark:text-muted-dark">
                            Give a quick high-five or clap!
                        </p>
                    </div>
                </div>

                {/* Right Side: Action Buttons */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={handleClap}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-primary hover:text-primary transition-all group ${isAnimatingClap ? 'scale-95 bg-orange-50 dark:bg-orange-900/20' : ''}`}
                    >
                        <span className={`text-xl transition-transform ${isAnimatingClap ? 'animate-bounce' : 'group-hover:scale-110'}`}>👏</span>
                        <span className="text-sm font-semibold whitespace-nowrap">Quick Clap</span>
                    </button>

                    <button
                        onClick={handleHighFive}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-primary hover:text-primary transition-all group ${isAnimatingHighFive ? 'scale-95 bg-orange-50 dark:bg-orange-900/20' : ''}`}
                    >
                        <span className={`text-xl transition-transform ${isAnimatingHighFive ? 'animate-bounce' : 'group-hover:scale-110'}`}>🙌</span>
                        <span className="text-sm font-semibold whitespace-nowrap">High Five</span>
                    </button>
                </div>

            </div>
        </div>
    );
}
