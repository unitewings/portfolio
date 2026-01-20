"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/ui/button";
import { toast } from "sonner";
import { setSessionCookie } from "@/lib/auth-actions"; // We will create this
import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();

            // Set cookie via Server Action
            await setSessionCookie(token);

            toast.success("Welcome back!");
            router.push("/admin");
        } catch (error: any) {
            console.error(error);
            toast.error("Invalid credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <div className="w-full max-w-sm space-y-6 rounded-lg border bg-card p-6 shadow-lg">
                <div className="space-y-2 text-center">
                    <h1 className="text-2xl font-bold">Admin Login</h1>
                    <p className="text-sm text-muted-foreground">Enter your credentials to access the dashboard.</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <FloatingLabelInput
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="Email"
                        />
                    </div>
                    <div className="space-y-2">
                        <FloatingLabelInput
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            label="Password"
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
