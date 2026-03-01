import Link from "next/link";
import { getPosts } from "@/lib/data";
import { CopyLinkButton } from "@/components/admin/CopyLinkButton";
import { deletePost } from "@/lib/actions";

export default async function PostsManagerPage() {
    const posts = await getPosts();
    const publishedCount = posts.filter(p => p.status === 'published').length;
    const draftCount = posts.length - publishedCount;

    return (
        <>
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Posts</h1>
                    <p className="text-muted-light dark:text-muted-dark">Manage your articles, case studies, and whitepapers.</p>
                </div>
            </header>

            <div className="bento-grid">
                {/* Stats */}
                <div className="admin-stats-row grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="tile bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">article</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-light dark:text-muted-dark uppercase tracking-wider">Total Posts</p>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white">{posts.length}</h3>
                        </div>
                    </div>
                    <div className="tile bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                            <span className="material-symbols-outlined">check_circle</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-light dark:text-muted-dark uppercase tracking-wider">Published</p>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white">{publishedCount}</h3>
                        </div>
                    </div>
                    <div className="tile bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                            <span className="material-symbols-outlined">edit_note</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-light dark:text-muted-dark uppercase tracking-wider">Drafts</p>
                            <h3 className="text-3xl font-black text-gray-900 dark:text-white">{draftCount}</h3>
                        </div>
                    </div>
                </div>

                {/* Posts Table */}
                <div className="posts-table-tile tile bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
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
                                {posts.map((post) => {
                                    const typeIcons: Record<string, { icon: string; bg: string; color: string }> = {
                                        article: { icon: "description", bg: "bg-green-100 dark:bg-green-900/20", color: "text-green-600" },
                                        whitepaper: { icon: "picture_as_pdf", bg: "bg-red-100 dark:bg-red-900/20", color: "text-red-600" },
                                        case_study: { icon: "work", bg: "bg-blue-100 dark:bg-blue-900/20", color: "text-blue-600" },
                                        newsletter: { icon: "mail", bg: "bg-purple-100 dark:bg-purple-900/20", color: "text-purple-600" },
                                        quick_download: { icon: "download", bg: "bg-orange-100 dark:bg-orange-900/20", color: "text-primary" },
                                        video: { icon: "videocam", bg: "bg-pink-100 dark:bg-pink-900/20", color: "text-pink-600" },
                                    };
                                    const typeStyle = typeIcons[post.type] || typeIcons.article;

                                    return (
                                        <tr key={post.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors border-b border-gray-50 dark:border-gray-800/50">
                                            <td className="py-5 pl-2">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg ${typeStyle.bg} flex items-center justify-center ${typeStyle.color}`}>
                                                        <span className="material-symbols-outlined text-sm">{typeStyle.icon}</span>
                                                    </div>
                                                    <p className="font-bold text-gray-900 dark:text-white truncate max-w-[250px]">{post.title}</p>
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
                                            <td className="py-5 text-muted-light dark:text-muted-dark capitalize">{post.type.replace('_', ' ')}</td>
                                            <td className="py-5 text-muted-light dark:text-muted-dark">
                                                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="py-5 pr-2 text-right">
                                                <CopyLinkButton slug={post.slug} />
                                                <Link href={`/admin/posts/${post.id}`} className="text-gray-400 hover:text-primary transition-colors p-2 inline-block">
                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                </Link>
                                                <form action={deletePost.bind(null, post.id)} className="inline-block">
                                                    <button type="submit" className="text-gray-400 hover:text-red-500 transition-colors p-2">
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
                        <p className="text-sm text-muted-light">
                            Showing <span className="font-bold text-gray-900 dark:text-white">{posts.length}</span> posts
                        </p>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50" disabled>
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            <button className="p-2 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Sidebar */}
                <div className="posts-actions-tile tile bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col gap-4">
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
            </div>
        </>
    );
}
