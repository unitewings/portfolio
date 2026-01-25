import { getSubscribers } from "@/lib/data";
import { SubscribersTable } from "@/components/admin/SubscribersTable";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
    const subscribers = await getSubscribers();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Subscribers</h1>
                    <p className="text-muted-foreground">Manage your newsletter audience.</p>
                </div>
            </div>

            <SubscribersTable data={subscribers} />
        </div>
    );
}
