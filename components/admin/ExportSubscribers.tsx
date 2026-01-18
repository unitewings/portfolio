"use client";

import { Button } from "@/components/shared/ui/button";
import { Download } from "lucide-react";
import { Subscriber } from "@/types";

export function ExportSubscribers({ subscribers }: { subscribers: Subscriber[] }) {
    const handleExport = () => {
        const headers = ["ID", "Name", "Email", "Phone", "Subscribed At"];
        const csvContent = [
            headers.join(","),
            ...subscribers.map(sub => [sub.id, sub.name, sub.email, sub.phone || ""].join(",") + "," + sub.subscribedAt)
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "subscribers.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download size={16} />
            Export to Excel (CSV)
        </Button>
    );
}
