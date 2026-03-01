"use client";

import Link from "next/link";
import { useTransition, useState } from "react";
import { subscribe } from "@/lib/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SharedFooter() {
    const [isPending, startTransition] = useTransition();
    const [subbed, setSubbed] = useState(false);

    const handleSubmit = (formData: FormData) => {
        startTransition(async () => {
            const result = await subscribe(formData);
            if (result.success) {
                toast.success(result.message);
                setSubbed(true);
            } else {
                toast.error(result.message);
            }
        });
    };

    return (
        <footer className="bg-surface-light dark:bg-surface-dark rounded-3xl p-8 md:p-12 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 relative z-10 w-full">

                {/* Newsletter Section */}
                <div className="col-span-1 md:col-span-2 lg:col-span-6 flex flex-col justify-between space-y-8">
                    <div>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-primary text-xs font-bold mb-4 uppercase tracking-wider">
                            Weekly Digest
                        </div>
                        <h3 className="font-display text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
                            Join 5000+ subscribers for <span className="text-primary">AI &amp; HR insights</span>
                        </h3>
                        <p className="text-lg text-muted-light dark:text-muted-dark leading-relaxed">
                            Stay ahead of the curve with actionable strategies and latest trends delivered straight to your inbox.
                        </p>
                    </div>

                    {subbed ? (
                        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-6 rounded-2xl border border-green-200 dark:border-green-800 flex items-center shadow-inner">
                            <span className="material-icons-round text-3xl mr-4 flex-shrink-0">check_circle</span>
                            <div>
                                <p className="font-bold text-lg mb-1">You&apos;re subscribed!</p>
                                <p className="text-sm">Keep an eye on your inbox for the next update.</p>
                            </div>
                        </div>
                    ) : (
                        <form action={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                            {/* We only collect email for the footer quick-subscribe as per the design */}
                            <input
                                className="flex-1 px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all w-full"
                                placeholder="Enter your email address"
                                type="email"
                                name="email"
                                required
                            />
                            {/* Pass a dummy name explicitly required by subscribe action */}
                            <input type="hidden" name="name" value="Quick Subscriber" />

                            <button
                                disabled={isPending}
                                className="w-full sm:w-auto bg-primary hover:bg-orange-700 text-white font-bold text-lg py-4 px-8 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center group disabled:opacity-50 disabled:hover:translate-y-0"
                                type="submit"
                            >
                                {isPending ? <Loader2 className="h-6 w-6 animate-spin mr-2" /> : null}
                                {isPending ? "Joining..." : "Subscribe"}
                                {!isPending && <span className="material-icons-round ml-2 group-hover:translate-x-1 transition-transform">arrow_forward</span>}
                            </button>
                        </form>
                    )}
                </div>

                {/* Quick Links */}
                <div className="col-span-1 md:col-span-1 lg:col-span-2 lg:col-start-8 pt-4">
                    <h4 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Links</h4>
                    <ul className="space-y-4">
                        <li>
                            <Link className="text-muted-light dark:text-muted-dark hover:text-primary dark:hover:text-primary transition-colors font-medium flex items-center group" href="/">
                                Home
                                <span className="material-icons-round text-sm ml-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">arrow_forward</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="text-muted-light dark:text-muted-dark hover:text-primary dark:hover:text-primary transition-colors font-medium flex items-center group" href="/resume">
                                Resume
                                <span className="material-icons-round text-sm ml-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">arrow_forward</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="text-muted-light dark:text-muted-dark hover:text-primary dark:hover:text-primary transition-colors font-medium flex items-center group" href="/resources">
                                Resources
                                <span className="material-icons-round text-sm ml-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">arrow_forward</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="text-muted-light dark:text-muted-dark hover:text-primary dark:hover:text-primary transition-colors font-medium flex items-center group" href="/submit">
                                Submit Content
                                <span className="material-icons-round text-sm ml-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">arrow_forward</span>
                            </Link>
                        </li>
                        <li>
                            <Link className="text-muted-light dark:text-muted-dark hover:text-primary dark:hover:text-primary transition-colors font-medium flex items-center group" href="/contact">
                                Contact
                                <span className="material-icons-round text-sm ml-1 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">arrow_forward</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Follow & Contact */}
                <div className="col-span-1 md:col-span-1 lg:col-span-3 lg:col-start-10 pt-4">
                    <h4 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-6">Follow Me</h4>
                    <div className="grid grid-cols-3 gap-3">
                        <a className="aspect-square rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#0077b5] hover:text-white transition-all group" href="https://linkedin.com/in/swarn-shauryam" target="_blank" rel="noopener noreferrer">
                            <svg className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path></svg>
                        </a>
                        <a className="aspect-square rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#E1306C] hover:text-white transition-all group" href="https://www.instagram.com/ajai.swarn/" target="_blank" rel="noopener noreferrer">
                            <svg className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
                        </a>
                        <a className="aspect-square rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#FF0000] hover:text-white transition-all group" href="https://www.youtube.com/@ajaiswarn" target="_blank" rel="noopener noreferrer">
                            <svg className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path></svg>
                        </a>
                    </div>
                    <a className="mt-6 inline-flex items-center text-sm font-bold text-gray-900 dark:text-white hover:text-primary transition-colors" href="mailto:swarn@unitewings.com">
                        <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-3 text-white shadow-sm">
                            <span className="material-icons-round text-sm">email</span>
                        </span>
                        swarn@unitewings.com
                    </a>
                </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-light dark:text-muted-dark relative z-10 w-full">
                <p>© {new Date().getFullYear()} Swarn Shauryam. All rights reserved.</p>
                <button
                    className="mt-4 md:mt-0 flex items-center bg-gray-100 dark:bg-gray-800 hover:bg-primary hover:text-white px-4 py-2 rounded-full transition-all group pointer-events-auto"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    Back to top
                    <span className="material-icons-round ml-1 group-hover:-translate-y-1 transition-transform">arrow_upward</span>
                </button>
            </div>
        </footer>
    );
}
