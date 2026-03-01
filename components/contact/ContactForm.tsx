"use client";

import { useTransition, useState } from "react";
import { submitContactForm } from "@/lib/actions";
import { Button } from "@/components/shared/ui/button";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";
import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";
import { FloatingLabelTextarea } from "@/components/ui/FloatingLabelTextarea";

export function ContactForm() {
    const [isPending, startTransition] = useTransition();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await submitContactForm(formData);
            if (result.success) {
                toast.success(result.message);
                setSubmitted(true);
            } else {
                toast.error(result.message);
            }
        });
    };

    if (submitted) {
        return (
            <div className="rounded-lg border bg-card p-8 text-center animate-in fade-in zoom-in">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <Send className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Message Sent!</h3>
                <p className="text-muted-foreground">
                    Thanks for reaching out. I&apos;ll get back to you properly.
                </p>
                <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
                    Send another message
                </Button>
            </div>
        );
    }

    return (
        <form action={handleSubmit} className="flex flex-col space-y-5 h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="firstName">Name</label>
                    <input
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        id="firstName"
                        name="firstName"
                        placeholder="Your Name"
                        type="text"
                        required
                    />
                </div>
                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="email">Email</label>
                    <input
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        id="email"
                        name="email"
                        placeholder="hello@example.com"
                        type="email"
                        required
                    />
                </div>
            </div>

            {/* hidden fields needed for action compatibility */}
            <input type="hidden" name="lastName" value="(Provided via Name field)" />
            <input type="hidden" name="phone" value="" />

            <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="category">Subject</label>
                <input
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    id="category"
                    name="category"
                    placeholder="Project Discussion"
                    type="text"
                    required
                />
            </div>

            <div className="flex flex-col space-y-2 flex-grow">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="message">Message</label>
                <textarea
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-h-[160px] resize-none"
                    id="message"
                    name="message"
                    placeholder="Tell me about your project..."
                    required
                ></textarea>
            </div>

            <button
                disabled={isPending}
                className="bg-primary hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center mt-4 group disabled:opacity-50"
                type="submit"
            >
                {isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : "Send Message"}
                {!isPending && <span className="material-icons-round ml-2 group-hover:translate-x-1 transition-transform">send</span>}
            </button>
        </form>
    );
}
