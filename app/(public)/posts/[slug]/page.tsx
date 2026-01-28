import { getPostBySlug, getSiteSettings } from "@/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MDXRenderer } from "@/components/shared/MDXRenderer";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return {};

    return {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt,
        alternates: {
            canonical: post.canonicalUrl,
        }
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    const settings = await getSiteSettings();

    if (!post || (post.status && post.status !== 'published')) {
        notFound();
    }

    // --- Password Protection Logic ---
    let isLocked = false;
    let hintLink = post.passwordHintLink;

    // 1. Check if Post itself is protected
    if (post.isProtected) {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const hasAccess = cookieStore.get(`access_granted_${post.id}`);
        if (!hasAccess) isLocked = true;
    }

    // 2. Check if Post is inherited from a Protected Page
    if (!isLocked) { // If already locked by post, no need to check page (double lock?)
        // Actually, if locked by post, maybe page unlocks it? 
        // User said: "if someone who has unlocked the page and directly opens a blog then it should be unlocked."
        // So PAGE access overrides POST lock? Or just works as an alternative key?
        // Let's assume Page Access grants access to its children.

        const { getPages } = await import("@/lib/data");
        const allPages = await getPages();
        const parentPage = allPages.find(page =>
            page.postIds?.includes(post.id) && page.isProtected
        );

        if (parentPage) {
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            const hasPageAccess = cookieStore.get(`access_granted_page_${parentPage.id}`);

            if (hasPageAccess) {
                isLocked = false; // Page access unlocks it
            } else {
                // If we didn't have post access (or post wasn't protected), but page IS protected, we adhere to page.
                // If post was protected and we failed check 1, we stay locked unless page access unlocks us.

                // If post was NOT protected, but page IS, we must LOCK.
                if (!post.isProtected) {
                    isLocked = true;
                    hintLink = parentPage.passwordHintLink || hintLink; // Inherit hint
                }
            }
        }
    }

    if (isLocked) {
        const { PasswordProtection } = await import("@/components/blog/PasswordProtection");
        return <PasswordProtection postId={post.id} hintLink={hintLink} />;
    }

    return (
        <article className="mx-auto max-w-3xl py-12">
            <header className="mb-8 space-y-4">
                <div className="flex gap-2">
                    {post.tags.map(tag => (
                        <span key={tag} className="text-xs font-semibold text-primary uppercase tracking-wider">
                            {tag}
                        </span>
                    ))}
                </div>
                <h1 className="text-3xl font-bold md:text-4xl">{post.title}</h1>
                <p className="text-xl text-muted-foreground">{post.excerpt}</p>
                <div className="text-sm text-muted-foreground">
                    {new Date(post.date).toLocaleDateString()}
                </div>
            </header>

            {post.thumbnailUrl && (
                <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    className="mb-10 w-full rounded-xl object-cover shadow-sm aspect-video"
                />
            )}

            <MDXRenderer content={post.content} />

            <div className="mt-16 border-t pt-8">
                <NewsletterForm
                    title={settings.newsletterTitle || "Newsletter"}
                    description={settings.newsletterDescription || "Join subscribers."}
                />
            </div>
        </article>
    );
}
