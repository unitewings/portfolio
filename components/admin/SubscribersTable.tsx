"use client";

import { Subscriber } from "@/types";
import { useState } from "react";
import { Button } from "@/components/shared/ui/button";
import { Trash2, Download, CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";
import { deleteSubscribersAction } from "@/lib/actions";

interface SubscribersTableProps {
    data: Subscriber[];
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
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Email</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Phone</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">ID</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {data.length > 0 ? (
                                data.map((sub) => (
                                    <tr key={sub.id} className={`border-b transition-colors hover:bg-muted/50 ${selectedIds.includes(sub.id) ? "bg-muted/50" : ""}`}>
                                        <td className="p-4 align-middle">
                                            <button onClick={() => toggleSelect(sub.id)} className="flex items-center justify-center opacity-70 hover:opacity-100">
                                                {selectedIds.includes(sub.id) ? <CheckSquare size={16} /> : <Square size={16} />}
                                            </button>
                                        </td>
                                        <td className="p-4 align-middle font-medium">{sub.name}</td>
                                        <td className="p-4 align-middle">{sub.email}</td>
                                        <td className="p-4 align-middle text-muted-foreground">{sub.phone || "-"}</td>
                                        <td className="p-4 align-middle text-muted-foreground">{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                                        <td className="p-4 align-middle text-muted-foreground font-mono text-xs">{sub.id.substring(0, 8)}...</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-4 text-center text-muted-foreground">No subscribers yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
