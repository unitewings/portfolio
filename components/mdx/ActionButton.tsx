"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ActionButtonProps {
    href?: string;
    onClick?: () => void;
    variant?: ButtonVariant;
    size?: ButtonSize;
    external?: boolean;
    disabled?: boolean;
    className?: string;
    children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-primary text-primary-foreground border-transparent hover:opacity-90 active:opacity-80",
    secondary:
        "bg-secondary text-secondary-foreground border-transparent hover:bg-accent active:bg-accent/80",
    outline:
        "bg-transparent text-foreground border-border hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
    ghost:
        "bg-transparent text-foreground border-transparent hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
};

export function ActionButton({
    href,
    onClick,
    variant = "primary",
    size = "md",
    external = false,
    disabled = false,
    className = "",
    children,
}: ActionButtonProps) {
    const baseStyles =
        "inline-flex items-center justify-center gap-2 font-medium rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background";

    const disabledStyles = disabled
        ? "opacity-50 cursor-not-allowed pointer-events-none"
        : "cursor-pointer";

    const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`;

    const content = (
        <>
            {children}
            {external && <ExternalLink className="w-4 h-4" />}
        </>
    );

    if (href && !disabled) {
        return (
            <a
                href={href}
                className={combinedStyles}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
            >
                {content}
            </a>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={combinedStyles}
        >
            {content}
        </button>
    );
}
