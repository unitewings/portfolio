"use client";

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { BlogPost } from '@/types';

// Color config per resource type
const typeConfig: Record<string, { icon: string; iconBg: string; iconColor: string; labelBg: string; labelText: string; btnColor: string; label: string }> = {
    whitepaper: {
        icon: 'description',
        iconBg: 'bg-blue-100 dark:bg-blue-900/30',
        iconColor: 'text-blue-600',
        labelBg: 'bg-blue-50 dark:bg-blue-900/20',
        labelText: 'text-blue-600 dark:text-blue-300',
        btnColor: 'bg-blue-600 hover:bg-blue-700',
        label: 'Whitepaper',
    },
    downloadable: {
        icon: 'build',
        iconBg: 'bg-green-100 dark:bg-green-900/30',
        iconColor: 'text-green-600',
        labelBg: 'bg-green-50 dark:bg-green-900/20',
        labelText: 'text-green-600 dark:text-green-300',
        btnColor: 'bg-green-600 hover:bg-green-700',
        label: 'Toolkit',
    },
    quick_download: {
        icon: 'auto_awesome',
        iconBg: 'bg-purple-100 dark:bg-purple-900/30',
        iconColor: 'text-purple-600',
        labelBg: 'bg-purple-50 dark:bg-purple-900/20',
        labelText: 'text-purple-600 dark:text-purple-300',
        btnColor: 'bg-purple-600 hover:bg-purple-700',
        label: 'Template',
    },
};

const ITEMS_PER_PAGE = 6;

export default function ResourceLibraryClient({ posts }: { posts: BlogPost[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    const filteredPosts = useMemo(() => {
        return posts.filter(p => {
            const matchesSearch = !searchQuery ||
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });
    }, [posts, searchQuery]);

    const visiblePosts = filteredPosts.slice(0, visibleCount);
    const hasMore = visibleCount < filteredPosts.length;

    return (
        <main className="resource-grid">
            {/* Header Tile */}
            <div className="header-tile tile bg-surface-light dark:bg-surface-dark p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
                <div className="relative z-10 w-full md:w-3/4">
                    <Link className="inline-flex items-center text-muted-light dark:text-muted-dark hover:text-primary dark:hover:text-primary mb-4 text-sm font-medium transition-colors" href="/resources">
                        <span className="material-icons-round mr-1 text-base">arrow_back</span>
                        Back to Hub
                    </Link>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 uppercase tracking-widest ml-3">
                        Premium Downloads
                    </div>
                    <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
                        Resource Library
                    </h1>
                    <p className="text-xl text-muted-light dark:text-muted-dark max-w-2xl leading-relaxed">
                        Access our complete collection of whitepapers, toolkits, templates, and guides designed to empower your HR strategy with AI.
                    </p>
                </div>
                <div className="hidden md:block absolute right-0 bottom-0 opacity-10 dark:opacity-5 pointer-events-none">
                    <span className="material-icons-round text-[200px] text-primary">folder_copy</span>
                </div>
            </div>

            {/* Search Tile */}
            <div className="search-tile tile bg-surface-light dark:bg-surface-dark p-4 md:p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
                <div className="relative w-full">
                    <span className="material-icons-round absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">search</span>
                    <input
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        placeholder="Search resources..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Resource Cards */}
            {visiblePosts.length > 0 ? visiblePosts.map(post => {
                const config = typeConfig[post.type] || typeConfig.downloadable;
                let contentData: Record<string, string> = {};
                try { contentData = JSON.parse(post.content); } catch { /* ignore */ }
                const fileExt = contentData.fileUrl ? contentData.fileUrl.split('.').pop()?.toUpperCase() : 'File';

                return (
                    <div key={post.id} className="resource-tile tile bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-2xl ${config.iconBg} ${config.iconColor} flex items-center justify-center`}>
                                <span className="material-icons-round text-2xl">{config.icon}</span>
                            </div>
                            <span className={`${config.labelBg} ${config.labelText} text-[10px] font-bold px-2 py-1 rounded uppercase`}>{config.label}</span>
                        </div>
                        <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                        <p className="text-sm text-muted-light dark:text-muted-dark mb-4 line-clamp-2">{post.excerpt || contentData.description}</p>
                        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <span className="text-xs text-muted-light font-medium bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">{fileExt}</span>
                            <Link href={`/posts/${post.slug}`} className={`${config.btnColor} text-white p-2 rounded-lg transition-colors shadow-sm`}>
                                <span className="material-icons-round text-lg">download</span>
                            </Link>
                        </div>
                    </div>
                );
            }) : (
                <div className="search-tile tile bg-surface-light dark:bg-surface-dark py-16 text-center shadow-sm rounded-3xl border border-gray-100 dark:border-gray-700 col-span-full">
                    <span className="material-icons-round text-6xl mb-4 text-gray-300 dark:text-gray-600">folder_off</span>
                    <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">No resources found</h2>
                    <p className="text-muted-light dark:text-muted-dark">Try adjusting your search criteria.</p>
                    <button onClick={() => setSearchQuery('')} className="mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors inline-block">
                        Clear Search
                    </button>
                </div>
            )}

            {/* Load More */}
            {hasMore && (
                <div className="load-more-tile flex justify-center py-6">
                    <button
                        onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                        className="group flex items-center gap-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 px-8 py-3 rounded-full text-sm font-bold text-gray-700 dark:text-gray-200 hover:border-primary hover:text-primary transition-all shadow-sm hover:shadow-md"
                    >
                        <span className="material-icons-round group-hover:animate-spin">refresh</span>
                        Load More Resources
                    </button>
                </div>
            )}

        </main>
    );
}
