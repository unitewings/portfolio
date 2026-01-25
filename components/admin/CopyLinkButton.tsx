"use client";

import { Button } from "@/components/shared/ui/button";
import { Link2, Check } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface CopyLinkButtonProps {
    slug: string;
    pathPrefix?: string; // e.g. "/posts/" or "/" for pages
}

export function CopyLinkButton({ slug, pathPrefix = "/posts/" }: CopyLinkButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const url = `${window.location.origin}${pathPrefix}${slug}`;
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy Link">
            {copied ? <Check size={16} className="text-green-500" /> : <Link2 size={16} />}
        </Button>
    );
}
