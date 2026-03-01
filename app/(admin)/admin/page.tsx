import { getPosts, getReactions, getDailyReactions } from "@/lib/data";
import { getAdminDb } from "@/lib/firebase-admin";
import Link from "next/link";

export const dynamic = "force-dynamic";

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
    const { newsletterCount } = await getStats();
    const reactions = await getReactions();
    const dailyReactions = await getDailyReactions();

    const publishedCount = posts.filter(p => p.status === 'published').length;
    const draftCount = posts.length - publishedCount;

    return (
        <>
            {/* Page Header */}
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-muted-light dark:text-muted-dark">Welcome back. Here&apos;s an overview of your portfolio.</p>
                </div>
            </header>

            <div className="bento-grid">
                {/* Stats Row */}
                <div className="admin-stats-row grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    <div className="tile bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-primary mb-4">
                                <span className="material-symbols-outlined text-2xl">article</span>
                            </div>
                            <p className="text-sm font-medium text-muted-light dark:text-muted-dark uppercase tracking-wider">Total Posts</p>
                            <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{posts.length}</h3>
                        </div>
                    </div>

                    <div className="tile bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-amber-100 dark:bg-amber-900/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 mb-4">
                                <span className="material-symbols-outlined text-2xl">edit_note</span>
                            </div>
                            <p className="text-sm font-medium text-muted-light dark:text-muted-dark uppercase tracking-wider">Pending Drafts</p>
                            <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{draftCount}</h3>
                        </div>
                    </div>

                    <div className="tile bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mb-4">
                                <span className="material-symbols-outlined text-2xl">group</span>
                            </div>
                            <p className="text-sm font-medium text-muted-light dark:text-muted-dark uppercase tracking-wider">Subscribers</p>
                            <h3 className="text-4xl font-black text-gray-900 dark:text-white mt-1">{newsletterCount}</h3>
                        </div>
                    </div>

                    <div className="tile bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-pink-100 dark:bg-pink-900/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-600 mb-4">
                                <span className="material-symbols-outlined text-2xl">celebration</span>
                            </div>
                            <p className="text-sm font-medium text-muted-light dark:text-muted-dark uppercase tracking-wider">Claps</p>
                            <div className="flex items-end gap-3 mt-1">
                                <h3 className="text-4xl font-black text-gray-900 dark:text-white">{reactions.claps || 0}</h3>
                                {dailyReactions?.claps > 0 && (
                                    <span className="text-sm font-bold text-green-500 mb-1.5 flex items-center">
                                        <span className="material-symbols-outlined text-xs mr-0.5">trending_up</span>
                                        {dailyReactions.claps}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="tile bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 mb-4">
                                <span className="material-symbols-outlined text-2xl">back_hand</span>
                            </div>
                            <p className="text-sm font-medium text-muted-light dark:text-muted-dark uppercase tracking-wider">High Fives</p>
                            <div className="flex items-end gap-3 mt-1">
                                <h3 className="text-4xl font-black text-gray-900 dark:text-white">{reactions.highFives || 0}</h3>
                                {dailyReactions?.highFives > 0 && (
                                    <span className="text-sm font-bold text-green-500 mb-1.5 flex items-center">
                                        <span className="material-symbols-outlined text-xs mr-0.5">trending_up</span>
                                        {dailyReactions.highFives}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Manager Table */}
                <div className="admin-content-tile tile bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                            <span className="material-symbols-outlined mr-3 text-primary">inventory_2</span>
                            Content Manager
                        </h3>
                        <div className="relative w-full md:w-80">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
                            <input className="pl-10 pr-4 py-3 w-full rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm focus:ring-primary focus:border-primary transition-all" placeholder="Search articles or case studies..." type="text" readOnly />
                        </div>
                    </div>

                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-muted-light dark:text-muted-dark border-b border-gray-100 dark:border-gray-800">
                                    <th className="pb-4 pl-2 font-semibold uppercase tracking-wider">Title</th>
                                    <th className="pb-4 font-semibold uppercase tracking-wider">Status</th>
                                    <th className="pb-4 font-semibold uppercase tracking-wider">Category</th>
                                    <th className="pb-4 font-semibold uppercase tracking-wider">Date</th>
                                    <th className="pb-4 pr-2 text-right font-semibold uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {posts.slice(0, 5).map((post) => (
                                    <tr key={post.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors border-b border-gray-50 dark:border-gray-800/50">
                                        <td className="py-5 pl-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600">
                                                    <span className="material-symbols-outlined text-sm">description</span>
                                                </div>
                                                <p className="font-bold text-gray-900 dark:text-white truncate max-w-[200px]">{post.title}</p>
                                            </div>
                                        </td>
                                        <td className="py-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${post.status === 'published'
                                                ? 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                                : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                                                }`}>
                                                {post.status === 'published' ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="py-5 text-muted-light dark:text-muted-dark">Blog Post</td>
                                        <td className="py-5 text-muted-light dark:text-muted-dark">
                                            {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="py-5 pr-2 text-right">
                                            <Link href={`/admin/posts/${post.id}`} className="text-gray-400 hover:text-primary transition-colors p-2">
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <p className="text-sm text-muted-light">
                            Showing <span className="font-bold text-gray-900 dark:text-white">5</span> of <span className="font-bold text-gray-900 dark:text-white">{posts.length}</span> items
                        </p>
                        <Link href="/admin/posts" className="text-primary text-sm font-bold hover:underline">View All →</Link>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="admin-actions-tile tile bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-4">
                    <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2">Quick Actions</h3>

                    <Link href="/admin/posts/new" className="flex items-center gap-3 bg-primary hover:bg-orange-700 text-white font-bold py-4 px-5 rounded-2xl transition-all shadow-lg shadow-orange-500/20 group">
                        <span className="material-symbols-outlined">add_circle</span>
                        <span className="text-sm">Create New Blog</span>
                    </Link>

                    <Link href="/admin/posts/new?type=whitepaper" className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-bold py-4 px-5 rounded-2xl transition-all border border-gray-100 dark:border-gray-700">
                        <span className="material-symbols-outlined text-primary">upload_file</span>
                        <span className="text-sm">Upload Whitepaper</span>
                    </Link>

                    <Link href="/admin/posts/new?type=case_study" className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-bold py-4 px-5 rounded-2xl transition-all border border-gray-100 dark:border-gray-700">
                        <span className="material-symbols-outlined text-primary">work</span>
                        <span className="text-sm">Add Case Study</span>
                    </Link>

                    <Link href="/admin/posts/new?type=downloadable" className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-bold py-4 px-5 rounded-2xl transition-all border border-gray-100 dark:border-gray-700">
                        <span className="material-symbols-outlined text-primary">file_download</span>
                        <span className="text-sm">Add Resource</span>
                    </Link>
                </div>

                {/* Recent Activity */}
                <div className="admin-activity-tile tile bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                    <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
                    <div className="space-y-6 flex-1">
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0 mt-1">
                                <span className="material-symbols-outlined text-sm">edit</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">Content updated</p>
                                <p className="text-xs text-muted-light dark:text-muted-dark">2 hours ago</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-primary shrink-0 mt-1">
                                <span className="material-symbols-outlined text-sm">publish</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">Post published</p>
                                <p className="text-xs text-muted-light dark:text-muted-dark">5 hours ago</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 shrink-0 mt-1">
                                <span className="material-symbols-outlined text-sm">delete</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight">Draft deleted</p>
                                <p className="text-xs text-muted-light dark:text-muted-dark">Yesterday</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <Link className="block text-center py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-primary text-xs font-bold hover:bg-gray-100 transition-colors" href="/admin/messages">
                            View Full Log →
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
