"use client";

import { useState } from "react";
import { toast } from "sonner";
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
                    title, body, link, imageUrl, iconUrl,
                    targetToken: isBroadcast ? undefined : (targetToken || undefined),
                    broadcast: isBroadcast
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error("Failed to send", { description: data.error || "Unknown Error" });
                return;
            }
            toast.success(data.message || "Notification Sent!", {
                description: isBroadcast ? "Broadcasted to all users" : "Sent to specific device"
            });
            setTitle("");
            setBody("");
        } catch (error: unknown) {
            toast.error("Error Sending", { description: (error as Error)?.message || "Something went wrong" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Push Notifications</h1>
                    <p className="text-muted-light dark:text-muted-dark">Engage your audience with targeted push notifications.</p>
                </div>
                <div className="flex items-center gap-2 text-sm bg-green-50 dark:bg-green-900/20 text-green-600 px-4 py-2 rounded-full font-bold">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    FCM Enabled
                </div>
            </header>

            <div className="bento-grid">
                {/* Notification Form */}
                <div className="notif-form-tile tile bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">send</span>
                        Compose Notification
                    </h3>

                    <form onSubmit={sendNotification} className="space-y-5">
                        <div>
                            <label className="text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-2 block">Notification Title</label>
                            <input
                                className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="e.g. New Post Published!"
                                value={title} onChange={e => setTitle(e.target.value)} required
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-2 block">Body</label>
                            <textarea
                                className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary resize-none h-24"
                                placeholder="Brief description of the update..."
                                value={body} onChange={e => setBody(e.target.value)} required
                            />
                        </div>

                        <div>
                            <label className="text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-2 block">Link URL (Optional)</label>
                            <input
                                className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
                                placeholder="e.g. /posts/my-new-post"
                                value={link} onChange={e => setLink(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-2 block">Large Image URL</label>
                                <input
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 p-3 text-sm"
                                    placeholder="https://.../banner.png"
                                    value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-2 block">Icon URL (Logo)</label>
                                <input
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 p-3 text-sm"
                                    placeholder="Default: /icon.png"
                                    value={iconUrl} onChange={e => setIconUrl(e.target.value)}
                                />
                            </div>
                        </div>

                        <div
                            className={cn(
                                "flex items-center space-x-3 rounded-2xl border p-4 transition-all cursor-pointer",
                                isBroadcast ? "bg-primary/5 border-primary/20" : "bg-gray-50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50"
                            )}
                            onClick={() => setIsBroadcast(!isBroadcast)}
                        >
                            <div className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors", isBroadcast ? "border-primary bg-primary" : "border-gray-300")}>
                                {isBroadcast && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold">Broadcast to Everyone</p>
                                <p className="text-xs text-muted-light dark:text-muted-dark">Send to all active subscribers.</p>
                            </div>
                        </div>

                        {!isBroadcast && (
                            <div className="animate-in fade-in">
                                <label className="text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-2 block">Target Token (Debug)</label>
                                <input
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 p-3 text-xs font-mono"
                                    placeholder="fcm_token_..."
                                    value={targetToken} onChange={e => setTargetToken(e.target.value)}
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-orange-700 text-white font-bold py-4 px-5 rounded-2xl transition-all shadow-lg shadow-orange-500/20 disabled:opacity-50"
                        >
                            {loading ? "Sending..." : (
                                <>
                                    <span className="material-symbols-outlined text-sm">send</span>
                                    Send Notification
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Info Card */}
                <div className="notif-info-tile tile bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                            <span className="material-symbols-outlined text-2xl">groups</span>
                        </div>
                        <div>
                            <h3 className="font-display font-bold text-gray-900 dark:text-white">Audience</h3>
                            <p className="text-sm text-muted-light dark:text-muted-dark">Tips for effective notifications.</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        Use this tool to engage with your users. High-quality, relevant notifications have the best engagement rates.
                        Avoid spamming as users can easily block notifications from their browser settings.
                    </p>

                    <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl">
                        <p className="text-xs font-bold text-amber-600 uppercase mb-1">Best Practice</p>
                        <p className="text-xs text-amber-800 dark:text-amber-400">Keep notifications brief and actionable. Use clear CTAs and relevant links.</p>
                    </div>
                </div>
            </div>
        </>
    );
}
