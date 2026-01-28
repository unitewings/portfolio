"use client";

import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { useEffect, useState } from "react";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { mdxComponents } from "@/components/mdx";

interface MDXRendererProps {
    content: string;
    className?: string;
}

/**
 * MDXRenderer - Renders MDX content with custom components.
 * 
 * Supports all standard Markdown plus these custom components:
 * - <SecureIframe src="..." /> - Secure embedded iframes
 * - <ActionButton href="..." variant="primary">Text</ActionButton> - Styled buttons
 * - <CalloutBox type="info">Content</CalloutBox> - Alert/callout boxes
 * 
 * Usage:
 * ```tsx
 * <MDXRenderer content={post.content} />
 * ```
 */
export function MDXRenderer({ content, className }: MDXRendererProps) {
    const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function compileMDX() {
            try {
                // Serialize MDX content with plugins
                const compiled = await serialize(content, {
                    mdxOptions: {
                        remarkPlugins: [remarkGfm],
                        rehypePlugins: [rehypeHighlight],
                        development: process.env.NODE_ENV === "development",
                    },
                });
                setMdxSource(compiled);
                setError(null);
            } catch (err) {
                console.error("MDX compilation error:", err);
                setError(err instanceof Error ? err.message : "Failed to compile MDX");
            }
        }

        if (content) {
            compileMDX();
        }
    }, [content]);

    if (error) {
        return (
            <div className={`prose prose-stone dark:prose-invert max-w-none ${className}`}>
                <div className="border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 rounded-lg p-4">
                    <p className="text-red-600 dark:text-red-400 font-medium mb-2">
                        ⚠️ Content Rendering Error
                    </p>
                    <pre className="text-sm text-red-500 overflow-auto">
                        {error}
                    </pre>
                </div>
                {/* Fallback: show raw content */}
                <div className="mt-4 opacity-75">
                    <pre className="whitespace-pre-wrap text-sm">{content}</pre>
                </div>
            </div>
        );
    }

    if (!mdxSource) {
        // Loading state with skeleton
        return (
            <div className={`prose prose-stone dark:prose-invert max-w-none ${className}`}>
                <div className="animate-pulse space-y-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`prose prose-stone dark:prose-invert max-w-none ${className}`}>
            <MDXRemote {...mdxSource} components={mdxComponents} />
        </div>
    );
}
