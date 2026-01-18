import { getPosts } from "@/lib/data";
import PostEditor from "@/components/admin/PostEditor";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const posts = await getPosts();
    const post = posts.find((p) => p.id === id);

    if (!post) {
        return <div>Post not found</div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Edit Post: {post.title}</h1>
            <PostEditor initialData={post} />
        </div>
    );
}
