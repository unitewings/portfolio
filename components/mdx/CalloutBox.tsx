"use client";

import React from "react";
import { Info, AlertTriangle, CheckCircle, XCircle, Lightbulb } from "lucide-react";

type CalloutType = "info" | "warning" | "success" | "danger" | "tip";

interface CalloutBoxProps {
    type?: CalloutType;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

const typeConfig: Record<
    CalloutType,
    { icon: React.ReactNode; bgClass: string; borderClass: string; textClass: string; iconClass: string }
> = {
    info: {
        icon: <Info className="w-5 h-5" />,
        bgClass: "bg-blue-50 dark:bg-blue-950/30",
        borderClass: "border-blue-200 dark:border-blue-800",
        textClass: "text-blue-900 dark:text-blue-100",
        iconClass: "text-blue-500 dark:text-blue-400",
    },
    warning: {
        icon: <AlertTriangle className="w-5 h-5" />,
        bgClass: "bg-amber-50 dark:bg-amber-950/30",
        borderClass: "border-amber-200 dark:border-amber-800",
        textClass: "text-amber-900 dark:text-amber-100",
        iconClass: "text-amber-500 dark:text-amber-400",
    },
    success: {
        icon: <CheckCircle className="w-5 h-5" />,
        bgClass: "bg-green-50 dark:bg-green-950/30",
        borderClass: "border-green-200 dark:border-green-800",
        textClass: "text-green-900 dark:text-green-100",
        iconClass: "text-green-500 dark:text-green-400",
    },
    danger: {
        icon: <XCircle className="w-5 h-5" />,
        bgClass: "bg-red-50 dark:bg-red-950/30",
        borderClass: "border-red-200 dark:border-red-800",
        textClass: "text-red-900 dark:text-red-100",
        iconClass: "text-red-500 dark:text-red-400",
    },
    tip: {
        icon: <Lightbulb className="w-5 h-5" />,
        bgClass: "bg-purple-50 dark:bg-purple-950/30",
        borderClass: "border-purple-200 dark:border-purple-800",
        textClass: "text-purple-900 dark:text-purple-100",
        iconClass: "text-purple-500 dark:text-purple-400",
    },
};

export function CalloutBox({
    type = "info",
    title,
    children,
    className = "",
}: CalloutBoxProps) {
    const config = typeConfig[type];

    return (
        <div
            className={`rounded-lg border p-4 my-4 ${config.bgClass} ${config.borderClass} ${className}`}
        >
            <div className="flex gap-3">
                <div className={`flex-shrink-0 mt-0.5 ${config.iconClass}`}>
                    {config.icon}
                </div>
                <div className={`flex-1 ${config.textClass}`}>
                    {title && (
                        <div className="font-semibold mb-1">{title}</div>
                    )}
                    <div className="text-sm [&>p]:m-0 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
