"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyPagePassword } from "@/lib/actions";
import { Button } from "@/components/shared/ui/button";
import { Lock } from "lucide-react";

interface PagePasswordProtectionProps {
    pageId: string;
    hintLink?: string;
}

export function PagePasswordProtection({ pageId, hintLink }: PagePasswordProtectionProps) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await verifyPagePassword(pageId, password);
            if (result.success) {
                router.refresh();
            } else {
                setError(result.message || "Incorrect password");
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
                    <Lock className="h-8 w-8 text-muted-foreground" />
                </div>

                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">Protected Page</h1>
                    <p className="text-muted-foreground">
                        This collection is password protected. Enter the password to view.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
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
