import { getPosts } from '@/lib/data';
import BlogsClient from './BlogsClient';

export default async function BlogsPage() {
    const posts = await getPosts();
    const publishedArticles = posts.filter(p => p.status === 'published' && p.isListed !== false && p.type === 'article');

    return <BlogsClient posts={publishedArticles} />;
}
