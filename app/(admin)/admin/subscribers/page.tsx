import { getSubscribers } from "@/lib/data";
import { ExportSubscribers } from "@/components/admin/ExportSubscribers";

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
                <ExportSubscribers subscribers={subscribers} />
            </div>

            <div className="rounded-md border bg-card">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Email</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Phone</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">ID</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {subscribers.length > 0 ? (
                                subscribers.map((sub) => (
                                    <tr key={sub.id} className="border-b transition-colors hover:bg-muted/50">
                                        <td className="p-4 align-middle font-medium">{sub.name}</td>
                                        <td className="p-4 align-middle">{sub.email}</td>
                                        <td className="p-4 align-middle text-muted-foreground">{sub.phone || "-"}</td>
                                        <td className="p-4 align-middle text-muted-foreground">{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                                        <td className="p-4 align-middle text-muted-foreground font-mono text-xs">{sub.id.substring(0, 8)}...</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-muted-foreground">No subscribers yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
