import { Navigator } from "@/components/layout/Navigator";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { getPages, getSiteSettings } from "@/lib/data";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Footer } from "@/components/layout/Footer";
import { NewsletterPopup } from "@/components/layout/NewsletterPopup";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pages = await getPages();
    const settings = await getSiteSettings();
    return (
        /* Main Public Layout Grid */
        <div className="mx-auto grid min-h-screen w-full max-w-[1400px] grid-cols-1 md:grid-cols-[300px_1fr]">
            <MobileHeader />
            <Navigator />
            <main className="flex min-w-0 flex-col bg-background pt-14 pb-20 md:py-0">
                <div className="flex-1 p-6 md:p-8 lg:p-10">
                    <div className="mx-auto max-w-2xl w-full">
                        {children}
                        <Footer />
                    </div>
                </div>
            </main>
            <MobileMenu pages={pages} settings={settings} />
            <NewsletterPopup
                title={settings.newsletterTitle || "Newsletter"}
                description={settings.newsletterDescription || "Join subscribers."}
            />
        </div>
    );
}
