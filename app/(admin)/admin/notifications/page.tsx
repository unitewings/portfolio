"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Send, Smartphone, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [link, setLink] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [iconUrl, setIconUrl] = useState("");
    const [targetToken, setTargetToken] = useState("");
    const [isBroadcast, setIsBroadcast] = useState(false);

    // Optional: Fetch stats about subscribers if we had an API for it
    // const [subscriberCount, setSubscriberCount] = useState(0);

    const sendNotification = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !body) {
            toast.error("Please enter specific title and body");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/send-notification", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    body,
                    link,
                    imageUrl,
                    iconUrl,
                    targetToken: isBroadcast ? undefined : (targetToken || undefined),
                    broadcast: isBroadcast
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("Failed to send:", data);
                toast.error("Failed to send", { description: data.error || "Unknown Error" });
                return;
            }

            console.log("Success:", data);
            toast.success(data.message || "Notification Sent!", {
                description: isBroadcast ? "Broadcasted to all users" : "Sent to specific device"
            });

            // Clear form on success
            setTitle("");
            setBody("");
        } catch (error: any) {
            console.error("Catch Error:", error);
            const msg = error?.message || "Something went wrong";
            toast.error("Error Sending", { description: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Push Notifications</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
                    <Smartphone size={14} />
                    <span>FCM Enabled</span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Helper / Info Card */}
                <div className="space-y-6 order-2 md:order-1">
                    <div className="rounded-xl border bg-card p-6 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 rounded-full bg-primary/10 text-primary">
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold">Audience Limit</h3>
                                <p className="text-sm text-muted-foreground">Broadcast sends to all active tokens.</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Use this tool to engage with your users. High-quality, relevant notifications have the best engagement rates.
                            Avoid spamming as users can easily block notifications from their browser settings.
                        </p>
                    </div>
                </div>

                {/* Sending Form */}
                <div className="rounded-xl border bg-card p-6 shadow-sm order-1 md:order-2">
                    <form onSubmit={sendNotification} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Notification Title</label>
                            <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="e.g. New Post Published!"
                                value={title} onChange={e => setTitle(e.target.value)} required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Body</label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Brief description of the update..."
                                value={body} onChange={e => setBody(e.target.value)} required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Link URL (Optional)</label>
                            <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="e.g. /posts/my-new-post"
                                value={link} onChange={e => setLink(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Large Image URL</label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="https://.../banner.png"
                                    value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Icon URL (Logo)</label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="Default: /icon.png"
                                    value={iconUrl} onChange={e => setIconUrl(e.target.value)}
                                />
                            </div>
                        </div>

                        <div
                            className={cn(
                                "flex items-center space-x-3 rounded-lg border p-4 transition-all cursor-pointer",
                                isBroadcast ? "bg-primary/5 border-primary/20" : "bg-muted/20 hover:bg-muted/30"
                            )}
                            onClick={() => setIsBroadcast(!isBroadcast)}
                        >
                            <div className={cn("h-5 w-5 rounded-full border flex items-center justify-center transition-colors", isBroadcast ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground")}>
                                {isBroadcast && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Broadcast to Everyone</p>
                                <p className="text-xs text-muted-foreground">Send to all users currently subscribed to notifications.</p>
                            </div>
                        </div>

                        {!isBroadcast && (
                            <div className="space-y-2 pt-2 animate-in fade-in slide-in-from-top-2">
                                <label className="text-sm font-medium">Target Token (Debug)</label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-xs font-mono ring-offset-background"
                                    placeholder="fcm_token_..."
                                    value={targetToken} onChange={e => setTargetToken(e.target.value)}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                            {loading ? "Sending..." : (
                                <>
                                    <Send size={16} />
                                    Send Notification
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
