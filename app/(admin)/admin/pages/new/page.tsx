import { PageEditor } from "@/components/admin/PageEditor";

export default function NewPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create New Page</h1>
                <p className="text-muted-foreground">Add a new page to your site.</p>
            </div>
            <PageEditor />
        </div>
    );
}
