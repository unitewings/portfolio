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
                    // Custom link handling
                    a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />,
                    // Custom image handling
                    img: (props) => (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            {...props}
                            loading="lazy"
                            className="rounded-lg w-full h-auto object-cover my-4"
                            style={{ maxWidth: '100%', height: 'auto' }}
                            alt={props.alt || 'Post image'}
                        />
                    )
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}
