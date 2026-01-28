"use client";

import { useEffect, useState, useCallback } from "react";
import { NewsletterForm } from "./NewsletterForm";
import { Dialog, DialogContent, DialogTitle } from "@/components/shared/ui/dialog";
import { X } from "lucide-react";

interface NewsletterPopupProps {
    title: string;
    description: string;
}

const STORAGE_KEYS = {
    SUBSCRIBED: "newsletter_subscribed",
    POPUP_COUNT: "newsletter_popup_count",
    LAST_SHOWN: "newsletter_last_shown",
};

const MAX_POPUPS = 2; // Show max 2 times total
const FIRST_DELAY = 10000; // 10 seconds for first popup
const SECOND_DELAY = 5 * 60 * 1000; // 5 minutes for second popup

export function NewsletterPopup({ title, description }: NewsletterPopupProps) {
    const [isOpen, setIsOpen] = useState(false);

    const schedulePopup = useCallback((delay: number) => {
        const timer = setTimeout(() => {
            setIsOpen(true);
            // Update popup count and last shown time
            const currentCount = parseInt(localStorage.getItem(STORAGE_KEYS.POPUP_COUNT) || "0", 10);
            localStorage.setItem(STORAGE_KEYS.POPUP_COUNT, String(currentCount + 1));
            localStorage.setItem(STORAGE_KEYS.LAST_SHOWN, Date.now().toString());
        }, delay);
        return timer;
    }, []);

    useEffect(() => {
        // Check if already subscribed - never show again
        const isSubscribed = localStorage.getItem(STORAGE_KEYS.SUBSCRIBED);
        if (isSubscribed) {
            return;
        }

        const popupCount = parseInt(localStorage.getItem(STORAGE_KEYS.POPUP_COUNT) || "0", 10);
        const lastShown = parseInt(localStorage.getItem(STORAGE_KEYS.LAST_SHOWN) || "0", 10);
        const now = Date.now();

        // Already shown max times
        if (popupCount >= MAX_POPUPS) {
            return;
        }

        let timer: NodeJS.Timeout;

        if (popupCount === 0) {
            // First visit - show after 10 seconds
            timer = schedulePopup(FIRST_DELAY);
        } else if (popupCount === 1) {
            // Second time - check if 5 minutes have passed since last shown
            const timeSinceLastShown = now - lastShown;
            if (timeSinceLastShown >= SECOND_DELAY) {
                // Already 5+ minutes passed, show after 10 seconds
                timer = schedulePopup(FIRST_DELAY);
            } else {
                // Wait remaining time until 5 minutes total
                const remainingTime = SECOND_DELAY - timeSinceLastShown;
                timer = schedulePopup(remainingTime);
            }
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [schedulePopup]);

    const handleSuccess = () => {
        localStorage.setItem(STORAGE_KEYS.SUBSCRIBED, "true");
        setTimeout(() => {
            setIsOpen(false);
        }, 1500); // Close shortly after success message
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px] p-0 border-none bg-transparent shadow-none">
                <div className="relative bg-background/60 backdrop-blur-xl border border-primary/20 rounded-lg shadow-2xl overflow-hidden ring-1 ring-primary/10">
                    <div className="absolute right-2 top-2 z-10">
                        <button
                            onClick={handleClose}
                            className="rounded-full p-1 hover:bg-muted/50 transition-colors"
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                            <span className="sr-only">Close</span>
                        </button>
                    </div>

                    {/* Add a visually hidden title for accessibility required by DialogPrimitive */}
                    <DialogTitle className="sr-only">Subscribe to Newsletter</DialogTitle>

                    <NewsletterForm
                        title={title}
                        description={description}
                        onSuccess={handleSuccess}
                        variant="clean"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
