import { getPosts, getResume } from "@/lib/data";

import { FileText, Eye, TrendingUp } from "lucide-react";

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

export default async function AdminDashboard() {
    const posts = await getPosts();
    const resume = await getResume();

    const publishedCount = posts.filter(p => p.status === 'published').length;
    const draftCount = posts.length - publishedCount;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back. Here is an overview of your portfolio.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <DashboardCard
                    title="Total Posts"
                    value={posts.length}
                    icon={FileText}
                    description={`${publishedCount} published, ${draftCount} drafts`}
                />
                <DashboardCard
                    title="Resume Views"
                    value="1,234"
                    icon={Eye}
                    description="+12% from last month"
                />
                <DashboardCard
                    title="Engagement"
                    value="+24%"
                    icon={TrendingUp}
                    description="Average time on site"
                />
            </div>

            {/* Recent Activity or Quick Actions could go here */}
        </div>
    );
}
