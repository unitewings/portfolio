import React, { InputHTMLAttributes, useId } from "react";
import { cn } from "@/lib/utils";

interface FloatingLabelInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
    ({ className, label, id, ...props }, ref) => {
        const uniqueId = useId();
        // Ensure we have an ID for the label to associate with
        const inputId = id || props.name || `input-${uniqueId}`;

        return (
            <div className="relative">
                <input
                    id={inputId}
                    className={cn(
                        "peer block w-full rounded-md border border-input bg-background px-3 pt-5 pb-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary placeholder-transparent",
                        className
                    )}
                    placeholder=" "
                    ref={ref}
                    suppressHydrationWarning={true}
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
FloatingLabelInput.displayName = "FloatingLabelInput";
