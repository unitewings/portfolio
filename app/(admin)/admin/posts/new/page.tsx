import PostEditor from "@/components/admin/PostEditor";

export default function NewPostPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">New Post</h1>
            <PostEditor />
        </div>
    );
}
