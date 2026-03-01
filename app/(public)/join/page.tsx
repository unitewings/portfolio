"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function JoinPage() {
    const [code, setCode] = useState("");
    const router = useRouter();

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (code.length === 6) {
            router.push(`/live/${code}`);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-md space-y-8 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight">Join Presentation</h1>
                <form onSubmit={handleJoin} className="space-y-4">
                    <Input
                        placeholder="Enter 6-digit code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        maxLength={6}
                        className="text-center text-2xl tracking-widest h-14"
                    />
                    <Button type="submit" size="lg" className="w-full" disabled={code.length !== 6}>
                        Enter
                    </Button>
                </form>
            </div>
        </div>
    );
}
