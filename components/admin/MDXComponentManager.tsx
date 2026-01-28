"use client";

import React, { useState, useTransition } from "react";
import { Check, Copy, Save, Loader2 } from "lucide-react";
import { updateMDXSettings } from "@/lib/actions";
import { SecureIframe } from "@/components/mdx/SecureIframe";
import { ActionButton } from "@/components/mdx/ActionButton";
import { CalloutBox } from "@/components/mdx/CalloutBox";

interface MDXComponentManagerProps {
    initialAllowlist: string;
}

// Static code snippets - these are hardcoded and reset on refresh
const COMPONENT_SNIPPETS = [
    {
        name: "SecureIframe",
        description: "Embed videos, code sandboxes, and other content from allowlisted domains",
        snippet: `<SecureIframe 
  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
  title="Video Title"
  aspectRatio="16/9"
/>`,
        preview: (
            <SecureIframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Sample Video"
                aspectRatio="16/9"
            />
        ),
    },
    {
        name: "ActionButton (Primary)",
        description: "Primary styled button for main call-to-actions",
        snippet: `<ActionButton href="/contact" variant="primary">
  Contact Me
</ActionButton>`,
        preview: (
            <ActionButton href="/contact" variant="primary">
                Contact Me
            </ActionButton>
        ),
    },
    {
        name: "ActionButton (External)",
        description: "Button with external link indicator",
        snippet: `<ActionButton href="https://github.com" external variant="outline">
  View on GitHub
</ActionButton>`,
        preview: (
            <ActionButton href="https://github.com" external variant="outline">
                View on GitHub
            </ActionButton>
        ),
    },
    {
        name: "CalloutBox (Info)",
        description: "Blue info box for helpful information",
        snippet: `<CalloutBox type="info" title="Did you know?">
  MDX lets you use React components in markdown!
</CalloutBox>`,
        preview: (
            <CalloutBox type="info" title="Did you know?">
                MDX lets you use React components in markdown!
            </CalloutBox>
        ),
    },
    {
        name: "CalloutBox (Warning)",
        description: "Yellow warning box for important notices",
        snippet: `<CalloutBox type="warning">
  This feature is experimental.
</CalloutBox>`,
        preview: (
            <CalloutBox type="warning">
                This feature is experimental.
            </CalloutBox>
        ),
    },
    {
        name: "CalloutBox (Tip)",
        description: "Purple tip box for pro tips",
        snippet: `<CalloutBox type="tip" title="Pro Tip">
  Use keyboard shortcuts for faster editing.
</CalloutBox>`,
        preview: (
            <CalloutBox type="tip" title="Pro Tip">
                Use keyboard shortcuts for faster editing.
            </CalloutBox>
        ),
    },
    {
        name: "CalloutBox (Success)",
        description: "Green success box for confirmations",
        snippet: `<CalloutBox type="success">
  Your changes have been saved!
</CalloutBox>`,
        preview: (
            <CalloutBox type="success">
                Your changes have been saved!
            </CalloutBox>
        ),
    },
    {
        name: "CalloutBox (Danger)",
        description: "Red danger box for critical warnings",
        snippet: `<CalloutBox type="danger" title="Warning">
  This action cannot be undone.
</CalloutBox>`,
        preview: (
            <CalloutBox type="danger" title="Warning">
                This action cannot be undone.
            </CalloutBox>
        ),
    },
];

export function MDXComponentManager({ initialAllowlist }: MDXComponentManagerProps) {
    const [allowlist, setAllowlist] = useState(initialAllowlist);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [isPending, startTransition] = useTransition();
    const [saveStatus, setSaveStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

    const handleCopy = async (snippet: string, index: number) => {
        try {
            await navigator.clipboard.writeText(snippet);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const handleSaveAllowlist = () => {
        startTransition(async () => {
            const result = await updateMDXSettings(allowlist);
            setSaveStatus({
                type: result.success ? "success" : "error",
                message: result.message,
            });
            setTimeout(() => setSaveStatus(null), 3000);
        });
    };

    return (
        <div className="space-y-10">
            {/* Iframe Allowlist Section */}
            <section className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold">Iframe Allowlist</h2>
                    <p className="text-sm text-muted-foreground">
                        One domain per line. Only iframes from these domains will be rendered.
                    </p>
                </div>

                <div className="space-y-3">
                    <textarea
                        value={allowlist}
                        onChange={(e) => setAllowlist(e.target.value)}
                        className="w-full h-64 p-4 font-mono text-sm rounded-lg border bg-background resize-y focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="youtube.com&#10;vimeo.com&#10;codepen.io"
                    />

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleSaveAllowlist}
                            disabled={isPending}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Save Allowlist
                        </button>

                        {saveStatus && (
                            <span
                                className={`text-sm ${saveStatus.type === "success"
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-red-600 dark:text-red-400"
                                    }`}
                            >
                                {saveStatus.message}
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {/* Component Gallery Section */}
            <section className="space-y-4">
                <div>
                    <h2 className="text-xl font-semibold">Component Gallery</h2>
                    <p className="text-sm text-muted-foreground">
                        Copy these snippets to use in your MDX content. Previews show how they&apos;ll look.
                    </p>
                </div>

                <div className="grid gap-6">
                    {COMPONENT_SNIPPETS.map((component, index) => (
                        <div
                            key={index}
                            className="border rounded-xl overflow-hidden bg-card"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                                <div>
                                    <h3 className="font-semibold">{component.name}</h3>
                                    <p className="text-xs text-muted-foreground">
                                        {component.description}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleCopy(component.snippet, index)}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border bg-background hover:bg-muted transition-colors"
                                >
                                    {copiedIndex === index ? (
                                        <>
                                            <Check className="w-4 h-4 text-green-500" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Copy Code
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Content Grid */}
                            <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                                {/* Code Snippet */}
                                <div className="p-4">
                                    <div className="text-xs font-medium text-muted-foreground mb-2">
                                        CODE
                                    </div>
                                    <pre className="p-3 rounded-lg bg-gray-900 dark:bg-gray-950 text-gray-100 text-sm overflow-x-auto">
                                        <code>{component.snippet}</code>
                                    </pre>
                                </div>

                                {/* Preview */}
                                <div className="p-4">
                                    <div className="text-xs font-medium text-muted-foreground mb-2">
                                        PREVIEW
                                    </div>
                                    <div className="min-h-[80px]">
                                        {component.preview}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
