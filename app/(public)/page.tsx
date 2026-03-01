import { getSiteSettings } from "@/lib/data";
import { MDXRenderer } from "@/components/shared/MDXRenderer";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import Link from "next/link";
import { ReactionWidget } from "@/components/public/ReactionWidget";

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
    return (
        <>
            <main className="bento-grid">
                <div className="hero-tile tile bg-surface-light dark:bg-surface-dark p-8 md:p-16 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl text-center md:text-left">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
                            <span className="relative flex h-2 w-2 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Let’s collaborate!
                        </div>
                        <h1 className="font-display text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-gray-900 dark:text-white">
                            Hi, I am Swarn <br />
                            <span className="text-primary">AI &amp; HR Learner</span> <br />
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-light dark:text-muted-dark mb-0 max-w-xl leading-relaxed">
                            My goal for 2026 is to help 10,000 students learn the actual skills they need to get hired.
                        </p>
                    </div>
                    <div className="relative mt-12 md:mt-0 w-full md:w-1/3 flex justify-center md:justify-end">
                        <div className="relative w-64 h-64 md:w-96 md:h-96">
                            <img alt="Abstract Portrait of Swarn Shauryam" className="w-full h-full object-cover rounded-3xl shadow-2xl relative z-10" src="https://res.cloudinary.com/dq8rnfy2w/image/upload/v1772210106/zbsd2v0vrp4n34aeojwg.jpg" />
                            <div className="absolute -top-10 -right-10 bg-primary/20 w-48 h-48 rounded-full blur-3xl"></div>
                            <div className="absolute -bottom-10 -left-10 bg-blue-500/20 w-48 h-48 rounded-full blur-3xl"></div>
                        </div>
                    </div>
                </div>

                <div className="experience-tile tile bg-surface-light dark:bg-surface-dark p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Experience Timeline</h3>
                        <span className="material-icons-round text-primary text-3xl">timeline</span>
                    </div>
                    <div className="flex flex-col space-y-4 flex-grow justify-center">
                        <div className="group flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700 cursor-default">
                            <div className="flex items-start space-x-5">
                                <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-primary shrink-0">
                                    <span className="material-icons-round text-2xl">work</span>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">Program Coordinator</h4>
                                    <p className="text-base text-muted-light dark:text-muted-dark mt-1">TBI-GEU • Oct 2025 - Present</p>
                                </div>
                            </div>
                        </div>
                        <div className="h-px bg-gray-100 dark:bg-gray-700 w-full"></div>
                        <div className="group flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700 cursor-default">
                            <div className="flex items-start space-x-5">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0">
                                    <span className="material-icons-round text-2xl">corporate_fare</span>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">HR Analyst</h4>
                                    <p className="text-base text-muted-light dark:text-muted-dark mt-1">KPMG • Nov 2024 - Oct 2025</p>
                                </div>
                            </div>
                        </div>
                        <div className="h-px bg-gray-100 dark:bg-gray-700 w-full"></div>
                        <div className="group flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700 cursor-default">
                            <div className="flex items-start space-x-5">
                                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 shrink-0">
                                    <span className="material-icons-round text-2xl">school</span>
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">BBA</h4>
                                    <p className="text-base text-muted-light dark:text-muted-dark mt-1">Graphic Era Hill University • 2021 - 2024</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Link href="/resume" className="mt-6 flex items-center justify-center gap-2 bg-primary hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-2xl transition-all shadow-lg shadow-orange-500/20">
                        <span className="material-icons-round text-sm">description</span>
                        View Resume
                    </Link>
                </div>

                <Link href="/resources" className="project-tile tile relative rounded-3xl overflow-hidden shadow-sm group block">
                    <img alt="From the desk of Swarn" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDhoIUFXGCLCJ2zIloJ4xnI8tf29Bqyc-NJUr3UyUqVncL3FMv0zh8HtPGtz0xJN2_d0zea5DwkKl0oZPK4BDkUUslVTov6nonVHMT1y4220qcRj4CmEPCh_87KqtTCMkyhLOEaBFGMNX8ZuLZxsXhdJFN2a3VbOIisqssVBZgCWGy9CZYQPW7lT13ThvDSMxBvV5gK5qJyvC6xLumXv-YzczQsVT18gAM8hx2YxNR1Z2GvNSdmeNE-rIsDyIWlflt-ZcSyWaIgstyh" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-10">
                        <span className="text-sm font-bold text-primary tracking-widest uppercase mb-3 block">Resources</span>
                        <h3 className="text-white text-4xl font-extrabold mb-6 leading-tight">From the desk of<br />Swarn Shauryam Swarnkar</h3>
                        <div className="bg-white group-hover:bg-primary group-hover:text-white text-gray-900 text-sm font-bold py-4 px-8 rounded-2xl transition-all flex items-center w-fit shadow-xl">
                            Read Articles
                            <span className="material-icons-round ml-2 text-sm">arrow_forward</span>
                        </div>
                    </div>
                </Link>

                <div className="expertise-tile tile bg-surface-light dark:bg-surface-dark p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
                    <h3 className="font-display text-2xl font-bold mb-8 text-gray-900 dark:text-white flex items-center">
                        <span className="material-icons-round mr-3 text-primary">auto_awesome</span>
                        Core Expertise
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-5 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 transition hover:border-primary/50">
                            <span className="material-icons-round text-blue-500">psychology</span>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">AI Strategy</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-5 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 transition hover:border-primary/50">
                            <span className="material-icons-round text-green-500">groups</span>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">HR Tech</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-5 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 transition hover:border-primary/50">
                            <span className="material-icons-round text-purple-500">auto_graph</span>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Analytics</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-5 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 transition hover:border-primary/50">
                            <span className="material-icons-round text-yellow-500">lightbulb</span>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Leadership</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-5 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 transition hover:border-primary/50">
                            <span className="material-icons-round text-cyan-500">code</span>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Python</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-5 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 transition hover:border-primary/50">
                            <span className="material-icons-round text-indigo-500">storage</span>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">SQL</span>
                        </div>
                    </div>
                </div>

                <Link href="/submit" className="flex-1 connections-tile tile bg-[#171515] dark:bg-[#0d1117] hover:bg-[#201d1d] dark:hover:bg-[#1a212c] transition-colors p-8 md:p-10 rounded-3xl shadow-sm text-white flex flex-col justify-between overflow-hidden relative group block">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -mr-32 -mt-32 blur-3xl transition-all group-hover:bg-primary/20"></div>
                    <div className="flex justify-between items-start relative z-10 w-full mb-8">
                        <div>
                            <span className="text-xs font-bold text-primary tracking-widest uppercase mb-2 block">Upskill 10k Pledge</span>
                            <h3 className="font-display text-2xl md:text-3xl font-extrabold leading-tight">Write for the Mission</h3>
                        </div>
                        <span className="material-icons-round text-3xl text-primary/80 group-hover:text-primary transition-colors hidden sm:block">edit_document</span>
                    </div>
                    <div className="relative z-10 mt-auto">
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                            Join our pledge to upskill 10,000 students. Share your knowledge, publish your guides, and empower the next generation.
                        </p>
                        <div className="bg-white group-hover:bg-primary group-hover:text-white text-gray-900 text-sm font-bold py-3 pr-4 pl-6 rounded-2xl transition-all flex items-center justify-between shadow-xl">
                            <span>Submit Content</span>
                            <span className="material-icons-round ml-2">arrow_forward</span>
                        </div>
                    </div>
                </Link>

            </main>
        </>
    );
}
