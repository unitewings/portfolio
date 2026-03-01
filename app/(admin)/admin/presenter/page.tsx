"use client";

import { CreatePresentationDialog } from "@/components/presenter/CreatePresentationDialog";
import { PresentationList } from "@/components/presenter/PresentationList";

export default function PresenterDashboard() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Presentations</h1>
                <CreatePresentationDialog />
            </div>

            <PresentationList />
        </div>
    );
}
