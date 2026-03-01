"use client";

import { ContactSubmission } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { deleteMessagesAction } from "@/lib/actions";

interface MessagesTableProps {
    data: ContactSubmission[];
}

function timeAgo(dateStr: string) {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}M AGO`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}H AGO`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "YESTERDAY";
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
}

export function MessagesTable({ data }: MessagesTableProps) {
    const [selectedId, setSelectedId] = useState<string | null>(data.length > 0 ? data[0].id : null);
    const [isDeleting, setIsDeleting] = useState(false);

    const selectedMessage = data.find(m => m.id === selectedId);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this message?")) return;
        setIsDeleting(true);
        const result = await deleteMessagesAction([id]);
        setIsDeleting(false);
        if (result.success) {
            toast.success(result.message);
            if (selectedId === id) setSelectedId(null);
        } else {
            toast.error(result.message);
        }
    };

    const handleExport = () => {
        const csvHeader = "Date,Name,Email,Phone,Category,Message\n";
        const csvBody = data.map(d => {
            const date = new Date(d.submittedAt).toLocaleDateString();
            const name = `"${d.firstName} ${d.lastName}"`;
            const email = d.email;
            const phone = d.phone ? `"${d.phone}"` : "";
            const category = d.category || "";
            const message = `"${d.message.replace(/"/g, '""')}"`;
            return `${date},${name},${email},${phone},${category},${message}`;
        }).join("\n");

        const blob = new Blob([csvHeader + csvBody], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `messages_export_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("Messages exported to CSV");
    };

    return (
        <>
            {/* Messages List */}
            <div className="messages-list-tile tile bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">Recent Inquiries</h3>
                    <button onClick={handleExport} className="text-xs text-muted-light hover:text-primary transition-colors font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">tune</span>
                        All Messages
                    </button>
                </div>

                <div className="space-y-1 overflow-y-auto flex-1">
                    {data.length > 0 ? data.map((msg) => (
                        <button
                            key={msg.id}
                            onClick={() => setSelectedId(msg.id)}
                            className={`w-full text-left p-4 rounded-2xl transition-all ${selectedId === msg.id
                                    ? "bg-orange-50 dark:bg-orange-900/10 border-l-4 border-primary"
                                    : "hover:bg-gray-50 dark:hover:bg-gray-800/30 border-l-4 border-transparent"
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <p className="font-bold text-sm text-gray-900 dark:text-white">{msg.firstName} {msg.lastName}</p>
                                <span className="text-[10px] text-muted-light dark:text-muted-dark font-medium shrink-0 ml-2">{timeAgo(msg.submittedAt)}</span>
                            </div>
                            <p className="text-primary text-xs font-semibold mb-1">{msg.category || "General Inquiry"}</p>
                            <p className="text-xs text-muted-light dark:text-muted-dark line-clamp-2">{msg.message}</p>
                        </button>
                    )) : (
                        <div className="text-center text-muted-light dark:text-muted-dark py-12">No messages yet.</div>
                    )}
                </div>
            </div>

            {/* Message Detail */}
            <div className="messages-detail-tile tile bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                {selectedMessage ? (
                    <>
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                            <div>
                                <p className="font-bold text-lg text-gray-900 dark:text-white">{selectedMessage.firstName} {selectedMessage.lastName}</p>
                                <p className="text-xs text-muted-light dark:text-muted-dark">{selectedMessage.email}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="text-gray-400 hover:text-amber-500 transition-colors p-2" title="Star">
                                    <span className="material-symbols-outlined text-lg">star</span>
                                </button>
                                <button onClick={() => handleDelete(selectedMessage.id)} disabled={isDeleting} className="text-gray-400 hover:text-red-500 transition-colors p-2" title="Delete">
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                                <button className="text-gray-400 hover:text-gray-600 transition-colors p-2" title="More">
                                    <span className="material-symbols-outlined text-lg">more_vert</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">
                                    {selectedMessage.category || "General Inquiry"}
                                </h2>
                                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-muted-light dark:text-muted-dark">
                                    {new Date(selectedMessage.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>

                            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap mb-8">
                                {selectedMessage.message}
                            </div>

                            {selectedMessage.phone && (
                                <div className="text-xs text-muted-light dark:text-muted-dark mb-8">
                                    📱 Phone: {selectedMessage.phone}
                                </div>
                            )}

                            {/* Quick Reply Buttons */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                <button className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    &ldquo;Sounds great, let&apos;s chat!&rdquo;
                                </button>
                                <button className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    &ldquo;Send portfolio link&rdquo;
                                </button>
                                <button className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    &ldquo;Not available currently&rdquo;
                                </button>
                            </div>
                        </div>

                        {/* Reply Input */}
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                            <div className="flex items-center gap-3">
                                <input
                                    className="flex-1 pl-4 pr-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm focus:ring-primary focus:border-primary transition-all"
                                    placeholder="Type your reply here..."
                                    type="text"
                                    readOnly
                                />
                                <button className="flex items-center gap-2 bg-primary hover:bg-orange-700 text-white font-bold py-3 px-5 rounded-2xl transition-all text-sm shadow-lg shadow-orange-500/20">
                                    Send Reply
                                    <span className="material-symbols-outlined text-sm">send</span>
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-light dark:text-muted-dark">
                        <div className="text-center">
                            <span className="material-symbols-outlined text-5xl mb-4 block opacity-40">inbox</span>
                            <p className="font-medium">Select a message to read</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
