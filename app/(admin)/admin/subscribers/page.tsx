import { getSubscribers } from "@/lib/data";
import { SubscribersTable } from "@/components/admin/SubscribersTable";

export const dynamic = "force-dynamic";

export default async function SubscribersPage() {
    const subscribers = await getSubscribers();
    const stats = { total: subscribers.length };

    return (
        <>
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Subscriber Management</h1>
                    <p className="text-muted-light dark:text-muted-dark">Manage your newsletter audience and engagement.</p>
                </div>
            </header>

            <div className="bento-grid">
                {/* Stats Row */}
                <div className="admin-stats-row grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="tile bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-primary mb-4">
                                <span className="material-symbols-outlined text-2xl">trending_up</span>
                            </div>
                            <p className="text-sm font-medium text-muted-light dark:text-muted-dark uppercase tracking-wider">Total Subscribers</p>
                            <div className="flex items-end gap-3 mt-2">
                                <h3 className="text-4xl font-black text-gray-900 dark:text-white">{stats.total}</h3>
                            </div>
                        </div>
                    </div>

                    <div className="tile bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mb-4">
                                <span className="material-symbols-outlined text-2xl">analytics</span>
                            </div>
                            <p className="text-sm font-medium text-muted-light dark:text-muted-dark uppercase tracking-wider">Active This Month</p>
                            <div className="flex items-end gap-3 mt-2">
                                <h3 className="text-4xl font-black text-gray-900 dark:text-white">{subscribers.length}</h3>
                                <span className="text-muted-light dark:text-muted-dark text-sm font-medium mb-1">shown</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table + Actions */}
                <SubscribersTable data={subscribers} />
            </div>
        </>
    );
}
