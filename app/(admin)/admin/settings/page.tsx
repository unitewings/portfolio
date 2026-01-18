import { getSiteSettings } from "@/lib/data";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    const initialSettings = await getSiteSettings();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
            <SettingsForm initialData={initialSettings} />
        </div>
    );
}
