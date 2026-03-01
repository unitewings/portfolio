"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BlogPost } from "@/types";
import { createPost, updatePost } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CaseStudyEditorProps {
    initialData?: BlogPost;
}

export default function CaseStudyEditor({ initialData }: CaseStudyEditorProps) {
    const router = useRouter();
    const [title, setTitle] = useState(initialData?.title || "");
    const [industry, setIndustry] = useState("");
    const [challenge, setChallenge] = useState("");
    const [solution, setSolution] = useState("");
    const [metrics, setMetrics] = useState([{ name: "", value: "" }]);
    const [testimonial, setTestimonial] = useState("");
    const [clientName, setClientName] = useState("");
    const [tags, setTags] = useState<string[]>(initialData?.tags || []);
    const [currentTag, setCurrentTag] = useState("");

    // Auto-save time simulation removed due to being unused

    const addMetric = () => {
        setMetrics([...metrics, { name: "", value: "" }]);
    };

    const updateMetric = (index: number, field: 'name' | 'value', value: string) => {
        const newMetrics = [...metrics];
        newMetrics[index][field] = value;
        setMetrics(newMetrics);
    };

    const removeMetric = (index: number) => {
        const newMetrics = [...metrics];
        newMetrics.splice(index, 1);
        setMetrics(newMetrics);
    };

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && currentTag.trim()) {
            e.preventDefault();
            if (!tags.includes(currentTag.trim())) {
                setTags([...tags, currentTag.trim()]);
            }
            setCurrentTag("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const [isSaving, setIsSaving] = useState(false);
    const isEditing = !!initialData;

    const handleSave = async (formData: FormData) => {
        setIsSaving(true);

        // Build JSON content for case study specific fields
        const contentData = {
            industry,
            challenge,
            solution,
            metrics,
            testimonial,
            clientName
        };
        formData.append("content", JSON.stringify(contentData));
        formData.append("excerpt", `Case study on ${title} for the ${industry} industry.`);
        formData.append("tags", tags.join(","));
        formData.append("type", "case_study");

        try {
            if (isEditing && initialData.id) {
                formData.append("id", initialData.id);
                formData.append("slug", initialData.slug);
                await updatePost(formData);
                toast.success("Case study updated successfully!");
            } else {
                await createPost(formData);
                toast.success("Case study published successfully!");
            }
            router.push("/admin/posts");
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save case study.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form action={handleSave} className="max-w-[1200px] mx-auto space-y-6">

            {/* Top Row: Project Name and Industry */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="space-y-3">
                    <Label className="text-xs font-bold text-muted-light dark:text-muted-dark uppercase tracking-wider">Project Name</Label>
                    <input
                        name="title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., HR Analytics Dashboard Transformation"
                        required
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                    />
                </div>
                <div className="space-y-3">
                    <Label className="text-xs font-bold text-muted-light dark:text-muted-dark uppercase tracking-wider">Industry</Label>
                    <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white appearance-none"
                    >
                        <option value="">Select Industry...</option>
                        <option value="fintech">FinTech & Digital Banking</option>
                        <option value="healthcare">Healthcare & Life Sciences</option>
                        <option value="retail">Retail & E-commerce</option>
                        <option value="saas">SaaS & Enterprise Software</option>
                        <option value="education">EdTech & Learning</option>
                    </select>
                </div>
            </div>

            {/* Middle Row: Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* The Challenge */}
                <div className="col-span-1 bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col min-h-[400px]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
                            <span className="material-symbols-outlined">target</span>
                        </div>
                        <h3 className="font-display font-bold text-gray-900 dark:text-white">The Challenge</h3>
                    </div>
                    <textarea
                        value={challenge}
                        onChange={(e) => setChallenge(e.target.value)}
                        placeholder="Describe the problem, pain points, and business context..."
                        className="flex-1 w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-gray-900 dark:text-white text-sm"
                    />
                </div>

                {/* The Solution */}
                <div className="col-span-1 bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col min-h-[400px]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500">
                            <span className="material-symbols-outlined">lightbulb</span>
                        </div>
                        <h3 className="font-display font-bold text-gray-900 dark:text-white">The Solution</h3>
                    </div>
                    <textarea
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                        placeholder="Outline the design process, technical architecture, and key features..."
                        className="flex-1 w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-gray-900 dark:text-white text-sm"
                    />
                </div>

                {/* Key Results */}
                <div className="col-span-1 bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col min-h-[400px]">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
                            <span className="material-symbols-outlined">trending_up</span>
                        </div>
                        <h3 className="font-display font-bold text-gray-900 dark:text-white">Key Results</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {metrics.map((metric, index) => (
                            <div key={index} className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Metric (e.g., Conv. Rate)"
                                    value={metric.name}
                                    onChange={(e) => updateMetric(index, 'name', e.target.value)}
                                    className="w-[60%] bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                                />
                                <div className="relative w-[40%]">
                                    <input
                                        type="text"
                                        placeholder="Value (e.g., +40%)"
                                        value={metric.value}
                                        onChange={(e) => updateMetric(index, 'value', e.target.value)}
                                        className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                                    />
                                    {metrics.length > 1 && (
                                        <button
                                            onClick={() => removeMetric(index)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                                        >
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={addMetric}
                            className="w-full py-3 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-muted-light dark:text-muted-dark hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-primary transition-colors flex justify-center items-center gap-2"
                        >
                            <span>+ Add Metric</span>
                        </button>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <textarea
                            placeholder="Briefly summarize the quantitative impact..."
                            className="w-full h-20 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-gray-900 dark:text-white text-xs"
                        />
                    </div>
                </div>

                {/* Right Column: Feedback & Tech Stack */}
                <div className="col-span-1 flex flex-col gap-6">
                    {/* Client Feedback */}
                    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex-1 flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
                                <span className="material-symbols-outlined">format_quote</span>
                            </div>
                            <h3 className="font-display font-bold text-gray-900 dark:text-white">Client Feedback</h3>
                        </div>
                        <textarea
                            value={testimonial}
                            onChange={(e) => setTestimonial(e.target.value)}
                            placeholder="Enter testimonial text..."
                            className="flex-1 w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-gray-900 dark:text-white text-sm"
                        />
                        <input
                            type="text"
                            value={clientName}
                            onChange={(e) => setClientName(e.target.value)}
                            placeholder="Client Name & Role"
                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Tech Stack */}
                    <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600">
                                <span className="material-symbols-outlined">terminal</span>
                            </div>
                            <h3 className="font-display font-bold text-gray-900 dark:text-white">Tech Stack</h3>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            {tags.map((tag, index) => (
                                <span key={index} className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-semibold">
                                    {tag}
                                    <button onClick={() => removeTag(tag)} className="hover:text-red-500 focus:outline-none">
                                        <span className="material-symbols-outlined text-[14px]">close</span>
                                    </button>
                                </span>
                            ))}
                        </div>

                        <div className="relative">
                            <input
                                type="text"
                                value={currentTag}
                                onChange={(e) => setCurrentTag(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder="Add tool... (press Enter)"
                                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                            />
                            <button
                                type="button"
                                onClick={() => handleAddTag({ key: 'Enter', preventDefault: () => { } } as unknown as React.KeyboardEvent<HTMLInputElement>)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[14px]">add</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            <input type="hidden" name="status" value="published" id="statusInput" />

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-4 text-sm text-muted-light dark:text-muted-dark">
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        Preview Mode
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <Button type="submit" onClick={() => {
                        const el = document.getElementById('statusInput') as HTMLInputElement;
                        if (el) el.value = 'draft';
                    }} variant="outline" disabled={isSaving} className="rounded-full px-6 bg-transparent border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-white border-none shadow-sm hover:shadow-md transition-shadow">
                        Save as Draft
                    </Button>
                    <Button type="submit" onClick={() => {
                        const el = document.getElementById('statusInput') as HTMLInputElement;
                        if (el) el.value = 'published';
                    }} disabled={isSaving} className="rounded-full px-6 bg-[#EA580C] hover:bg-[#EA580C]/90 text-white shadow-lg shadow-primary/20 flex items-center gap-2 border-none">
                        <span className="material-symbols-outlined text-sm">upload</span>
                        {isSaving ? "Saving..." : (isEditing ? "Update Case Study" : "Save Case Study")}
                    </Button>
                </div>
            </div>

        </form>
    );
}
