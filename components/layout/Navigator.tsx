import { ProfileCard, NavMenu, ThemeToggle } from "./NavComponents";
import { getSiteSettings, getPages, getPosts } from "@/lib/data";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import Link from "next/link";
import { BlogPost } from "@/types";

export async function Navigator() {
    const settings = await getSiteSettings();
    const pages = await getPages();
    const posts = await getPosts();
    const pinnedPosts = posts.filter(p => p.pinned).slice(0, 5);

    return (
        <aside className="sticky top-0 h-screen w-full border-r bg-background/50 glass-panel max-md:hidden">
            <div className="flex h-full flex-col justify-between p-6">
                <div className="flex flex-col gap-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {/* Profile & Nav */}
                    <div className="flex flex-col gap-6">
                        <ProfileCard
                            name={settings.profileName || "Jeff Su"}
                            label={settings.profileLabel || "Productivity Expert"}
                            socialLinks={settings.socialLinks}
                            image="/images/Logo.png"
                            size={80}
                        />
                        <NavMenu pages={pages} />
                    </div>
                </div>

                <div className="pt-6 mt-auto">
                    <ThemeToggle />
                </div>
            </div>
        </aside>
    );
}
