import { getPosts, getResume } from "@/lib/data";
import { getAdminDb } from "@/lib/firebase-admin";
import { FileText, Eye, TrendingUp, Bell, Mail, MessageSquare } from "lucide-react";

// Mock Card Component since we didn't implement full shadcn
function DashboardCard({ title, value, icon: Icon, description }: any) {
    return (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                <h3 className="tracking-tight text-sm font-medium">{title}</h3>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="p-6 pt-0">
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </div>
    )
}

async function getStats() {
    try {
        const db = getAdminDb();
        const [
            fcmSnapshot,
            subscribersSnapshot,
            messagesSnapshot
        ] = await Promise.all([
            db.collection('fcm_tokens').count().get(),
            db.collection('subscribers').count().get(),
            db.collection('contact_submissions').count().get()
        ]);

        return {
            fcmCount: fcmSnapshot.data().count,
            newsletterCount: subscribersSnapshot.data().count,
            messageCount: messagesSnapshot.data().count
        };
    } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        return { fcmCount: 0, newsletterCount: 0, messageCount: 0 };
    }
}

export default async function AdminDashboard() {
    const posts = await getPosts();
    // const resume = await getResume(); 

    // Fetch real stats
    const { fcmCount, newsletterCount, messageCount } = await getStats();

    const publishedCount = posts.filter(p => p.status === 'published').length;
    const draftCount = posts.length - publishedCount;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back. Here is an overview of your portfolio.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <DashboardCard
                    title="Total Posts"
                    value={posts.length}
                    icon={FileText}
                    description={`${publishedCount} published, ${draftCount} drafts`}
                />
                <DashboardCard
                    title="Push Subscribers"
                    value={fcmCount}
                    icon={Bell}
                    description="Active devices"
                />
                <DashboardCard
                    title="Newsletter"
                    value={newsletterCount}
                    icon={Mail}
                    description="Email subscribers"
                />
                <DashboardCard
                    title="Messages"
                    value={messageCount}
                    icon={MessageSquare}
                    description="Contact form submissions"
                />
                <DashboardCard
                    title="Resume Views"
                    value="1,234"
                    icon={Eye}
                    description="Mock Data (Analytics needed)"
                />
            </div>
        </div>
    );
}
