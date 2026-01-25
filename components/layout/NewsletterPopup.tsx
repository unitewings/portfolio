"use client";

import { useEffect, useState } from "react";
import { NewsletterForm } from "./NewsletterForm";
import { Dialog, DialogContent, DialogTitle } from "@/components/shared/ui/dialog";
import { X } from "lucide-react";

interface NewsletterPopupProps {
    title: string;
    description: string;
}

export function NewsletterPopup({ title, description }: NewsletterPopupProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [hasChecked, setHasChecked] = useState(false);

    useEffect(() => {
        // Check if already subscribed
        const isSubscribed = localStorage.getItem("newsletter_subscribed");
        if (!isSubscribed) {
            // Show popup after delay
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 10000); // 10 seconds delay
            return () => clearTimeout(timer);
        }
        setHasChecked(true);
    }, []);

    const handleSuccess = () => {
        localStorage.setItem("newsletter_subscribed", "true");
        setTimeout(() => {
            setIsOpen(false);
        }, 1500); // Close shortly after success message
    };

    // Prevent hydration mismatch by not rendering until checked (though useEffect handles open state anyway)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px] p-0 border-none bg-transparent shadow-none">
                <div className="relative bg-background/60 backdrop-blur-xl border border-primary/20 rounded-lg shadow-2xl overflow-hidden ring-1 ring-primary/10">
                    <div className="absolute right-2 top-2 z-10">
                        <button
                            onClick={() => setIsOpen(false)}
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
