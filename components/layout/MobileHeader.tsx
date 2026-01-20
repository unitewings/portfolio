
import { getSiteSettings } from "@/lib/data";

import { Logo } from "@/components/ui/Logo";
import Link from "next/link";

export async function MobileHeader() {
    const settings = await getSiteSettings();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-center border-b bg-background/80 px-4 backdrop-blur-md md:hidden">
            <div className="w-[120px] pt-1">
                <Logo />
            </div>
        </header>
    );
}
