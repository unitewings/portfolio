"use client";

import { ContactSubmission } from "@/types";
import { useState } from "react";
import { Button } from "@/components/shared/ui/button";
import { Trash2, Download, Mail, CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";
import { deleteMessagesAction } from "@/lib/actions";

interface MessagesTableProps {
    data: ContactSubmission[];
}

export function MessagesTable({ data }: MessagesTableProps) {
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
        if (!confirm(`Are you sure you want to delete ${selectedIds.length} messages?`)) return;

        setIsDeleting(true);
        const result = await deleteMessagesAction(selectedIds);
        setIsDeleting(false);

        if (result.success) {
            toast.success(result.message);
            setSelectedIds([]);
        } else {
            toast.error(result.message);
        }
    };

    const handleExport = () => {
        const csvHeader = "Date,Name,Email,Phone,Category,Message\n";
        const csvBody = data
            .filter(d => selectedIds.includes(d.id))
            .map(d => {
                const date = new Date(d.submittedAt).toLocaleDateString();
                const name = `"${d.firstName} ${d.lastName}"`;
                const email = d.email;
                const phone = d.phone ? `"${d.phone}"` : "";
                const category = d.category || "";
                const message = `"${d.message.replace(/"/g, '""')}"`; // Escape quotes
                return `${date},${name},${email},${phone},${category},${message}`;
            })
            .join("\n");

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
        <div className="space-y-4">
            {selectedIds.length > 0 && (
                <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md animate-in fade-in slide-in-from-top-2">
                    <span className="text-sm font-medium px-2">{selectedIds.length} selected</span>
                    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
                        <Trash2 size={14} className="mr-2" />
                        Delete
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download size={14} className="mr-2" />
                        Export CSV
                    </Button>
                </div>
            )}

            <div className="rounded-md border bg-card">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle w-[50px]">
                                    <button onClick={toggleSelectAll} className="flex items-center justify-center opacity-70 hover:opacity-100">
                                        {selectedIds.length === data.length && data.length > 0 ? <CheckSquare size={16} /> : <Square size={16} />}
                                    </button>
                                </th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Email</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Category</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Message</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {data.length > 0 ? (
                                data.map((msg) => (
                                    <tr key={msg.id} className={`border-b transition-colors hover:bg-muted/50 group ${selectedIds.includes(msg.id) ? "bg-muted/50" : ""}`}>
                                        <td className="p-4 align-middle">
                                            <button onClick={() => toggleSelect(msg.id)} className="flex items-center justify-center opacity-70 hover:opacity-100">
                                                {selectedIds.includes(msg.id) ? <CheckSquare size={16} /> : <Square size={16} />}
                                            </button>
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground whitespace-nowrap">
                                            {new Date(msg.submittedAt).toLocaleDateString()}
                                            <div className="text-xs">{new Date(msg.submittedAt).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="p-4 align-middle font-medium">
                                            {msg.firstName} {msg.lastName}
                                            {msg.phone && (
                                                <div className="text-xs text-muted-foreground">{msg.phone}</div>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <a href={`mailto:${msg.email}`} className="hover:underline flex items-center gap-1">
                                                <Mail size={12} />
                                                {msg.email}
                                            </a>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {msg.category ? (
                                                <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors bg-secondary text-secondary-foreground">
                                                    {msg.category}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle max-w-md">
                                            <p className="line-clamp-2 group-hover:line-clamp-none transition-all duration-200">
                                                {msg.message}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                                        No messages yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
