import { MetadataRoute } from 'next';
import { getPages, getPosts } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://swarn.unitewings.com'; // Fallback to assumed domain

    // 1. Get all pages (includes system pages like Home, Resume, Contact)
    const pages = await getPages();

    // 2. Get all posts
    const posts = await getPosts();

    // 3. Map pages to sitemap format
    const pageEntries: MetadataRoute.Sitemap = pages.map((page) => ({
        url: `${baseUrl}${page.path || (page.slug ? `/${page.slug}` : '')}`,
        lastModified: new Date(),
        changeFrequency: page.path === '/' ? 'daily' : 'monthly',
        priority: page.path === '/' ? 1.0 : 0.8,
    }));

    // 4. Map posts to sitemap format
    const postEntries: MetadataRoute.Sitemap = posts
        .filter(post => post.status === 'published' && post.isListed !== false)
        .map((post) => ({
            url: `${baseUrl}/posts/${post.slug}`,
            lastModified: new Date(post.date),
            changeFrequency: 'weekly',
            priority: 0.6,
        }));

    return [...pageEntries, ...postEntries];
}
