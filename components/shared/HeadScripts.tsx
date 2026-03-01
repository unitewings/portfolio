"use client";

import { useEffect } from "react";

export function HeadScripts({ content }: { content: string }) {
    useEffect(() => {
        if (!content) return;

        const timer = setTimeout(() => {
            // Create a range to parse the HTML string into a document fragment
            const range = document.createRange();
            range.selectNode(document.head);
            const fragment = range.createContextualFragment(content);

            // Append to head
            document.head.appendChild(fragment);
        }, 3500);

        // Cleanup function (optional, but good practice if content changes, though unlikely for head scripts)
        // For head scripts, we typically don't remove them on unmount as they might be global trackers
        // But to be 100% correct React-wise if the component unmounts:
        return () => {
            clearTimeout(timer);
        };
    }, [content]);

    return null;
}
