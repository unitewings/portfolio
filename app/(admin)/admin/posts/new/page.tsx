import PostEditor from "@/components/admin/PostEditor";
import CaseStudyEditor from "@/components/admin/CaseStudyEditor";
import WhitepaperEditor from "@/components/admin/WhitepaperEditor";
import DownloadableResourceEditor from "@/components/admin/DownloadableResourceEditor";

export default async function NewPostPage({
    searchParams
}: {
    searchParams: Promise<{ type?: string }>
}) {
    const params = await searchParams;
    const defaultType = params.type || 'article';

    let title = "Create New Blog";
    let subtitle = "Compose and publish a new article to your portfolio.";

    // Choose which editor to render
    let EditorComponent = <PostEditor defaultType={defaultType} />;

    if (defaultType === "whitepaper") {
        title = "Upload New Whitepaper";
        subtitle = "Create and publish premium content";
        EditorComponent = <WhitepaperEditor />;
    } else if (defaultType === "case_study") {
        title = "Add New Case Study";
        subtitle = "Content Admin / Case Studies";
        EditorComponent = <CaseStudyEditor />;
    } else if (defaultType === "downloadable" || defaultType === "quick_download") {
        title = "Add New Downloadable Resource";
        subtitle = "Configure and publish premium content to your portfolio library.";
        EditorComponent = <DownloadableResourceEditor />;
    }

    return (
        <>
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
                    <p className="text-muted-light dark:text-muted-dark">{subtitle}</p>
                </div>
            </header>

            {EditorComponent}
        </>
    );
}
