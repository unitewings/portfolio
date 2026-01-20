"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, FileText, Settings, Linkedin, Youtube, Moon, Sun, Mail, Github, Twitter, Instagram, Facebook, Globe } from "lucide-react";
import { useTheme } from "next-themes";
import { Logo } from "@/components/ui/Logo";

export function ProfileCard({ name, label, socialLinks = [], image, size = 64 }: { name: string; label: string; socialLinks?: any[], image?: string, size?: number }) {
    const iconMap: Record<string, any> = {
        linkedin: Linkedin,
        youtube: Youtube,
        github: Github,
        twitter: Twitter,
        instagram: Instagram,
        facebook: Facebook,
        email: Mail,
        website: Globe
    };

    return (
        <div className="flex flex-col gap-4 p-4">
            <div className="relative flex items-center justify-center mb-6">
                <Link href="/" className="hover:opacity-80 transition-opacity w-full block">
                    <Logo />
                </Link>
            </div>
            <div>
                <h2 className="text-xl font-bold text-foreground">{name}</h2>
                <p className="text-sm text-muted-foreground">{label}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
                {socialLinks.map((link, idx) => {
                    const networkKey = link.network?.toLowerCase() || "website";
                    const Icon = iconMap[networkKey] || Globe;
                    return (
                        <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-muted-foreground hover:text-primary transition-colors hover-lift rounded-md"
                            title={link.network}
                        >
                            <Icon size={20} />
                        </a>
                    );
                })}
            </div>
        </div>
    );
}

import { Page } from "@/types";

interface NavMenuProps {
    pages?: Page[];
}

export function NavMenu({ pages = [] }: NavMenuProps) {
    const pathname = usePathname();

    const iconMap: Record<string, any> = {
        home: Home,
        resume: FileText,
        contact: Mail,
        default: FileText
    };

    const sidebarLinks = pages
        .filter(p => p.inSidebar)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map(p => {
            const Icon = iconMap[p.id] || iconMap.default;
            return {
                href: p.type === 'link' ? (p.externalUrl || '#') : (p.path || `/${p.slug}`),
                label: p.title,
                icon: Icon,
                type: p.type || 'page'
            };
        });

    const allLinks = [
        ...sidebarLinks
    ];

    return (
        <nav className="flex flex-col gap-1 px-2">
            {allLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                if (link.type === 'heading') {
                    return (
                        <div key={link.href} className="px-3 pt-6 pb-2">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                {link.label}
                            </h3>
                        </div>
                    );
                }

                if (link.type === 'link') {
                    return (
                        <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover-lift",
                                "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <Icon size={18} />
                            {link.label}
                        </a>
                    );
                }

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover-lift",
                            isActive
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <Icon size={18} />
                        {link.label}
                    </Link>
                );
            })}
        </nav>
    );
}

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors hover-lift"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="ml-2">Toggle Theme</span>
        </button>
    );
}
