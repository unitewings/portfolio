"use client";

import { useEffect } from "react";

export function HeadScripts({ content }: { content: string }) {
    useEffect(() => {
        if (!content) return;

        let injected = false;

        const injectScripts = () => {
            if (injected) return;
            injected = true;

            const range = document.createRange();
            range.selectNode(document.head);
            const fragment = range.createContextualFragment(content);
            document.head.appendChild(fragment);

            // Clean up listeners
            window.removeEventListener("scroll", injectScripts);
            window.removeEventListener("mousemove", injectScripts);
            window.removeEventListener("touchstart", injectScripts);
            window.removeEventListener("keydown", injectScripts);
        };

        // Fallback timer just in case no interaction happens
        const timer = setTimeout(injectScripts, 8000);

        window.addEventListener("scroll", injectScripts, { passive: true });
        window.addEventListener("mousemove", injectScripts, { passive: true });
        window.addEventListener("touchstart", injectScripts, { passive: true });
        window.addEventListener("keydown", injectScripts, { passive: true });

        return () => {
            clearTimeout(timer);
            window.removeEventListener("scroll", injectScripts);
            window.removeEventListener("mousemove", injectScripts);
            window.removeEventListener("touchstart", injectScripts);
            window.removeEventListener("keydown", injectScripts);
        };
    }, [content]);

    return null;
}
