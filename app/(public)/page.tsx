import { getSiteSettings } from "@/lib/data";
import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

export const dynamic = "force-dynamic";

export default async function Home() {
    const settings = await getSiteSettings();

    return (
        <div className="space-y-12">
            <header className="space-y-6">
                <MarkdownRenderer content={settings.homeIntroContent} />

                <div className="pt-4">
                    <NewsletterForm
                        title={settings.newsletterTitle || "Newsletter"}
                        description={settings.newsletterDescription || "Join subscribers."}
                    />
                </div>
            </header>
        </div>
    );
}
