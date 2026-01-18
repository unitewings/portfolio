"use client";

import { useTransition, useState } from "react";
import { subscribe } from "@/lib/actions";
import { Button } from "@/components/shared/ui/button";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export function NewsletterForm({ title, description }: { title: string; description: string }) {
    const [isPending, startTransition] = useTransition();
    const [subbed, setSubbed] = useState(false);

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await subscribe(formData);
            if (result.success) {
                toast.success(result.message);
                setSubbed(true);
            } else {
                toast.error(result.message);
            }
        });
    };

    if (subbed) {
        return (
            <div className="space-y-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                <div className="flex items-center gap-2 text-green-600">
                    <Mail className="h-5 w-5" />
                    <h3 className="font-semibold">{title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                    Thanks for subscribing! Check your inbox soon.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
                {description}
            </p>
            <form action={handleSubmit} className="flex flex-col gap-2">
                <input
                    name="name"
                    type="text"
                    required
                    placeholder="Your Name"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email address"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number (Optional)"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full"
                >
                    {isPending ? "Subscribing..." : "Subscribe"}
                </Button>
            </form>
        </div>
    );
}
