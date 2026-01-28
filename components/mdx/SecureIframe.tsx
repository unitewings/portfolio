"use client";

import React, { useEffect, useState } from "react";

// Default allowlisted domains for secure iframe embedding (used as fallback)
const DEFAULT_ALLOWED_DOMAINS = [
    "youtube.com",
    "www.youtube.com",
    "youtube-nocookie.com",
    "www.youtube-nocookie.com",
    "player.vimeo.com",
    "vimeo.com",
    "player.bilibili.com",
    "codepen.io",
    "codesandbox.io",
    "stackblitz.com",
    "jsfiddle.net",
    "replit.com",
    "figma.com",
    "www.figma.com",
    "docs.google.com",
    "drive.google.com",
    "calendar.google.com",
    "forms.gle",
    "pitch.com",
    "slides.com",
    "prezi.com",
    "google.com/maps",
    "maps.google.com",
    "open.spotify.com",
    "w.soundcloud.com",
    "gist.github.com",
    "loom.com",
    "www.loom.com",
    "notion.so",
];

// Global cache for allowlist (fetched once per session)
let cachedAllowlist: string[] | null = null;

interface SecureIframeProps {
    src: string;
    title?: string;
    aspectRatio?: "16/9" | "4/3" | "1/1" | "9/16";
    width?: string;
    height?: string;
    className?: string;
    allowFullScreen?: boolean;
    /** Override allowlist (for admin preview) */
    customAllowlist?: string[];
}

function isAllowedDomain(url: string, allowlist: string[]): boolean {
    try {
        const parsedUrl = new URL(url);
        const hostname = parsedUrl.hostname.toLowerCase();
        const fullUrl = parsedUrl.hostname + parsedUrl.pathname;

        return allowlist.some((domain) => {
            const domainLower = domain.toLowerCase().trim();
            if (!domainLower) return false;
            // Check if hostname matches or ends with the domain
            return (
                hostname === domainLower ||
                hostname.endsWith("." + domainLower) ||
                fullUrl.startsWith(domainLower)
            );
        });
    } catch {
        return false;
    }
}

export function SecureIframe({
    src,
    title = "Embedded content",
    aspectRatio = "16/9",
    width,
    height,
    className = "",
    allowFullScreen = true,
    customAllowlist,
}: SecureIframeProps) {
    const [allowlist, setAllowlist] = useState<string[]>(
        customAllowlist || cachedAllowlist || DEFAULT_ALLOWED_DOMAINS
    );
    const [isLoading, setIsLoading] = useState(!customAllowlist && !cachedAllowlist);

    useEffect(() => {
        // Skip if custom allowlist provided or already cached
        if (customAllowlist || cachedAllowlist) {
            setIsLoading(false);
            return;
        }

        // Fetch allowlist from API
        async function fetchAllowlist() {
            try {
                const response = await fetch("/api/mdx-settings");
                if (response.ok) {
                    const data = await response.json();
                    const domains = data.iframeAllowlist
                        .split("\n")
                        .map((d: string) => d.trim())
                        .filter(Boolean);
                    cachedAllowlist = domains;
                    setAllowlist(domains);
                }
            } catch (err) {
                console.warn("Failed to fetch allowlist, using defaults:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAllowlist();
    }, [customAllowlist]);

    // Show loading skeleton for iframe
    if (isLoading) {
        const aspectRatioStyles: Record<string, string> = {
            "16/9": "56.25%",
            "4/3": "75%",
            "1/1": "100%",
            "9/16": "177.78%",
        };

        return (
            <div
                className={`relative w-full overflow-hidden rounded-lg bg-muted animate-pulse ${className}`}
                style={{ paddingBottom: aspectRatioStyles[aspectRatio] }}
            />
        );
    }

    if (!isAllowedDomain(src, allowlist)) {
        return (
            <div
                className={`border border-dashed border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/30 rounded-lg p-6 text-center ${className}`}
            >
                <div className="text-red-600 dark:text-red-400 font-medium mb-2">
                    ⚠️ Embed Blocked
                </div>
                <p className="text-sm text-red-500 dark:text-red-500">
                    This embed source is not in the allowlist for security reasons.
                </p>
                <code className="text-xs text-red-400 dark:text-red-600 mt-2 block truncate">
                    {src}
                </code>
            </div>
        );
    }

    // Aspect ratio styles
    const aspectRatioStyles: Record<string, string> = {
        "16/9": "56.25%", // 9/16 * 100
        "4/3": "75%",     // 3/4 * 100
        "1/1": "100%",
        "9/16": "177.78%", // 16/9 * 100
    };

    const hasCustomDimensions = width || height;

    return (
        <div
            className={`relative w-full overflow-hidden rounded-lg ${className}`}
            style={
                hasCustomDimensions
                    ? { width: width || "100%", height: height || "auto" }
                    : { paddingBottom: aspectRatioStyles[aspectRatio] }
            }
        >
            <iframe
                src={src}
                title={title}
                className={
                    hasCustomDimensions
                        ? "w-full h-full border-0"
                        : "absolute top-0 left-0 w-full h-full border-0"
                }
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen={allowFullScreen}
            />
        </div>
    );
}
