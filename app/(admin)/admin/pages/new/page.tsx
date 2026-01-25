import { PageEditor } from "@/components/admin/PageEditor";
import { getPosts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function NewPage() {
    const allPosts = await getPosts();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create New Page</h1>
                <p className="text-muted-foreground">Add a new page to your site.</p>
            </div>
            <PageEditor allPosts={allPosts} />
        </div>
    );
}
