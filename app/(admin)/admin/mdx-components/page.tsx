import { getMDXSettings } from "@/lib/data";
import { MDXComponentManager } from "@/components/admin/MDXComponentManager";

export const dynamic = "force-dynamic";

export default async function MDXComponentsPage() {
    const settings = await getMDXSettings();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">MDX Components</h1>
                <p className="text-muted-foreground">
                    Manage iframe allowlist and copy component snippets for your content.
                </p>
            </div>
            <MDXComponentManager initialAllowlist={settings.iframeAllowlist} />
        </div>
    );
}
