"use client";

import { useTransition, useState } from "react";
import { submitContactForm } from "@/lib/actions";
import { Button } from "@/components/shared/ui/button";
import { toast } from "sonner";
import { Send } from "lucide-react";

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
                    Thanks for reaching out. I'll get back to you properly.
                </p>
                <Button variant="outline" className="mt-6" onClick={() => setSubmitted(false)}>
                    Send another message
                </Button>
            </div>
        );
    }

    return (
        <form action={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="firstName">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="firstName"
                        name="firstName"
                        required
                        placeholder="Your name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="lastName">
                        Last name <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="lastName"
                        name="lastName"
                        required
                        placeholder="Your last name"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="Your email address"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="phone">
                        Contact Number (Optional)
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="category">
                    Select the appropriate (Optional)
                </label>
                <select
                    id="category"
                    name="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="">Select an option...</option>
                    <option value="Student">Student</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Startup">Startup</option>
                    <option value="Mentor">Mentor</option>
                    <option value="College/Academia">College/Academia</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="message">
                    Message <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="message"
                    name="message"
                    required
                    placeholder="How can I help you?"
                    className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                />
            </div>

            <Button type="submit" disabled={isPending} size="lg" className="w-full sm:w-auto">
                {isPending ? "Sending..." : "Send Message"}
            </Button>
        </form>
    );
}
