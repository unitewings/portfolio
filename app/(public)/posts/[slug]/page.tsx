import Link from "next/link";
import { getPostBySlug, getSiteSettings, getPosts } from "@/lib/data";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MDXRenderer } from "@/components/shared/MDXRenderer";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { BlogPost } from "@/types";

export async function generateStaticParams() {
    const posts = await getPosts();
    return posts.filter(post => post.status === 'published').map((post) => ({
        slug: post.slug,
    }));
}

function CustomPostRenderer({ post }: { post: BlogPost }) {
    let data;
    try {
        data = JSON.parse(post.content);
    } catch (e) {
        return <div>Error loading content data.</div>;
    }

    if (post.type === 'case_study' || data.challenge) {
        return (
            <div className="space-y-12">
                {data.industry && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-400 uppercase tracking-wider mb-2">Industry</h2>
                        <p className="text-2xl font-medium">{data.industry}</p>
                    </div>
                )}
                {data.challenge && (
                    <div>
                        <h2 className="text-3xl font-bold mb-4">The Challenge</h2>
                        <p className="whitespace-pre-wrap text-lg leading-relaxed">{data.challenge}</p>
                    </div>
                )}
                {data.solution && (
                    <div>
                        <h2 className="text-3xl font-bold mb-4">The Solution</h2>
                        <p className="whitespace-pre-wrap text-lg leading-relaxed">{data.solution}</p>
                    </div>
                )}
                {data.metrics && data.metrics.length > 0 && data.metrics[0].name && (
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Key Results</h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {data.metrics.map((m: { name?: string, value?: string }, i: number) => (
                                <li key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 font-medium">{m.name}</div>
                                    <div className="text-3xl font-black text-primary">{m.value}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {data.testimonial && (
                    <div className="bg-primary/5 p-8 rounded-3xl border border-primary/20 italic mt-8">
                        <span className="text-4xl text-primary/40 block mb-2">&quot;</span>
                        <p className="text-xl font-medium leading-relaxed">{data.testimonial}</p>
                        <div className="mt-6 font-bold text-sm not-italic flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                                {data.clientName?.[0] || "C"}
                            </div>
                            <div>
                                <div className="text-gray-900 dark:text-white">{data.clientName}</div>
                                <div className="text-gray-500 font-normal">Client</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (post.type === 'whitepaper' || data.author) {
        return (
            <div className="space-y-6 text-center py-16 px-4 bg-gray-50 dark:bg-gray-800/20 rounded-3xl border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto">
                <div className="text-7xl mb-6">📄</div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{post.title}</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed max-w-xl mx-auto">{post.excerpt}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 font-medium">Author: <span className="font-semibold text-gray-700 dark:text-gray-200">{data.author}</span> • Version: <span className="font-semibold text-gray-700 dark:text-gray-200">{data.version}</span></p>
                <div>
                    <a href={data.fileUrl || "#"} download target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-primary text-white hover:text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-1">
                        <span className="material-icons-round text-white">download</span>
                        <span className="text-white">Download Whitepaper</span>
                    </a>
                </div>
                <p className="text-sm text-gray-400 mt-6">Secure PDF Download.</p>
            </div>
        );
    }

    if (post.type === 'downloadable' || data.category) {
        return (
            <div className="space-y-6 text-center py-16 px-4 bg-gray-50 dark:bg-gray-800/20 rounded-3xl border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto">
                <div className="text-7xl mb-6">📦</div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{post.title}</h2>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed max-w-xl mx-auto">{data.description || post.excerpt}</p>
                {data.category && <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-8">Category: <span className="font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-widest text-xs">{data.category}</span></p>}
                <div>
                    <a href={data.fileUrl || "#"} download target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-primary text-white hover:text-white px-8 py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-1">
                        <span className="material-icons-round text-white">cloud_download</span>
                        <span className="text-white">Download Resource</span>
                    </a>
                </div>
                <p className="text-sm text-gray-400 mt-6">Instant Access.</p>
            </div>
        );
    }

    return <div>Unsupported content type.</div>;
}

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
        },
        openGraph: {
            images: post.thumbnailUrl ? [post.thumbnailUrl] : [],
        },
        twitter: {
            card: "summary_large_image",
            images: post.thumbnailUrl ? [post.thumbnailUrl] : [],
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

    // 1. Check direct Post Password
    if (post.isProtected) {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const hasSpecificAccess = cookieStore.get(`access_granted_${post.id}`);
        const hasGlobalAccess = cookieStore.get(`access_granted_global`);
        if (!hasSpecificAccess && !hasGlobalAccess) isLocked = true;
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
            const hasGlobalAccess = cookieStore.get(`access_granted_global`);

            if (hasPageAccess || hasGlobalAccess) {
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
        <div className="bento-grid">
            {/* Hero Tile */}
            {(post.type === 'article' || post.type === 'case_study') && (
                <header className="hero-section tile relative bg-gradient-to-br from-blue-900 to-slate-900 p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden min-h-[400px] flex flex-col justify-end">
                    <div className="absolute inset-0">
                        <svg className="absolute w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"></path>
                                </pattern>
                            </defs>
                            <rect fill="url(#grid)" height="100%" width="100%"></rect>
                        </svg>
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    </div>

                    {post.thumbnailUrl && (
                        <div className="absolute inset-0 z-0">
                            <img
                                src={post.thumbnailUrl}
                                alt={`${post.title} Cover`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40"></div>
                        </div>
                    )}

                    <div className="relative z-10 w-full md:w-3/4">
                        <div className="flex flex-wrap gap-4 md:gap-8 mb-6">
                            {post.tags?.map((tag: string) => (
                                <div key={tag} className="flex items-center text-blue-100 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                                    <span className="material-icons-round text-sm mr-2">{post.type === "case_study" ? "business_center" : post.type === "whitepaper" ? "description" : "article"}</span>
                                    <span className="text-sm font-medium uppercase tracking-wider">{tag}</span>
                                </div>
                            ))}
                        </div>

                        <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-white leading-tight">
                            {post.title}
                        </h1>

                        <p className="text-xl md:text-2xl text-blue-50 leading-relaxed max-w-2xl font-medium">
                            {post.excerpt}
                        </p>
                        <p className="text-sm text-blue-200 mt-6 mt-6">
                            Published on {new Date(post.date).toLocaleDateString()}
                        </p>
                    </div>
                </header>
            )}

            {/* Post Content */}
            <div className="summary-section tile bg-surface-light dark:bg-surface-dark p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="prose prose-lg dark:prose-invert prose-headings:font-display prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-p:text-muted-light dark:prose-p:text-muted-dark prose-p:leading-relaxed prose-img:rounded-3xl prose-img:shadow-sm max-w-none">
                    {(() => {
                        let isJson = false;
                        try {
                            JSON.parse(post.content);
                            isJson = true;
                        } catch (e) {
                            // Suppress error, it's just regular MDX
                        }

                        if (isJson && post.type !== 'article') {
                            return <CustomPostRenderer post={post} />;
                        }

                        if (post.type === 'article' || !post.type || !isJson) {
                            return <MDXRenderer content={post.content} />;
                        }

                        return <CustomPostRenderer post={post} />
                    })()}
                </div>
            </div>

            <div className="footer-nav tile bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
                <Link className="flex items-center text-muted-light dark:text-muted-dark hover:text-primary dark:hover:text-primary transition-colors font-medium" href="/resources">
                    <span className="material-icons-round mr-2">arrow_back</span>
                    Back to Resources
                </Link>
            </div>
        </div>
    );
}
