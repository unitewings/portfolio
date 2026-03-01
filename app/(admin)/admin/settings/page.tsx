import { getSiteSettings } from "@/lib/data";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
    const initialSettings = await getSiteSettings();

    return (
        <>
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Site Settings</h1>
                    <p className="text-muted-light dark:text-muted-dark">Configure your portfolio&apos;s global settings and metadata.</p>
                </div>
            </header>
            <SettingsForm initialData={initialSettings} />
        </>
    );
}
