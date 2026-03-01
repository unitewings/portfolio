"use client";

import Link from 'next/link';
import { useState } from 'react';
import { BlogPost } from '@/types';

export default function ResourcesClient({ posts }: { posts: BlogPost[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'blogs' | 'resources'>('all');

    const articles = posts.filter(p => p.type === 'article');
    const resources = posts.filter(p => p.type === 'downloadable' || p.type === 'quick_download');

    const pinnedArticles = articles.filter(p => p.pinned);
    const unpinnedArticles = articles.filter(p => !p.pinned);
    const sortedArticles = [...pinnedArticles, ...unpinnedArticles];

    // Featured blog: first pinned article, or latest if none
    const featuredBlog = sortedArticles[0];
    const secondaryBlogs = sortedArticles.slice(1, 3);
    const pinnedResources = resources.filter(p => p.pinned);
    const unpinnedResources = resources.filter(p => !p.pinned);
    const sortedResources = [...pinnedResources, ...unpinnedResources];

    // Featured resources
    const featuredResources = sortedResources.slice(0, 2);
    const quickTemplates = posts.filter(p => p.type === 'quick_download').slice(0, 3);

    // Search filtering across both types
    const allPosts = [...articles, ...resources];
    const filteredPosts = allPosts.filter(p => {
        const matchesSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' || (filter === 'blogs' && p.type === 'article') || (filter === 'resources' && (p.type === 'downloadable' || p.type === 'quick_download'));
        return matchesSearch && matchesFilter;
    });

    const isSearching = searchQuery !== '';



    return (
        <main className="bento-grid">
            {/* Header Tile */}
            <div className="header-tile tile bg-surface-light dark:bg-surface-dark p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
                <div className="relative z-10 w-full md:w-3/4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 uppercase tracking-widest">
                        Content Hub
                    </div>
                    <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
                        Blogs &amp; Resources
                    </h1>
                    <p className="text-xl text-muted-light dark:text-muted-dark max-w-2xl leading-relaxed">
                        Curated insights on the intersection of Artificial Intelligence and Human Resources. In-depth articles and actionable toolkits.
                    </p>
                </div>
                <div className="hidden md:block absolute right-0 bottom-0 opacity-10 dark:opacity-5 pointer-events-none">
                    <span className="material-icons-round text-[200px] text-primary">auto_stories</span>
                </div>
            </div>

            {/* Search Tile */}
            <div className="search-tile tile bg-surface-light dark:bg-surface-dark p-4 md:p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative w-full md:flex-1">
                    <span className="material-icons-round absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">search</span>
                    <input
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        placeholder="Search articles or downloads..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${filter === 'all'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('blogs')}
                        className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${filter === 'blogs'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                    >
                        Blogs
                    </button>
                    <button
                        onClick={() => setFilter('resources')}
                        className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${filter === 'resources'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                    >
                        Resources
                    </button>
                </div>
            </div>

            {isSearching ? (
                /* Search Results View */
                <div className="search-tile" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', background: 'transparent', boxShadow: 'none', border: 'none', padding: 0 }}>
                    {filteredPosts.length > 0 ? filteredPosts.map(post => (
                        <Link key={post.id} href={`/posts/${post.slug}`} className="tile flex flex-col p-5 rounded-3xl border border-gray-100 dark:border-gray-700 bg-surface-light dark:bg-surface-dark shadow-sm hover:border-primary/50 transition-all group h-full">
                            {post.thumbnailUrl ? (
                                <img src={post.thumbnailUrl} alt={post.title} className="w-full h-48 object-cover rounded-2xl mb-4 group-hover:scale-[1.02] transition-transform duration-300" />
                            ) : (
                                <div className="w-full h-48 bg-gray-50 dark:bg-gray-800 rounded-2xl mb-4 flex items-center justify-center">
                                    <span className="material-icons-round text-4xl text-gray-300 dark:text-gray-600">
                                        {post.type === 'article' ? 'article' : 'file_download'}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center text-xs text-primary font-bold mb-3 uppercase tracking-wider">
                                {post.type.replace('_', ' ')}
                            </div>
                            <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{post.title}</h3>
                            <p className="text-sm text-muted-light dark:text-muted-dark mb-4 flex-1 line-clamp-3">{post.excerpt}</p>
                        </Link>
                    )) : (
                        <div className="tile bg-surface-light dark:bg-surface-dark py-16 text-center shadow-sm rounded-3xl border border-gray-100 dark:border-gray-700 w-full col-span-full">
                            <span className="material-icons-round text-6xl mb-4 text-gray-300 dark:text-gray-600">search_off</span>
                            <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-2">No results found</h2>
                            <p className="text-muted-light dark:text-muted-dark">Try adjusting your search.</p>
                            <button onClick={() => setSearchQuery('')} className="mt-6 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors inline-block">
                                Clear Search
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                /* Default Hub View: Blog Section + Resource Section side-by-side */
                <>
                    {/* Blog Section */}
                    <div className="blog-section">
                        <div className="flex items-center justify-between mb-2 px-2">
                            <div className="flex items-center space-x-2">
                                <span className="material-icons-round text-primary">article</span>
                                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Featured Blogs</h2>
                            </div>
                            <Link className="group flex items-center text-sm font-semibold text-primary hover:text-orange-700 transition-colors" href="/blogs">
                                View All
                                <span className="material-icons-round text-sm ml-1 transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </Link>
                        </div>

                        {/* Featured Blog Card */}
                        {featuredBlog ? (
                            <Link href={`/posts/${featuredBlog.slug}`} className="tile bg-surface-light dark:bg-surface-dark p-0 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col relative overflow-hidden group">
                                <div className="h-56 overflow-hidden relative">
                                    {featuredBlog.thumbnailUrl ? (
                                        <img alt={featuredBlog.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={featuredBlog.thumbnailUrl} />
                                    ) : (
                                        <div className="w-full h-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                                            <span className="material-icons-round text-6xl text-orange-300 dark:text-orange-700/50">auto_stories</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                                    <div className="absolute bottom-4 left-6 right-6">
                                        <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Latest</span>
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex items-center text-xs text-muted-light dark:text-muted-dark mb-3">
                                        <span className="material-icons-round text-sm mr-1">calendar_today</span>
                                        <span>{new Date(featuredBlog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        <span className="mx-2">•</span>
                                        <span className="material-icons-round text-sm mr-1">schedule</span>
                                        <span>{Math.max(1, Math.ceil(featuredBlog.content.length / 1000))} min read</span>
                                    </div>
                                    <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                                        {featuredBlog.title}
                                    </h3>
                                    <p className="text-muted-light dark:text-muted-dark mb-6 line-clamp-3">
                                        {featuredBlog.excerpt}
                                    </p>
                                    <div className="mt-auto w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white group-hover:bg-primary group-hover:text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center group-hover:shadow-md">
                                        Read Post
                                        <span className="material-icons-round ml-2 text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </div>
                                </div>
                            </Link>
                        ) : (
                            <div className="tile bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center h-64">
                                <p className="text-muted-light italic">No articles yet.</p>
                            </div>
                        )}

                        {/* Secondary Blog Cards */}
                        {secondaryBlogs.map(post => (
                            <Link key={post.id} href={`/posts/${post.slug}`} className="tile bg-surface-light dark:bg-surface-dark p-0 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col group overflow-hidden">
                                {post.thumbnailUrl && (
                                    <div className="h-40 overflow-hidden relative">
                                        <img alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={post.thumbnailUrl} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
                                    </div>
                                )}
                                <div className="p-6 md:p-8 flex-1 flex flex-col">
                                    <div className="flex items-center text-xs text-muted-light dark:text-muted-dark mb-4">
                                        {post.tags?.[0] && (
                                            <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full font-medium text-gray-600 dark:text-gray-300 mr-3">{post.tags[0]}</span>
                                        )}
                                        <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    </div>
                                    <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-muted-light dark:text-muted-dark mb-6 text-sm line-clamp-2">
                                        {post.excerpt}
                                    </p>
                                    <span className="text-primary hover:text-orange-700 font-bold text-sm inline-flex items-center mt-auto">
                                        Read Post <span className="material-icons-round text-sm ml-1">arrow_forward</span>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Resource Section */}
                    <div className="resource-section">
                        <div className="flex items-center justify-between mb-2 px-2">
                            <div className="flex items-center space-x-2">
                                <span className="material-icons-round text-primary">folder_special</span>
                                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Premium Resources</h2>
                            </div>
                            <Link className="group flex items-center text-sm font-semibold text-primary hover:text-orange-700 transition-colors" href="/resources/library">
                                View All
                                <span className="material-icons-round text-sm ml-1 transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </Link>
                        </div>

                        {/* Resource Cards */}
                        {featuredResources.length > 0 ? featuredResources.map((post) => {
                            let contentData: Record<string, string> = {};
                            try { contentData = JSON.parse(post.content); } catch { /* ignore */ }
                            const isDownloadable = post.type === 'downloadable';
                            const materialIcon = isDownloadable ? 'description' : 'build';
                            const label = isDownloadable ? (contentData.category || 'Resource') : 'Download';
                            const iconBoxCls = isDownloadable
                                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                                : 'bg-green-100 dark:bg-green-900/30 text-green-600';
                            const labelCls = isDownloadable
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300'
                                : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300';
                            const btnCls = isDownloadable ? 'bg-blue-600' : 'bg-green-600';

                            return (
                                <Link key={post.id} href={`/posts/${post.slug}`} className="tile bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-12 h-12 rounded-2xl ${iconBoxCls} flex items-center justify-center`}>
                                            <span className="material-icons-round text-2xl">{materialIcon}</span>
                                        </div>
                                        <span className={`${labelCls} text-[10px] font-bold px-2 py-1 rounded uppercase`}>{label}</span>
                                    </div>
                                    <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                                    <p className="text-sm text-muted-light dark:text-muted-dark mb-4 line-clamp-2">{post.excerpt || contentData.description}</p>
                                    <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                        <span className="text-xs text-muted-light">
                                            {contentData.fileUrl ? contentData.fileUrl.split('.').pop()?.toUpperCase() : 'File'}
                                        </span>
                                        <span className={`${btnCls} text-white p-2 rounded-lg`}>
                                            <span className="material-icons-round text-lg">download</span>
                                        </span>
                                    </div>
                                </Link>
                            );
                        }) : (
                            <div className="tile bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center h-48">
                                <p className="text-muted-light italic">No resources yet.</p>
                            </div>
                        )}

                        {/* Quick Templates Tile */}
                        <div className="tile bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-primary">
                                    <span className="material-icons-round">bolt</span>
                                </div>
                                <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">Quick Templates</h3>
                            </div>
                            <div className="space-y-3">
                                {quickTemplates.length > 0 ? quickTemplates.map(post => (
                                    <Link key={post.id} href={`/posts/${post.slug}`} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-primary/50 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-all group/item bg-gray-50 dark:bg-gray-800">
                                        <div className="flex items-center">
                                            <span className="material-icons-round text-primary mr-3 text-sm">file_download</span>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{post.title}</span>
                                        </div>
                                        <span className="material-icons-round text-gray-400 group-hover/item:text-primary text-sm">download</span>
                                    </Link>
                                )) : (
                                    <p className="text-sm text-gray-500 italic p-2">No quick downloads available.</p>
                                )}
                            </div>
                        </div>
                    </div>

                </>
            )}
        </main>
    );
}
