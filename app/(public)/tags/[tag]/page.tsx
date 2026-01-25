import { getPosts } from "@/lib/data";
import { PostCard } from "@/components/feed/PostCard";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
    const { tag } = await params;
    const decodedTag = decodeURIComponent(tag);
    return {
        title: `Topic: ${decodedTag} | Jeff Su`,
        description: `Browse articles and videos about ${decodedTag}.`,
    };
}

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
    const params = await props.params;
    const { tag } = params;
    const decodedTag = decodeURIComponent(tag);
    const posts = await getPosts();
    const filteredPosts = posts.filter(p => {
        if (p.status && p.status !== 'published') return false;
        if (p.isListed === false) return false;
        return p.tags?.some(t => t.toLowerCase() === decodedTag.toLowerCase());
    });

    return (
        <main className="max-w-3xl mx-auto px-4 py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-bold tracking-tight mb-4">Topic: <span className="text-primary capitalize">{decodedTag}</span></h1>
                <p className="text-muted-foreground text-lg">
                    {filteredPosts.length} {filteredPosts.length === 1 ? 'result' : 'results'} found.
                </p>
            </div>

            {filteredPosts.length > 0 ? (
                <div className="grid gap-8">
                    {filteredPosts.map(post => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
                    <p className="text-muted-foreground">No posts found for this topic.</p>
                </div>
            )}
        </main>
    );
}
