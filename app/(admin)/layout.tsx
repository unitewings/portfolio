"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
    { href: "/admin", icon: "dashboard", label: "Dashboard" },
    { href: "/admin/presenter", icon: "present_to_all", label: "Presentations" },
    { href: "/admin/posts", icon: "edit_note", label: "Posts" },
    { href: "/admin/submissions", icon: "assignment_returned", label: "Submissions" },
    { href: "/admin/subscribers", icon: "group", label: "Subscribers" },
    { href: "/admin/pages", icon: "article", label: "Pages" },
    { href: "/admin/messages", icon: "mail", label: "Messages" },
    { href: "/admin/notifications", icon: "notifications", label: "Notifications" },
    { href: "/admin/mdx-components", icon: "bolt", label: "MDX Components" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    return (
        <div className="flex min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-body">
            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 p-6 border-r border-gray-200 dark:border-gray-800">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-10 px-4">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
                    <span className="font-display font-bold text-xl tracking-tight">Swarn Admin</span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`admin-sidebar-item ${isActive(item.href) ? "active" : ""}`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}

                    <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                        <Link
                            href="/admin/settings"
                            className={`admin-sidebar-item ${isActive("/admin/settings") ? "active" : ""}`}
                        >
                            <span className="material-symbols-outlined">settings</span>
                            <span>Settings</span>
                        </Link>
                    </div>
                </nav>

                {/* User Card */}
                <div className="mt-auto p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                            SS
                        </div>
                        <div>
                            <p className="text-xs text-muted-light dark:text-muted-dark">Welcome back,</p>
                            <p className="text-sm font-bold">Swarn S.</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 lg:p-12 max-w-7xl">
                {children}

                {/* Admin Footer */}
                <footer className="mt-16 text-center text-sm text-muted-light dark:text-muted-dark pb-8">
                    <p>© {new Date().getFullYear()} Swarn Shauryam Admin. All rights reserved.</p>
                </footer>
            </main>
        </div>
    );
}
