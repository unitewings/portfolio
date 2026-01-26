"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, FileText, Settings, Mail, Menu, MoreVertical, X } from "lucide-react";
import { useState, useEffect } from "react";
import { ProfileCard, NavMenu, ThemeToggle, NotificationToggle } from "./NavComponents";


export function MobileMenu({ pages = [], settings }: { pages?: any[], settings?: any }) {
    const pathname = usePathname();
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    // Close overlay on route change
    useEffect(() => {
        setIsOverlayOpen(false);
    }, [pathname]);

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
        { href: "/resources", label: "Resources", icon: Settings }, // Using Settings as placeholder if Resources icon not specific, user asked for "Resources"
        { href: "/contact", label: "Contact", icon: Mail },
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
                                name={settings?.profileName || "Jeff Su"}
                                label={settings?.profileLabel || "Productivity Expert"}
                                socialLinks={settings?.socialLinks}
                            />
                            <NavMenu pages={pages} />

                            <div className="mt-8 border-t pt-6 space-y-4">
                                <NotificationToggle />
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 glass-panel md:hidden pb-safe">
                <nav className="flex items-center justify-around h-16">
                    {bottomNavItems.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex flex-col items-center gap-1 p-2 transition-colors",
                                    isActive
                                        ? "text-primary"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Icon size={20} />
                                {/* Optional: Hide label on very small screens if needed, but styling requests said "Clean up... remove headers" which might mean section headers, but for bottom bar usually icons+text or just icons. keeping text for clarity as requested "Home, Resume..." */}
                                <span className="text-[10px] font-medium">{link.label}</span>
                            </Link>
                        );
                    })}

                    {/* More Button */}
                    <button
                        onClick={() => setIsOverlayOpen(true)}
                        className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <MoreVertical size={20} />
                        <span className="text-[10px] font-medium">More</span>
                    </button>
                </nav>
            </div>
        </>
    );
}
