import { getSiteSettings } from "@/lib/data";
import { ContactForm } from "@/components/contact/ContactForm";
import { MDXRenderer } from "@/components/shared/MDXRenderer";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings();
    return {
        title: `Contact | ${settings.globalTitle}`,
        description: `Contact ${settings.profileName} - ${settings.globalDescription}`,
    };
}

export default async function ContactPage() {
    const settings = await getSiteSettings();

    return (
        <div className="mx-auto max-w-2xl py-12 space-y-12 animate-in fade-in duration-500">
            <div className="space-y-6 text-center">
                <h1 className="text-4xl font-bold tracking-tight">Contact</h1>
                <div className="mx-auto max-w-xl text-lg text-muted-foreground">
                    <MDXRenderer content={settings.contactIntro || "Get in touch"} />
                </div>
            </div>

            <div className="bg-card border rounded-xl p-6 md:p-10 shadow-sm">
                <ContactForm />
            </div>

            {settings.contactEmail && (
                <div className="text-center text-sm text-muted-foreground">
                    <p>Or email directly at:</p>
                    <a href={`mailto:${settings.contactEmail}`} className="font-medium text-primary hover:underline">
                        {settings.contactEmail}
                    </a>
                </div>
            )}
        </div>
    );
}
