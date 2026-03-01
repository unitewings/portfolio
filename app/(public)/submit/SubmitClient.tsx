"use client";

import { useState } from "react";
import { submitCommunityContent } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SubmitClient({ categories = [] }: { categories?: string[] }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.currentTarget);
            const result = await submitCommunityContent(formData);

            if (result.success) {
                toast.success(result.message);
                router.push("/");
            } else {
                toast.error(result.message || "Failed to submit content");
            }
        } catch (error) {
            toast.error("An error occurred during submission");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
            {/* Header Bento Tile */}
            <div className="mb-6 rounded-3xl bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-700 p-8 md:p-12 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-primary/20"></div>
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-gray-900 dark:text-white text-4xl md:text-5xl font-black tracking-tight mb-4 font-display">Share Your Knowledge</h1>
                    <p className="text-muted-light dark:text-muted-dark text-lg md:text-xl font-normal leading-relaxed">
                        Contribute to the mission of upskilling 10,000 students. Submit your articles, case studies, or guides to empower the next generation of leaders.
                    </p>
                </div>
                <div className="absolute bottom-4 right-4 md:bottom-8 md:right-12 hidden md:block">
                    <span className="material-icons-round text-9xl text-primary/10 rotate-12 select-none">edit_document</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Guidelines Tile (Left Side on Desktop) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="rounded-3xl bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-700 p-6 shadow-sm h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-primary">
                                <span className="material-icons-round">gavel</span>
                            </div>
                            <h3 className="text-gray-900 dark:text-white text-xl font-bold font-display">Submission Guidelines</h3>
                        </div>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <span className="material-icons-round text-primary mt-1 shrink-0">check_circle</span>
                                <div>
                                    <p className="text-gray-900 dark:text-white font-semibold">Original Content</p>
                                    <p className="text-muted-light dark:text-muted-dark text-sm mt-1">Submissions must be 100% original work. Plagiarism is strictly prohibited.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <span className="material-icons-round text-primary mt-1 shrink-0">topic</span>
                                <div>
                                    <p className="text-gray-900 dark:text-white font-semibold">Relevance</p>
                                    <p className="text-muted-light dark:text-muted-dark text-sm mt-1">Topics should align with community interests: Tech, Design, Business, or Leadership.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <span className="material-icons-round text-primary mt-1 shrink-0">format_quote</span>
                                <div>
                                    <p className="text-gray-900 dark:text-white font-semibold">Sources &amp; Citations</p>
                                    <p className="text-muted-light dark:text-muted-dark text-sm mt-1">Please cite all data sources and references used in your content.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <span className="material-icons-round text-primary mt-1 shrink-0">image</span>
                                <div>
                                    <p className="text-gray-900 dark:text-white font-semibold">Media Quality</p>
                                    <p className="text-muted-light dark:text-muted-dark text-sm mt-1">Images should be high resolution. We recommend cover images of 1200x630px.</p>
                                </div>
                            </li>
                        </ul>
                        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                            <p className="text-xs text-muted-light dark:text-muted-dark font-medium leading-relaxed">
                                <span className="material-icons-round text-base align-middle mr-1">info</span>
                                Need help? Contact our editorial team at <a className="text-primary hover:underline" href="mailto:support@unitewings.com">support@unitewings.com</a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Submission Form (Right Side/Main) */}
                <div className="lg:col-span-8">
                    <div className="rounded-3xl bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-700 p-6 md:p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-gray-900 dark:text-white text-2xl font-bold font-display">Content Details</h3>
                            <span className="text-sm px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium tracking-wide">Open for submissions</span>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Author & Email Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-900 dark:text-white text-sm font-semibold" htmlFor="authorName">Author Name</label>
                                    <div className="relative">
                                        <input
                                            required
                                            className="w-full h-12 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 pl-11 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                            id="authorName"
                                            name="authorName"
                                            placeholder="Enter your full name"
                                            type="text"
                                        />
                                        <span className="material-icons-round absolute left-3 top-3.5 text-gray-400 text-xl">person</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-900 dark:text-white text-sm font-semibold" htmlFor="email">Email Address</label>
                                    <div className="relative">
                                        <input
                                            required
                                            className="w-full h-12 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 pl-11 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                            id="email"
                                            name="email"
                                            placeholder="you@example.com"
                                            type="email"
                                        />
                                        <span className="material-icons-round absolute left-3 top-3.5 text-gray-400 text-xl">mail</span>
                                    </div>
                                </div>
                            </div>

                            {/* Category Selection */}
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-900 dark:text-white text-sm font-semibold">Content Category</label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {categories.map((category, idx) => (
                                        <label key={idx} className="cursor-pointer">
                                            <input defaultChecked={idx === 0} className="peer sr-only" name="category" type="radio" value={category} />
                                            <div className="flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 peer-checked:bg-orange-50 dark:peer-checked:bg-orange-900/20 peer-checked:border-primary peer-checked:text-primary transition-all hover:border-gray-300 dark:hover:border-gray-600">
                                                <span className="text-sm font-bold">{category}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Title */}
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-900 dark:text-white text-sm font-semibold" htmlFor="title">Submission Title</label>
                                <input
                                    required
                                    className="w-full h-12 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                    id="title"
                                    name="title"
                                    placeholder="Enter a catchy title for your content"
                                    type="text"
                                />
                            </div>

                            {/* File Upload (Optional) */}
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-900 dark:text-white text-sm font-semibold" htmlFor="file">Upload Document (Optional)</label>
                                <input
                                    className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all cursor-pointer"
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept=".pdf,.docx,.txt,.ppt,.pptx"
                                />
                                <p className="text-xs text-muted-light dark:text-muted-dark">Supported formats: PDF, DOCX, TXT, PPT, PPTX. (Max 10MB recommended)</p>
                            </div>

                            {/* Content Body */}
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-900 dark:text-white text-sm font-semibold">Content Body</label>
                                <div className="relative w-full">
                                    <textarea
                                        required
                                        name="content"
                                        className="w-full rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-y"
                                        placeholder="Write your content here or paste from your editor..."
                                        rows={8}
                                    />
                                    <p className="text-xs text-muted-light dark:text-muted-dark mt-2">You can use Markdown syntax to format your content.</p>
                                </div>
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-4">
                                <button
                                    disabled={isSubmitting}
                                    className="px-8 py-3 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-orange-500/20 hover:bg-orange-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    type="submit"
                                >
                                    <span>{isSubmitting ? 'Submitting...' : 'Submit for Review'}</span>
                                    {!isSubmitting && <span className="material-icons-round text-lg">send</span>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
