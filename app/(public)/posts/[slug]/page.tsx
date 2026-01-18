import { getPostBySlug } from "@/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";

export const dynamic = "force-dynamic";

interface Props {
    params: { slug: string };
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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
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

            <MarkdownRenderer content={post.content} />
        </article>
    );
}
