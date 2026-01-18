import { notFound } from "next/navigation";
import { getPageBySlug, getSiteSettings } from "@/lib/data";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
import { Metadata } from "next";

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
    console.log("DynamicPage hit with slug:", slug);
    const page = await getPageBySlug(slug);
    console.log("Page found:", page ? page.slug : "null");

    if (!page) {
        notFound();
    }

    return (
        <article className="max-w-none">
            <h1 className="text-4xl font-bold tracking-tight mb-8">{page.title}</h1>
            <MarkdownRenderer content={page.content} />
        </article>
    );
}
