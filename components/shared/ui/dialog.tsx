"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
    // Handle escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onOpenChange(false);
        };
        if (open) window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [open, onOpenChange]);

    // Lock body scroll
    useEffect(() => {
        if (open) document.body.style.overflow = "hidden";
        else document.body.style.overflow = "unset";
        return () => { document.body.style.overflow = "unset"; };
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={() => onOpenChange(false)}
            />
            {/* Dialog Container to pass props down */}
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    // @ts-ignore
                    return React.cloneElement(child, { _setOpen: onOpenChange });
                }
                return child;
            })}
        </div>
    );
}

interface DialogContentProps {
    children: React.ReactNode;
    className?: string;
    _setOpen?: (open: boolean) => void;
}

export function DialogContent({ children, className, _setOpen }: DialogContentProps) {
    return (
        <div className={cn(
            "relative z-50 grid w-full max-w-lg scale-100 gap-4 border bg-background p-6 shadow-lg duration-200 animate-in fade-in zoom-in-95 sm:rounded-lg",
            className
        )}>
            {/* Note: Close button responsibility left to user or we can inject it here */}
            {children}
        </div>
    );
}

interface DialogTitleProps {
    children: React.ReactNode;
    className?: string;
}

export function DialogTitle({ children, className }: DialogTitleProps) {
    return (
        <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>
            {children}
        </h2>
    );
}
