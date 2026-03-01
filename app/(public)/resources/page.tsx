import { Metadata } from 'next';
import { getPosts } from '@/lib/data';
import ResourcesClient from './ResourcesClient';

export const metadata: Metadata = {
    title: "Resources",
    description: "Browse articles, case studies, and guides."
};

export default async function ResourcesPage() {
    const posts = await getPosts();
    const publishedPosts = posts.filter(p => p.status === 'published' && p.isListed !== false);

    return <ResourcesClient posts={publishedPosts} />;
}
