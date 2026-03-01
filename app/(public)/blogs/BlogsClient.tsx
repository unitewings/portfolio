"use client";

import Link from 'next/link';
import { useState, useMemo } from 'react';
import { BlogPost } from '@/types';

const POSTS_PER_PAGE = 9;

// Color themes for placeholder blog cards
const colorThemes = [
    { bg: 'bg-orange-100 dark:bg-orange-900/20', icon: 'auto_stories', color: 'text-orange-300 dark:text-orange-700/50' },
    { bg: 'bg-blue-100 dark:bg-blue-900/20', icon: 'code', color: 'text-blue-300 dark:text-blue-700/50' },
    { bg: 'bg-green-100 dark:bg-green-900/20', icon: 'diversity_3', color: 'text-green-300 dark:text-green-700/50' },
    { bg: 'bg-purple-100 dark:bg-purple-900/20', icon: 'trending_up', color: 'text-purple-300 dark:text-purple-700/50' },
    { bg: 'bg-red-100 dark:bg-red-900/20', icon: 'gavel', color: 'text-red-300 dark:text-red-700/50' },
    { bg: 'bg-teal-100 dark:bg-teal-900/20', icon: 'health_and_safety', color: 'text-teal-300 dark:text-teal-700/50' },
    { bg: 'bg-indigo-100 dark:bg-indigo-900/20', icon: 'school', color: 'text-indigo-300 dark:text-indigo-700/50' },
    { bg: 'bg-yellow-100 dark:bg-yellow-900/20', icon: 'lightbulb', color: 'text-yellow-300 dark:text-yellow-700/50' },
];

export default function BlogsClient({ posts }: { posts: BlogPost[] }) {
    const [sort, setSort] = useState<'latest' | 'oldest'>('latest');
    const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

    const sortedPosts = useMemo(() => {
        const sorted = [...posts];
        if (sort === 'latest') {
            sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        } else {
            sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }
        return sorted;
    }, [posts, sort]);

    const visiblePosts = sortedPosts.slice(0, visibleCount);
    const hasMore = visibleCount < sortedPosts.length;

    return (
        <main className="blog-grid">
            {/* Header Tile */}
            <div className="header-tile tile bg-surface-light dark:bg-surface-dark p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-end relative overflow-hidden">
                <div className="relative z-10 w-full md:w-2/3">
                    <Link className="inline-flex items-center text-muted-light dark:text-muted-dark hover:text-primary dark:hover:text-primary mb-4 text-sm font-medium transition-colors" href="/resources">
                        <span className="material-icons-round mr-1 text-base">arrow_back</span>
                        Back to Hub
                    </Link>
                    <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-gray-900 dark:text-white">
                        All Blog Posts
                    </h1>
                    <p className="text-lg text-muted-light dark:text-muted-dark max-w-xl leading-relaxed">
                        Browse our complete archive of articles, insights, and thought leadership pieces on AI and HR.
                    </p>
                </div>
                <div className="hidden md:block absolute right-0 bottom-[-20px] opacity-5 pointer-events-none">
                    <span className="material-icons-round text-[180px] text-primary">history_edu</span>
                </div>
                <div className="mt-6 md:mt-0 relative z-10 w-full md:w-auto">
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setSort('latest')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${sort === 'latest'
                                ? 'bg-white dark:bg-surface-dark shadow-sm text-gray-900 dark:text-white'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-surface-dark/50'
                                }`}
                        >
                            Latest
                        </button>
                        <button
                            onClick={() => setSort('oldest')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${sort === 'oldest'
                                ? 'bg-white dark:bg-surface-dark shadow-sm text-gray-900 dark:text-white'
                                : 'text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-surface-dark/50'
                                }`}
                        >
                            Oldest
                        </button>
                    </div>
                </div>
            </div>

            {/* Blog Cards */}
            {visiblePosts.length > 0 ? visiblePosts.map((post, idx) => {
                const theme = colorThemes[idx % colorThemes.length];
                return (
                    <Link key={post.id} href={`/posts/${post.slug}`} className="tile bg-surface-light dark:bg-surface-dark rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden group">
                        <div className="h-48 overflow-hidden relative">
                            {post.thumbnailUrl ? (
                                <>
                                    <img alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={post.thumbnailUrl} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
                                </>
                            ) : (
                                <div className={`w-full h-full ${theme.bg} flex items-center justify-center`}>
                                    <span className={`material-icons-round text-6xl ${theme.color}`}>{theme.icon}</span>
                                </div>
                            )}
                            {post.tags?.[0] && (
                                <div className="absolute top-4 right-4">
                                    <span className="bg-white/90 dark:bg-surface-dark/90 backdrop-blur-sm text-gray-900 dark:text-white text-xs font-bold px-3 py-1 rounded-full border border-gray-100 dark:border-gray-600">{post.tags[0]}</span>
                                </div>
                            )}
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center text-xs text-muted-light dark:text-muted-dark mb-3">
                                <span className="material-icons-round text-sm mr-1">calendar_today</span>
                                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                <span className="mx-2">•</span>
                                <span>{Math.max(1, Math.ceil(post.content.length / 1000))} min read</span>
                            </div>
                            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                {post.title}
                            </h3>
                            <p className="text-sm text-muted-light dark:text-muted-dark mb-4 line-clamp-3">
                                {post.excerpt}
                            </p>
                            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                                <span className="text-primary hover:text-orange-700 font-bold text-sm inline-flex items-center group/btn">
                                    Read Article <span className="material-icons-round text-sm ml-1 transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
                                </span>
                            </div>
                        </div>
                    </Link>
                );
            }) : (
                <div className="header-tile tile bg-surface-light dark:bg-surface-dark py-16 text-center shadow-sm rounded-3xl border border-gray-100 dark:border-gray-700">
                    <span className="material-icons-round text-6xl mb-4 text-gray-300 dark:text-gray-600">article</span>
                    <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">No articles yet</h2>
                    <p className="text-muted-light dark:text-muted-dark">Check back soon for new content.</p>
                </div>
            )}

            {/* Pagination / Load More */}
            {hasMore && (
                <div className="pagination-tile tile flex flex-col items-center justify-center py-8">
                    <button
                        onClick={() => setVisibleCount(prev => prev + POSTS_PER_PAGE)}
                        className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary font-bold py-3 px-8 rounded-full transition-all shadow-sm hover:shadow-md flex items-center gap-2 group"
                    >
                        <span className="material-icons-round group-hover:animate-spin">refresh</span>
                        Load More Articles
                    </button>
                </div>
            )}
        </main>
    );
}
