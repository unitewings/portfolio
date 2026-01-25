"use client";

import { useTransition, useState } from "react";
import { subscribe } from "@/lib/actions";
import { Button } from "@/components/shared/ui/button";
import { toast } from "sonner";
import { Mail, Loader2 } from "lucide-react";
import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";

export function NewsletterForm({ title, description, onSuccess }: { title: string; description: string; onSuccess?: () => void }) {
    const [isPending, startTransition] = useTransition();
    const [subbed, setSubbed] = useState(false);

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await subscribe(formData);
            if (result.success) {
                toast.success(result.message);
                setSubbed(true);
                if (onSuccess) onSuccess();
            } else {
                toast.error(result.message);
            }
        });
    };

    if (subbed) {
        return (
            <div className="space-y-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm animate-in fade-in zoom-in duration-300">
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
        <div className="space-y-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm hover-lift transition-all duration-200">
            <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">
                {description}
            </p>
            <form action={handleSubmit} className="flex flex-col gap-2">
                <FloatingLabelInput
                    name="name"
                    type="text"
                    required
                    label="Your Name"
                />
                <FloatingLabelInput
                    name="email"
                    type="email"
                    required
                    label="Email address"
                />
                <FloatingLabelInput
                    name="phone"
                    type="tel"
                    label="Phone Number (Optional)"
                />
                <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full"
                >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
                </Button>
            </form>
        </div>
    );
}
