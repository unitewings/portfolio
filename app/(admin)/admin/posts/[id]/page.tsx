import { getPosts } from "@/lib/data";
import PostEditor from "@/components/admin/PostEditor";
import CaseStudyEditor from "@/components/admin/CaseStudyEditor";
import WhitepaperEditor from "@/components/admin/WhitepaperEditor";
import DownloadableResourceEditor from "@/components/admin/DownloadableResourceEditor";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const posts = await getPosts();
    const post = posts.find((p) => p.id === id);

    if (!post) {
        return <div>Post not found</div>;
    }

    let title = "Edit Blog Post";
    let subtitle = "Make changes to your article.";
    let EditorComponent = <PostEditor initialData={post} />;

    if (post.type === "whitepaper") {
        title = "Edit Whitepaper";
        subtitle = "Update premium content";
        EditorComponent = <WhitepaperEditor initialData={post} />;
    } else if (post.type === "case_study") {
        title = "Edit Case Study";
        subtitle = "Update your case study.";
        EditorComponent = <CaseStudyEditor initialData={post} />;
    } else if (post.type === "downloadable" || post.type === "quick_download") {
        title = "Edit Downloadable Resource";
        subtitle = "Update premium resource in your portfolio library.";
        EditorComponent = <DownloadableResourceEditor initialData={post} />;
    }

    return (
        <>
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}: {post.title}</h1>
                    <p className="text-muted-light dark:text-muted-dark">{subtitle}</p>
                </div>
            </header>

            {EditorComponent}
        </>
    );
}
