"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import SharedFooter from "@/components/shared/SharedFooter";
import dynamic from "next/dynamic";
const FeedbackWidget = dynamic(() => import("@/components/shared/FeedbackWidget").then(mod => mod.FeedbackWidget), { ssr: false });
import { MobileMenu } from "@/components/layout/MobileMenu";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { theme, setTheme } = useTheme();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
        <div className="max-w-7xl mx-auto w-full px-4 md:px-0 pb-24 md:pb-0">
            <div className="sticky top-6 z-50 flex justify-center w-full mb-10 px-2 lg:px-0">
                <nav className="flex items-center justify-between w-full max-w-4xl bg-white dark:bg-surface-dark/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-gray-100 dark:border-gray-700">
                    <Link className="flex items-center space-x-2 hover:opacity-80 transition-opacity" href="/">
                        <img src="/Images/Swarn.svg" alt="Swarn Logo" className="h-8 w-auto dark:invert" />
                    </Link>
                    <div className="hidden md:flex items-center space-x-8">
                        {pathname !== "/" && (
                            <Link className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary dark:hover:text-primary transition-colors" href="/">Home</Link>
                        )}
                        <Link className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary dark:hover:text-primary transition-colors" href="/resume">Resume</Link>
                        <Link className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary dark:hover:text-primary transition-colors" href="/resources">Resources</Link>
                        <Link className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary dark:hover:text-primary transition-colors" href="/submit">Submit Content</Link>
                        <Link className="text-sm font-medium text-muted-light dark:text-muted-dark hover:text-primary dark:hover:text-primary transition-colors" href="/contact">Contact</Link>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Link className="bg-gray-900 dark:bg-white hover:bg-primary dark:hover:bg-primary text-white dark:text-gray-900 dark:hover:text-white text-xs sm:text-sm font-bold py-2.5 px-6 rounded-full transition-all shadow-sm" href="/contact">
                            Let&apos;s Talk
                        </Link>
                        {mounted ? (
                            <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-muted-light dark:text-muted-dark" onClick={toggleTheme} aria-label="Toggle dark mode">
                                <span className="material-icons-round text-xl">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
                            </button>
                        ) : (
                            <div className="w-9 h-9"></div>
                        )}
                    </div>
                </nav>
            </div>
            {children}

            <FeedbackWidget />

            <div className="mt-16 mb-12">
                <SharedFooter />
            </div>

            <MobileMenu />
        </div>
    );
}
