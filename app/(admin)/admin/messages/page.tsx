import { getContactSubmissions } from "@/lib/data";
import { MessagesTable } from "@/components/admin/MessagesTable";
import { getAdminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

async function getMessageStats() {
    try {
        const db = getAdminDb();
        const snapshot = await db.collection('contact_submissions').count().get();
        return { total: snapshot.data().count };
    } catch {
        return { total: 0 };
    }
}

export default async function MessagesPage() {
    const messages = await getContactSubmissions();
    const stats = await getMessageStats();

    return (
        <>
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Messages Inbox</h1>
                    <p className="text-muted-light dark:text-muted-dark">Manage inquiries from your portfolio contact form</p>
                </div>
            </header>

            <div className="bento-grid">
                {/* Stats Row */}
                <div className="messages-stats-row tile bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex items-center gap-5 flex-1">
                        <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-3xl">mark_email_unread</span>
                        </div>
                        <div>
                            <p className="text-sm text-muted-light dark:text-muted-dark">Unread Messages</p>
                            <div className="flex items-end gap-2">
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white">{stats.total}</h3>
                                <span className="text-green-500 text-sm font-bold mb-1">+{messages.length > 3 ? 3 : messages.length} today</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-8 text-center">
                        <div>
                            <p className="text-sm text-muted-light dark:text-muted-dark">Response Rate</p>
                            <p className="text-2xl font-black text-gray-900 dark:text-white">98%</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-light dark:text-muted-dark">Avg. Response Time</p>
                            <p className="text-2xl font-black text-gray-900 dark:text-white">2.4h</p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <MessagesTable data={messages} />
            </div>
        </>
    );
}
