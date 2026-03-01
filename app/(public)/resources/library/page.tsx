import { getPosts } from '@/lib/data';
import ResourceLibraryClient from './ResourceLibraryClient';

export default async function ResourceLibraryPage() {
    const posts = await getPosts();
    const publishedResources = posts.filter(p =>
        p.status === 'published' &&
        p.isListed !== false &&
        (p.type === 'downloadable' || p.type === 'quick_download' || p.type === 'whitepaper')
    );

    return <ResourceLibraryClient posts={publishedResources} />;
}
