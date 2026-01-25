import Link from "next/link";
import { getPosts } from "@/lib/data";
import { Button } from "@/components/shared/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { CopyLinkButton } from "@/components/admin/CopyLinkButton";
import { deletePost } from "@/lib/actions";

export default async function PostsManagerPage() {
    const posts = await getPosts();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
                <Link href="/admin/posts/new">
                    <Button>
                        <Plus size={16} className="mr-2" />
                        New Post
                    </Button>
                </Link>
            </div>

            <div className="rounded-md border bg-card">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Title</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[120px]">Date</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[100px]">Status</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[60px] text-right">Link</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground w-[100px] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {posts.map((post) => (
                                <tr key={post.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">{post.title}</td>
                                    <td className="p-4 align-middle text-muted-foreground">
                                        {new Date(post.date).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <span className={post.status === "published" ? "text-green-600 font-medium" : "text-amber-600 font-medium"}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <CopyLinkButton slug={post.slug} />
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/posts/${post.id}`}>
                                                <Button variant="ghost" size="icon">
                                                    <Edit size={16} />
                                                </Button>
                                            </Link>
                                            {/* Delete form */}
                                            <form action={deletePost.bind(null, post.id)}>
                                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                    <Trash2 size={16} />
                                                </Button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
