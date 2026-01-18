import { getPages } from "@/lib/data";
import Link from "next/link";
import { Button } from "@/components/shared/ui/button";
import { Plus, Edit } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
    const pages = await getPages();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pages</h1>
                    <p className="text-muted-foreground">Manage dynamic pages and sidebar links.</p>
                </div>
                <Link href="/admin/pages/new">
                    <Button className="gap-2">
                        <Plus size={16} />
                        New Page
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border bg-card">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Title</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Slug</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">In Sidebar</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Order</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {pages.length > 0 ? (
                                pages.map((page) => (
                                    <tr key={page.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-medium">
                                            {page.title}
                                            {page.isSystem && (
                                                <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-500 border-blue-500/20">
                                                    System
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground">{page.path || `/${page.slug}`}</td>
                                        <td className="p-4 align-middle">
                                            {page.inSidebar ? (
                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-500/10 text-green-500 border-green-500/20">
                                                    Yes
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-muted text-muted-foreground">
                                                    No
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle text-muted-foreground">{page.order}</td>
                                        <td className="p-4 align-middle text-right">
                                            <Link href={`/admin/pages/${page.id}`}>
                                                <Button variant="ghost" size="icon">
                                                    <Edit size={16} />
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-muted-foreground">No pages found. Create one!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
