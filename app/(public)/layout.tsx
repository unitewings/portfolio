import { Navigator } from "@/components/layout/Navigator";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { getPages } from "@/lib/data";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Footer } from "@/components/layout/Footer";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pages = await getPages();
    return (
        <div className="mx-auto grid min-h-screen w-full max-w-[1400px] grid-cols-1 md:grid-cols-[300px_1fr]">
            <MobileHeader />
            <Navigator />
            <main className="flex min-w-0 flex-col border-r bg-background pt-14 pb-20 md:py-0">
                <div className="flex-1 p-6 md:p-8 lg:p-10">
                    <div className="mx-auto max-w-2xl w-full">
                        {children}
                        <Footer />
                    </div>
                </div>
            </main>
            <MobileMenu pages={pages} />
        </div>
    );
}
