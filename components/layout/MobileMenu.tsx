"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, FileText, Settings, Mail, MoreVertical, X, LayoutGrid, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { ProfileCard, NavMenu, ThemeToggle, NotificationToggle } from "./NavComponents";


export function MobileMenu() {
    const pathname = usePathname();
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [prevPathname, setPrevPathname] = useState(pathname);

    // Close overlay on route change (render phase update)
    if (pathname !== prevPathname) {
        setPrevPathname(pathname);
        if (isOverlayOpen) {
            setIsOverlayOpen(false);
        }
    }

    // Lock body scroll when overlay is open
    useEffect(() => {
        if (isOverlayOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOverlayOpen]);

    // Filter for specific bottom bar items
    const bottomNavItems = [
        { href: "/", label: "Home", icon: Home },
        { href: "/resume", label: "Resume", icon: FileText },
        { href: "/resources", label: "Resources", icon: LayoutGrid },
        { href: "/submit", label: "Submit", icon: Send },
        { href: "/contact", label: "Contact", icon: Mail },
        // Note: keeping Contact instead of replacing it with More; More is handled as a separate button
    ];

    return (
        <>
            {/* Full Screen Overlay */}
            {isOverlayOpen && (
                <div className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-xl flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-200">
                    <div className="flex justify-end p-4">
                        <button
                            onClick={() => setIsOverlayOpen(false)}
                            className="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="flex flex-col gap-8">
                            <ProfileCard
                                name="Swarn Shauryam"
                                label="AI, Growth & Journey"
                            />
                            <NavMenu />

                            <div className="mt-8 border-t pt-6 space-y-4">
                                <NotificationToggle />
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navigation Bar */}
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md z-[200] md:hidden">
                <div className="bg-white/75 dark:bg-surface-dark/80 backdrop-blur-xl border border-white/40 dark:border-gray-700/50 rounded-[2.5rem] p-2 flex justify-between items-center shadow-2xl">
                    {bottomNavItems.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex flex-col items-center justify-center flex-1 py-2 transition-colors group",
                                    isActive
                                        ? "text-primary"
                                        : "text-muted-light dark:text-muted-dark hover:text-primary dark:hover:text-primary"
                                )}
                            >
                                <Icon size={26} className={isActive ? "fill-primary/20 stroke-[2.5px]" : "stroke-[2px]"} />
                                <span className={cn("text-[10px] mt-0.5", isActive ? "font-bold" : "font-medium")}>{link.label}</span>
                            </Link>
                        );
                    })}

                    {/* More Button */}
                    <button
                        onClick={() => setIsOverlayOpen(true)}
                        className={cn(
                            "flex flex-col items-center justify-center flex-1 py-2 transition-colors group",
                            isOverlayOpen
                                ? "text-primary"
                                : "text-muted-light dark:text-muted-dark hover:text-primary dark:hover:text-primary"
                        )}
                    >
                        <MoreVertical size={26} className={isOverlayOpen ? "fill-primary/20 stroke-[2.5px]" : "stroke-[2px]"} />
                        <span className={cn("text-[10px] mt-0.5", isOverlayOpen ? "font-bold" : "font-medium")}>More</span>
                    </button>
                </div>
            </nav>
        </>
    );
}
