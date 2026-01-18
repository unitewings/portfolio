"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, FileText, Settings, Mail } from "lucide-react";

export function MobileMenu({ pages = [] }: { pages?: any[] }) {
    const pathname = usePathname();

    const iconMap: Record<string, any> = {
        home: Home,
        resume: FileText,
        contact: Mail,
        default: FileText
    };

    const links = [
        ...pages
            .filter(p => p.inSidebar)
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map(p => {
                const Icon = iconMap[p.id] || iconMap.default;
                return {
                    href: p.path || `/${p.slug}`,
                    label: p.title,
                    icon: Icon
                };
            }),
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/80 glass-panel md:hidden">
            <nav className="flex items-center justify-around h-16">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex flex-col items-center gap-1 text-xs font-medium transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon size={20} />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
