
import { getSiteSettings } from "@/lib/data";

export async function MobileHeader() {
    const settings = await getSiteSettings();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-center border-b bg-background/80 px-4 backdrop-blur-md md:hidden">
            <h1 className="text-lg font-bold tracking-tight">
                {settings.globalTitle || settings.profileName || "Portfolio"}
            </h1>
        </header>
    );
}
