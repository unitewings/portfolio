"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyPageEmailAccess } from "@/lib/actions";
import { Button } from "@/components/shared/ui/button";
import { Mail, User } from "lucide-react";

interface PagePasswordProtectionProps {
    pageId: string;
    hintLink?: string;
}

export function PagePasswordProtection({ pageId, hintLink }: PagePasswordProtectionProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await verifyPageEmailAccess(pageId, name, email);
            if (result.success) {
                router.refresh();
            } else {
                setError(result.message || "Failed to verify access");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
            <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl border shadow-sm text-center">
                <div className="mx-auto bg-muted p-4 rounded-full w-fit">
                    <Mail className="h-8 w-8 text-muted-foreground" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">Email Required</h1>
                    <p className="text-muted-foreground text-sm">
                        This collection requires your email to download or view. Please provide your details below.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-3">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <User className="h-4 w-4" />
                            </span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Full Name"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                <Mail className="h-4 w-4" />
                            </span>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email Address"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Unlocking..." : "Unlock Page"}
                    </Button>
                </form>

                {hintLink && (
                    <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground">
                            Don&apos;t have a password?{" "}
                            <a
                                href={hintLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-primary hover:underline underline-offset-4"
                            >
                                Get it here
                            </a>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
