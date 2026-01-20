import React, { TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface FloatingLabelTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
}

export const FloatingLabelTextarea = React.forwardRef<HTMLTextAreaElement, FloatingLabelTextareaProps>(
    ({ className, label, id, ...props }, ref) => {
        const inputId = id || props.name || "textarea-" + Math.random().toString(36).substr(2, 9);

        return (
            <div className="relative">
                <textarea
                    id={inputId}
                    className={cn(
                        "peer block w-full rounded-md border border-input bg-background px-3 pt-5 pb-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-transparent",
                        className
                    )}
                    placeholder=" "
                    ref={ref}
                    {...props}
                />
                <label
                    htmlFor={inputId}
                    className="absolute left-3 top-3.5 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-muted-foreground duration-200 bg-transparent px-1 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:px-1 peer-focus:bg-background peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-primary pointer-events-none"
                >
                    {label}
                </label>
            </div>
        );
    }
);
FloatingLabelTextarea.displayName = "FloatingLabelTextarea";
