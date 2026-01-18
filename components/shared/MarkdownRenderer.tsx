"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css"; // Basic theme, can be customized or strictly managed via CSS vars

interface MarkdownRendererProps {
    content: string;
    className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
    return (
        <div className={`prose prose-stone dark:prose-invert max-w-none ${className}`}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                    // Custom link handling if needed, e.g. opening external links in new tab
                    a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
