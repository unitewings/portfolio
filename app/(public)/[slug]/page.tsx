import { notFound } from "next/navigation";
import { getPageBySlug, getSiteSettings, getPosts } from "@/lib/data";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
import { Metadata } from "next";
import { PagePasswordProtection } from "@/components/blog/PagePasswordProtection";
import { PostCard } from "@/components/feed/PostCard";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { BlogPost } from "@/types";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const page = await getPageBySlug(slug);
    const settings = await getSiteSettings();

    if (!page) {
        return {
            title: `Page Not Found | ${settings.globalTitle}`,
        };
    }

    return {
        title: `${page.seoTitle || page.title} | ${settings.globalTitle}`,
        description: page.seoDescription || settings.globalDescription,
    };
}

export default async function DynamicPage({ params }: PageProps) {
    const { slug } = await params;
    const page = await getPageBySlug(slug);
    const settings = await getSiteSettings();

    if (!page) {
        notFound();
    }

    // --- Password Protection Check ---
    if (page.isProtected) {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const cookieName = "access_granted_page_" + page.id;
        const hasAccess = cookieStore.get(cookieName);

        if (!hasAccess) {
            return <PagePasswordProtection pageId={page.id} hintLink={page.passwordHintLink} />;
        }
    }

    // --- Curated Feed Logic ---
    let curatedPosts: BlogPost[] = [];
    if (page.postIds && page.postIds.length > 0) {
        const allPosts = await getPosts();
        // Maintain order of postIds using map -> find
        curatedPosts = page.postIds
            .map(id => allPosts.find(p => p.id === id))
            .filter((p): p is BlogPost => !!p && p.status === 'published' && p.isListed !== false);
    }

    return (
        <article className="max-w-none space-y-12">
            <header className="space-y-4">
                {/* Only show title if it's not a generic container page (unless desired) */}
                {/* Standard behavior: Show title. Markdown usually follows. */}
                <h1 className="text-4xl font-bold tracking-tight mb-8">{page.title}</h1>
            </header>

            <div className="prose dark:prose-invert max-w-none">
                <MarkdownRenderer content={page.content} />
            </div>

            {/* Render Curated Posts if any */}
            {curatedPosts.length > 0 && (
                <div className="space-y-8 pt-8 border-t">
                    <h2 className="text-2xl font-bold tracking-tight">Curated Posts</h2>
                    <div className="grid gap-8">
                        {curatedPosts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                </div>
            )}

            {/* Optional: Add Newsletter to bottom of all dynamic pages? Or only if configured? */}
            {/* Custom Pages had it. Standard pages didn't explicitly, but good to have. */}
            <div className="mt-16 border-t pt-8 w-full max-w-2xl mx-auto">
                <NewsletterForm
                    title={settings.newsletterTitle || "Newsletter"}
                    description={settings.newsletterDescription || "Join subscribers."}
                />
            </div>
        </article>
    );
}
