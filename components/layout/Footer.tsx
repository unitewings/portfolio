import { getSiteSettings } from "@/lib/data";
import { Linkedin, Youtube, Github, Twitter, Instagram, Facebook, Mail, Globe } from "lucide-react";
import Link from "next/link";

export async function Footer() {
    const settings = await getSiteSettings();
    const currentYear = new Date().getFullYear();

    const iconMap: Record<string, any> = {
        linkedin: Linkedin,
        youtube: Youtube,
        github: Github,
        twitter: Twitter,
        instagram: Instagram,
        facebook: Facebook,
        email: Mail,
        website: Globe
    };

    return (
        <footer className="w-full mt-16 border-t pt-8 pb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                <p>
                    &copy; {settings.profileName} {currentYear}
                </p>
                <div className="flex gap-4">
                    {(settings.socialLinks || []).map((link, idx) => {
                        const networkKey = link.network?.toLowerCase() || "website";
                        const Icon = iconMap[networkKey] || Globe;
                        return (
                            <Link
                                key={idx}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors hover-lift"
                                title={link.network}
                            >
                                <Icon size={20} />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </footer>
    );
}
