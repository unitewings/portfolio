import type { MDXComponents as MDXComponentsType } from "mdx/types";
import { SecureIframe } from "./SecureIframe";
import { ActionButton } from "./ActionButton";
import { CalloutBox } from "./CalloutBox";

/**
 * Central registry of all custom MDX components.
 * These components can be used directly in MDX content.
 *
 * Usage in MDX:
 * ```mdx
 * <SecureIframe src="https://youtube.com/embed/..." />
 * <ActionButton href="/contact" variant="primary">Contact</ActionButton>
 * <CalloutBox type="info">Important note here!</CalloutBox>
 * ```
 */
export const mdxComponents: MDXComponentsType = {
    // Custom interactive components
    SecureIframe,
    ActionButton,
    CalloutBox,

    // Custom styling for standard HTML elements
    a: ({ children, href, ...props }) => (
        <a
            href={href}
            target={href?.startsWith("http") ? "_blank" : undefined}
            rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2"
            {...props}
        >
            {children}
        </a>
    ),

    // Ensure images are responsive
    img: (props) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            {...props}
            loading="lazy"
            className="rounded-lg w-full h-auto object-cover my-4"
            style={{ maxWidth: "100%", height: "auto" }}
            alt={props.alt || "Image"}
        />
    ),

    // Style blockquotes
    blockquote: ({ children, ...props }) => (
        <blockquote
            className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic text-gray-600 dark:text-gray-400 my-4"
            {...props}
        >
            {children}
        </blockquote>
    ),

    // Style code blocks container
    pre: ({ children, ...props }) => (
        <pre
            className="rounded-lg overflow-x-auto p-4 bg-gray-900 dark:bg-gray-950 text-gray-100 my-4"
            {...props}
        >
            {children}
        </pre>
    ),

    // Inline code styling
    code: ({ children, className, ...props }) => {
        // Check if this is inside a pre tag (code block) by checking for language class
        const isCodeBlock = className?.includes("language-");

        if (isCodeBlock) {
            return (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        }

        // Inline code styling
        return (
            <code
                className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600 dark:text-pink-400"
                {...props}
            >
                {children}
            </code>
        );
    },

    // Table styling
    table: ({ children, ...props }) => (
        <div className="overflow-x-auto my-4">
            <table
                className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                {...props}
            >
                {children}
            </table>
        </div>
    ),

    th: ({ children, ...props }) => (
        <th
            className="px-4 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800"
            {...props}
        >
            {children}
        </th>
    ),

    td: ({ children, ...props }) => (
        <td
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800"
            {...props}
        >
            {children}
        </td>
    ),
};
