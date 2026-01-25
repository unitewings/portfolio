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
                <div className="relative bg-primary/5 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl overflow-hidden">
                    <div className="absolute right-2 top-2 z-10">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="rounded-full p-1 hover:bg-muted transition-colors"
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
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
