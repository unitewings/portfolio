import Link from "next/link";
import { LayoutDashboard, FileText, FileEdit, LogOut, ExternalLink, Settings, Users } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row bg-background">
            {/* Admin Sidebar */}
            <aside className="w-full md:w-64 border-r bg-card flex-shrink-0">
                <div className="flex h-16 items-center border-b px-6">
                    <Link href="/admin" className="font-bold text-xl tracking-tight">
                        Vibe<span className="text-primary">Admin</span>
                    </Link>
                </div>

                <nav className="p-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors">
                        <LayoutDashboard size={18} />
                        Dashboard
                    </Link>
                    <Link href="/admin/posts" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors">
                        <FileEdit size={18} />
                        Posts
                    </Link>
                    <Link href="/admin/resume" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors">
                        <FileText size={18} />
                        Resume
                    </Link>
                    <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors">
                        <Settings size={18} />
                        Settings
                    </Link>
                    <Link href="/admin/subscribers" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors">
                        <Users size={18} />
                        Subscribers
                    </Link>
                    <Link href="/admin/pages" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors">
                        <FileText size={18} />
                        Pages
                    </Link>

                    <Link href="/admin/messages" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors">
                        <FileText size={18} />
                        Messages
                    </Link>
                    <Link href="/admin/notifications" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors">
                        <span className="flex h-[18px] w-[18px] items-center justify-center">🔔</span>
                        Notifications
                    </Link>
                    <Link href="/admin/mdx-components" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors">
                        <span className="flex h-[18px] w-[18px] items-center justify-center">⚡</span>
                        MDX Components
                    </Link>
                </nav>

                <div className="p-4 mt-auto border-t">
                    <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-primary transition-colors">
                        <ExternalLink size={18} />
                        View Site
                    </Link>
                    <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10 transition-colors">
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Admin Content */}
            <main className="flex-1 overflow-y-auto bg-secondary/10">
                <div className="container mx-auto max-w-5xl p-6 md:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
