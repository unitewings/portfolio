import { ProfileCard, NavMenu, ThemeToggle } from "./NavComponents";
import { getSiteSettings, getPages, getPosts } from "@/lib/data";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import Link from "next/link";
import { BlogPost } from "@/types";

export async function Navigator() {
    const settings = await getSiteSettings();
    const pages = await getPages();
    const posts = await getPosts();
    const pinnedPosts = posts.filter(p => p.pinned).slice(0, 5);

    return (
        <aside className="sticky top-0 h-screen w-full overflow-y-auto border-r bg-background/50 glass-panel max-md:hidden">
            <div className="flex h-full flex-col justify-between p-6">
                <div className="flex flex-col gap-8">
                    {/* Profile & Nav */}
                    <div className="flex flex-col gap-6">
                        <ProfileCard
                            name={settings.profileName || "Jeff Su"}
                            label={settings.profileLabel || "Productivity Expert"}
                            socialLinks={settings.socialLinks}
                        />
                        <NavMenu pages={pages} />
                    </div>

                    <div className="border-t pt-6 space-y-8">
                        {/* Highlights / Trending */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Highlights
                            </h3>
                            <div className="flex flex-col gap-4">
                                {pinnedPosts.length > 0 ? (
                                    pinnedPosts.map(post => (
                                        <Link key={post.id} href={`/posts/${post.slug}`} className="group flex flex-col gap-1 hover-lift p-2 rounded-md transition-all">
                                            <span className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                                                {post.title}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} • {post.type === 'video' ? 'Video' : 'Article'}
                                            </span>
                                        </Link>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No highlights yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Tags / Topics (Simplified) */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                Topics
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {Array.from(new Set(posts.flatMap(p => p.tags || [])))
                                    .slice(0, 10) // Limit to top 10 (simple for now)
                                    .map(tag => (
                                        <Link
                                            key={tag}
                                            href={`/tags/${tag}`}
                                            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground hover:bg-muted"
                                        >
                                            {tag}
                                        </Link>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6">
                    <ThemeToggle />
                </div>
            </div>
        </aside>
    );
}
