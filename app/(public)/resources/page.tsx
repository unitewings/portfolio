import { getPosts, getPageBySlug } from "@/lib/data";
import { PostCard } from "@/components/feed/PostCard";
import { MDXRenderer } from "@/components/shared/MDXRenderer";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface ResourcesPageProps {
    searchParams: Promise<{ topic?: string }>; // Updated to Promise
}

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
    const posts = await getPosts();
    const page = await getPageBySlug("resources");
    const { topic } = await searchParams; // Await the params
    const activeTopic = topic || null;

    if (!page) {
        // Fallback if DB sync hasn't happened yet (shouldn't happen with force-dynamic but good safety)
        return notFound();
    }

    // Filter Posts
    const filteredPosts = posts.filter(post => {
        if (post.status && post.status !== 'published') return false; // Hide drafts
        if (post.isListed === false) return false; // Explicitly hidden
        if (activeTopic) return post.tags?.map(t => t.trim()).includes(activeTopic);
        return true;
    });

    // Get Topics for Filter UI
    const allTopics = Array.from(new Set(posts.flatMap(p => p.tags || []).map(t => t.trim()).filter(Boolean))).sort();

    return (
        <div className="space-y-8">
            <header className="space-y-4">
                <MDXRenderer content={page.content} />

                {/* Topic Filter Bar */}
                {allTopics.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                        <span className="text-sm font-medium text-muted-foreground mr-2">Filter by:</span>
                        <a
                            href="/resources"
                            className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${!activeTopic
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background hover:bg-muted text-muted-foreground"
                                }`}
                        >
                            All
                        </a>
                        {allTopics.map(topic => (
                            <a
                                key={topic}
                                href={`/resources?topic=${encodeURIComponent(topic)}`}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${activeTopic === topic
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background hover:bg-muted text-muted-foreground"
                                    }`}
                            >
                                {topic}
                            </a>
                        ))}
                    </div>
                )}
            </header>

            <div className="grid gap-6">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
                ) : (
                    <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                        {activeTopic ? `No resources found for topic "${activeTopic}".` : "No resources found yet."}
                    </div>
                )}
            </div>
        </div>
    );
}
