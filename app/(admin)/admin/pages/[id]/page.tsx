import { getPageBySlug, getPages } from "@/lib/data"; // Helper to get page by ID? We only have slug/getPages.
// We stored ID in firestore documents. getPages returns objects with ID.
// Wait, getPageBySlug is for public route. For admin keys we often use ID.
// Let's add getPageById in data.ts or just iterate.
// Optimally, we should use ID for admin routes.
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Page } from "@/types";
import { PageEditor } from "@/components/admin/PageEditor";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function getPageById(id: string): Promise<Page | null> {
    const docRef = doc(db, "pages", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as Page;
    }
    return null;
}

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const page = await getPageById(id);

    if (!page) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Page</h1>
                <p className="text-muted-foreground">Edit page content and settings.</p>
            </div>
            <PageEditor initialPage={page} />
        </div>
    );
}
