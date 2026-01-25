import { getContactSubmissions } from "@/lib/data";
import { MessagesTable } from "@/components/admin/MessagesTable";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
    const messages = await getContactSubmissions();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                    <p className="text-muted-foreground">Recent messages from the contact form.</p>
                </div>
            </div>

            <MessagesTable data={messages} />
        </div>
    );
}
