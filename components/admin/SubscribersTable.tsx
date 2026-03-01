"use client";

import { Subscriber } from "@/types";
import { useState } from "react";
import { toast } from "sonner";
import { deleteSubscribersAction } from "@/lib/actions";

interface SubscribersTableProps {
    data: Subscriber[];
}

const avatarColors = [
    "bg-orange-100 dark:bg-orange-900/20 text-primary",
    "bg-blue-100 dark:bg-blue-900/20 text-blue-600",
    "bg-purple-100 dark:bg-purple-900/20 text-purple-600",
    "bg-green-100 dark:bg-green-900/20 text-green-600",
    "bg-pink-100 dark:bg-pink-900/20 text-pink-600",
];

function getInitials(name: string) {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
}

export function SubscribersTable({ data }: SubscribersTableProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);

    const toggleSelectAll = () => {
        if (selectedIds.length === data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(data.map(d => d.id));
        }
    };

    const toggleSelect = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} subscribers?`)) return;
        setIsDeleting(true);
        const result = await deleteSubscribersAction(selectedIds);
        setIsDeleting(false);
        if (result.success) {
            toast.success(result.message);
            setSelectedIds([]);
        } else {
            toast.error(result.message);
        }
    };

    const handleExport = () => {
        const csvHeader = "ID,Name,Email,Phone,Date\n";
        const csvBody = data
            .filter(d => selectedIds.includes(d.id))
            .map(d => {
                const id = d.id;
                const name = `"${d.name || ""}"`;
                const email = d.email;
                const phone = d.phone ? `"${d.phone}"` : "";
                const date = new Date(d.subscribedAt).toLocaleDateString();
                return `${id},${name},${email},${phone},${date}`;
            })
            .join("\n");

        const blob = new Blob([csvHeader + csvBody], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `subscribers_export_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("Subscribers exported to CSV");
    };

    return (
        <>
            {/* Subscribers Table Tile */}
            <div className="subscribers-tile tile bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                        <span className="material-symbols-outlined mr-3 text-primary">groups</span>
                        All Subscribers
                    </h3>
                    <div className="relative w-full md:w-80">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
                        <input className="pl-10 pr-4 py-3 w-full rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm focus:ring-primary focus:border-primary transition-all" placeholder="Search by name or email..." type="text" readOnly />
                    </div>
                </div>

                {/* Bulk action bar */}
                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-3 p-3 mb-4 bg-primary/5 rounded-2xl border border-primary/20 animate-in fade-in slide-in-from-top-2">
                        <span className="text-sm font-bold text-primary px-2">{selectedIds.length} selected</span>
                        <button onClick={handleDelete} disabled={isDeleting}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-colors dark:bg-red-900/20 dark:hover:bg-red-900/30">
                            <span className="material-symbols-outlined text-sm">delete</span>
                            {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                        <button onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 text-xs font-bold transition-colors border border-gray-100 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-800 dark:border-gray-700">
                            <span className="material-symbols-outlined text-sm">download</span>
                            Export CSV
                        </button>
                    </div>
                )}

                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-muted-light dark:text-muted-dark border-b border-gray-100 dark:border-gray-800">
                                <th className="pb-4 pl-2 w-[40px]">
                                    <button onClick={toggleSelectAll} className="opacity-70 hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-lg">
                                            {selectedIds.length === data.length && data.length > 0 ? "check_box" : "check_box_outline_blank"}
                                        </span>
                                    </button>
                                </th>
                                <th className="pb-4 font-semibold uppercase tracking-wider">Subscriber</th>
                                <th className="pb-4 font-semibold uppercase tracking-wider">Join Date</th>
                                <th className="pb-4 font-semibold uppercase tracking-wider">Status</th>
                                <th className="pb-4 pr-2 text-right font-semibold uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {data.length > 0 ? (
                                data.map((sub, idx) => (
                                    <tr key={sub.id} className={`group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors border-b border-gray-50 dark:border-gray-800/50 ${selectedIds.includes(sub.id) ? "bg-primary/5" : ""}`}>
                                        <td className="py-5 pl-2">
                                            <button onClick={() => toggleSelect(sub.id)} className="opacity-70 hover:opacity-100 transition-opacity">
                                                <span className="material-symbols-outlined text-lg">
                                                    {selectedIds.includes(sub.id) ? "check_box" : "check_box_outline_blank"}
                                                </span>
                                            </button>
                                        </td>
                                        <td className="py-5">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full ${avatarColors[idx % avatarColors.length]} flex items-center justify-center font-bold text-xs`}>
                                                    {getInitials(sub.name)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white">{sub.name || "Anonymous"}</p>
                                                    <p className="text-xs text-muted-light dark:text-muted-dark">{sub.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 text-muted-light dark:text-muted-dark">{new Date(sub.subscribedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                        <td className="py-5">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                                                Active
                                            </span>
                                        </td>
                                        <td className="py-5 pr-2 text-right">
                                            <button className="text-gray-400 hover:text-primary transition-colors p-2"><span className="material-symbols-outlined text-lg">mail</span></button>
                                            <button className="text-gray-400 hover:text-red-500 transition-colors p-2"><span className="material-symbols-outlined text-lg">block</span></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-light dark:text-muted-dark">No subscribers yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <p className="text-sm text-muted-light">
                        Showing <span className="font-bold text-gray-900 dark:text-white">{data.length}</span> subscribers
                    </p>
                    <div className="flex gap-2">
                        <button className="p-2 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50" disabled>
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button className="p-2 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Management Tools */}
            <div className="management-tile tile bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-5">
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">Management Tools</h3>

                <button className="w-full flex items-center justify-between group bg-primary hover:bg-orange-700 text-white font-bold py-4 px-5 rounded-2xl transition-all shadow-lg shadow-orange-500/20">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined">campaign</span>
                        <span className="text-sm">Broadcast Message</span>
                    </div>
                </button>

                <button onClick={() => {
                    if (data.length === 0) return;
                    // Select all then export
                    const csvHeader = "ID,Name,Email,Phone,Date\n";
                    const csvBody = data.map(d => `${d.id},"${d.name || ""}",${d.email},${d.phone ? `"${d.phone}"` : ""},${new Date(d.subscribedAt).toLocaleDateString()}`).join("\n");
                    const blob = new Blob([csvHeader + csvBody], { type: "text/csv" });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `subscribers_all_${new Date().toISOString().split("T")[0]}.csv`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                    toast.success("All subscribers exported to CSV");
                }} className="w-full flex items-center gap-3 group bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-bold py-4 px-5 rounded-2xl transition-all border border-gray-100 dark:border-gray-700">
                    <span className="material-symbols-outlined text-primary">download</span>
                    <div className="flex flex-col items-start">
                        <span className="text-sm">Export Subscriber List</span>
                        <span className="text-[10px] font-normal text-muted-light group-hover:text-primary transition-colors">CSV/XLS</span>
                    </div>
                </button>

                <div className="mt-4 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-bold text-muted-light dark:text-muted-dark uppercase tracking-widest mb-4">Quick Stats</p>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Open Rate</span>
                            <span className="text-sm font-bold text-primary">64.2%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-primary h-full rounded-full" style={{ width: "64.2%" }}></div>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Click Rate</span>
                            <span className="text-sm font-bold text-blue-500">12.8%</span>
                        </div>
                        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: "12.8%" }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity-tile tile bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
                <div className="space-y-6 flex-1">
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 shrink-0 mt-1">
                            <span className="material-symbols-outlined text-sm">person_add</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">New signup</p>
                            <p className="text-xs text-muted-light dark:text-muted-dark">12 minutes ago</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-primary shrink-0 mt-1">
                            <span className="material-symbols-outlined text-sm">send</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">Newsletter sent</p>
                            <p className="text-xs text-muted-light dark:text-muted-dark">4 hours ago</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 shrink-0 mt-1">
                            <span className="material-symbols-outlined text-sm">person_remove</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">Unsubscribe</p>
                            <p className="text-xs text-muted-light dark:text-muted-dark">Yesterday</p>
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <a className="block text-center py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-primary text-xs font-bold hover:bg-gray-100 transition-colors" href="#">View Audience Insights</a>
                </div>
            </div>
        </>
    );
}
