import { getSiteSettings } from "@/lib/data";
import { ContactForm } from "@/components/contact/ContactForm";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Contact",
    description: "Contact Swarn Shauryam - Personal portfolio and blog.",
};

export default async function ContactPage() {
    const settings = await getSiteSettings();


    return (
        <>
            <div className="bento-grid lg:grid-flow-row-dense">
                <div className="hero-tile tile bg-surface-light dark:bg-surface-dark p-8 md:p-12 lg:p-16 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl text-center md:text-left">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
                            <span className="relative flex h-2 w-2 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Available for new conversations
                        </div>

                        <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-gray-900 dark:text-white">
                            Let&apos;s <span className="text-primary">Connect</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-muted-light dark:text-muted-dark mb-0 max-w-xl leading-relaxed">
                            Ready to revolutionize your HR strategy with AI? Let&apos;s build the future of work together through innovation and data-driven insights.
                        </p>
                    </div>

                    <div className="relative mt-12 md:mt-0 w-full md:w-1/3 flex justify-center md:justify-end">
                        <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80">
                            <img
                                alt={`Portrait of ${settings.profileName}`}
                                className="w-full h-full object-cover rounded-3xl shadow-2xl relative z-10"
                                src={"https://res.cloudinary.com/dq8rnfy2w/image/upload/v1772210106/zbsd2v0vrp4n34aeojwg.jpg"}
                            />
                            <div className="absolute -top-10 -right-10 bg-primary/20 w-48 h-48 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-10 -left-10 bg-blue-500/20 w-48 h-48 rounded-full blur-3xl"></div>
                        </div>
                    </div>
                </div>

                <div className="contact-form-tile tile bg-surface-light dark:bg-surface-dark p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                    <h3 className="font-display text-3xl font-bold text-gray-900 dark:text-white mb-6">Send a Message</h3>
                    <ContactForm />
                </div>

                <div className="direct-channels-tile tile bg-surface-light dark:bg-surface-dark p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
                    <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <span className="material-icons-round text-primary mr-3">alternate_email</span>
                        Direct Channels
                    </h3>
                    <div className="space-y-4">
                        <a className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 group hover:border-primary/50 transition-all" href={`mailto:${settings.contactEmail}`}>
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                                    <span className="material-icons-round">mail</span>
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider">Email Me</div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">{settings.contactEmail || "swarn@unitewings.com"}</div>
                                </div>
                            </div>
                            <span className="material-icons-round text-gray-400 group-hover:text-primary transition-colors">arrow_outward</span>
                        </a>

                        <a className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 group hover:border-primary/50 transition-all" href="#">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                                    <span className="material-icons-round">calendar_month</span>
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider">Schedule</div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">Book 1:1 Consultation</div>
                                </div>
                            </div>
                            <span className="material-icons-round text-gray-400 group-hover:text-primary transition-colors">arrow_outward</span>
                        </a>
                    </div>
                </div>

                <div className="social-connections-tile tile bg-surface-light dark:bg-surface-dark p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
                    <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                        <span className="material-icons-round text-primary mr-3">share</span>
                        Social Connections
                    </h3>
                    <div className="flex items-center justify-between gap-4">
                        <a className="flex-1 aspect-square rounded-2xl bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-[#0077b5] flex flex-col items-center justify-center transition-all group" href="https://linkedin.com/in/ajaiswarn">
                            <svg className="w-10 h-10 fill-current mb-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path></svg>
                            <span className="text-sm font-bold">LinkedIn</span>
                        </a>
                        <a className="flex-1 aspect-square rounded-2xl bg-[#E1306C]/10 hover:bg-[#E1306C]/20 text-[#E1306C] flex flex-col items-center justify-center transition-all group" href="https://www.instagram.com/ajai.swarn/">
                            <svg className="w-10 h-10 fill-current mb-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                            <span className="text-sm font-bold">Instagram</span>
                        </a>
                        <a className="flex-1 aspect-square rounded-2xl bg-[#FF0000]/10 hover:bg-[#FF0000]/20 text-[#FF0000] flex flex-col items-center justify-center transition-all group" href="https://www.youtube.com/@ajaiswarn">
                            <svg className="w-10 h-10 fill-current mb-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg>
                            <span className="text-sm font-bold">YouTube</span>
                        </a>
                    </div>
                </div>

            </div>
        </>
    );
}
