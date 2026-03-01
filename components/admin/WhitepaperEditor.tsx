"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BlogPost } from "@/types";
import { createPost, updatePost, uploadFile } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface WhitepaperEditorProps {
    initialData?: BlogPost;
}

export default function WhitepaperEditor({ initialData }: WhitepaperEditorProps) {
    const router = useRouter();
    const [title, setTitle] = useState(initialData?.title || "");
    const [author, setAuthor] = useState("Swarn Shauryam"); // Default to current user
    const [version, setVersion] = useState("1.0");
    const [accessControl, setAccessControl] = useState<"public" | "email">("public");
    const [tags, setTags] = useState<string[]>(initialData?.tags || []);
    const [currentTag, setCurrentTag] = useState("");
    const [fileName, setFileName] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Simulate auto-save
    const [lastSaved, setLastSaved] = useState<Date>(new Date());

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
        // Build JSON content
        // 1. Upload File (if one was selected)
        let finalFileUrl = initialData?.content ? JSON.parse(initialData.content).fileUrl : "/sample-whitepaper.pdf";

        if (selectedFile) {
            const fileData = new FormData();
            fileData.append("file", selectedFile);

            try {
                const uploadResult = await uploadFile(fileData);
                if (uploadResult.success && uploadResult.url) {
                    finalFileUrl = uploadResult.url;
                } else {
                    toast.error(uploadResult.message || "Failed to upload file");
                    setIsSaving(false);
                    return;
                }
            } catch (e) {
                toast.error("Failed to upload file");
                setIsSaving(false);
                return;
            }
        }

        // 2. Prepare JSON Content Payload
        const contentData = {
            author,
            version,
            fileUrl: finalFileUrl
        };
        formData.append("content", JSON.stringify(contentData));
        formData.append("excerpt", `Whitepaper by ${author} (v${version})`);
        formData.append("tags", tags.join(","));
        formData.append("type", "whitepaper");

        if (accessControl === "email") {
            formData.append("isProtected", "on");
        }

        try {
            if (isEditing && initialData.id) {
                formData.append("id", initialData.id);
                formData.append("slug", initialData.slug);
                await updatePost(formData);
                toast.success("Whitepaper updated successfully!");
            } else {
                await createPost(formData);
                toast.success("Whitepaper published successfully!");
            }
            router.push("/admin/posts");
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save whitepaper.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setSelectedFile(file);
            setUploadProgress(0);

            // Simulate upload progress for UI (since Server Actions don't support XHR progress yet)
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                setUploadProgress(progress);
                if (progress >= 100) clearInterval(interval);
            }, 50);
        }
    };

    return (
        <form action={handleSave} className="max-w-[1200px] mx-auto space-y-6 pb-20">

            {/* Top Section: File Upload & Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: Drag & Drop PDF */}
                <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                    <div className="w-full h-full border-2 border-dashed border-primary/40 rounded-2xl flex flex-col items-center justify-center space-y-4 p-12 bg-orange-50/50 dark:bg-orange-900/10 transition-colors hover:bg-orange-50 dark:hover:bg-orange-900/20 group cursor-pointer relative mb-4">
                        <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />

                        <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/40 rounded-2xl flex items-center justify-center text-primary mb-2 group-hover:scale-105 transition-transform">
                            <span className="material-symbols-outlined text-4xl">picture_as_pdf</span>
                        </div>

                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white">Drag & Drop PDF</h3>
                            <p className="text-muted-light dark:text-muted-dark max-w-sm">
                                Or click to browse from your computer (Max 50MB)
                            </p>
                        </div>

                        <Button type="button" className="mt-6 bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-base font-semibold shadow-lg shadow-primary/20 flex items-center gap-2 relative z-20 pointer-events-none">
                            <span className="material-symbols-outlined">cloud_upload</span>
                            Choose File
                        </Button>
                    </div>

                    {fileName && (
                        <div className="w-full mt-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between text-sm mb-2">
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <span className="material-symbols-outlined text-primary text-[18px]">insert_drive_file</span>
                                    <span className="font-medium truncate max-w-[300px]">{fileName}</span>
                                </div>
                                <span className="text-primary font-bold">{uploadProgress >= 100 ? 'Complete' : `${uploadProgress}%`}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-200"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: Title & Author */}
                <div className="space-y-6 flex flex-col">

                    {/* Whitepaper Title */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex-1">
                        <Label className="text-xs font-bold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-4 block">Whitepaper Title</Label>
                        <textarea
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. AI-Driven Recruitment Strategies..."
                            required
                            className="w-full h-32 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white resize-none text-lg font-medium placeholder:text-gray-400"
                        />
                    </div>

                    {/* Author Name */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <Label className="text-xs font-bold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-4 block">Author Name</Label>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center shrink-0">
                                {/* Simulated user avatar */}
                                <img src="/avatar-placeholder.png" alt="Author" className="w-full h-full object-cover opacity-80" onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement!.innerHTML = '<span class="material-symbols-outlined text-primary">person</span>';
                                }} />
                            </div>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                className="font-semibold text-gray-900 dark:text-white bg-transparent border-none focus:outline-none w-full"
                            />
                        </div>
                    </div>

                </div>

            </div>

            {/* Bottom Section: Settings */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* Version */}
                <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <Label className="text-xs font-bold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-4 block">Version</Label>
                    <div className="flex items-center gap-2">
                        <span className="text-primary font-bold">v</span>
                        <input
                            type="text"
                            value={version}
                            onChange={(e) => setVersion(e.target.value)}
                            className="w-20 bg-transparent border-none text-xl font-display font-medium text-gray-900 dark:text-white focus:outline-none"
                        />
                    </div>
                </div>

                {/* Access Control */}
                <div className="md:col-span-1 bg-surface-light dark:bg-surface-dark rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <Label className="text-xs font-bold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-4 block">Access Control</Label>

                    <div className="space-y-3">
                        {/* Public Access Option */}
                        <div
                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${accessControl === 'public' ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                            onClick={() => setAccessControl('public')}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`material-symbols-outlined text-xl ${accessControl === 'public' ? 'text-primary' : 'text-gray-400'}`}>public</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">Public Access</span>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${accessControl === 'public' ? 'border-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                                {accessControl === 'public' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                            </div>
                        </div>

                        {/* Email Required Option */}
                        <div className={`border rounded-xl overflow-hidden transition-colors ${accessControl === 'email' ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
                            <div
                                className="flex items-center justify-between p-3 cursor-pointer"
                                onClick={() => setAccessControl('email')}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`material-symbols-outlined text-xl ${accessControl === 'email' ? 'text-primary' : 'text-gray-400'}`}>mail</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">Email Required</span>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${accessControl === 'email' ? 'border-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                                    {accessControl === 'email' && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Primary Keywords */}
                <div className="md:col-span-2 bg-surface-light dark:bg-surface-dark rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col">
                    <Label className="text-xs font-bold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-4 block">Primary Keywords</Label>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {tags.map((tag, index) => (
                            <span key={index} className="inline-flex items-center gap-1 bg-orange-50 dark:bg-orange-900/20 text-primary border border-primary/20 px-3 py-1.5 rounded-full text-xs font-medium">
                                {tag}
                                <button onClick={() => removeTag(tag)} className="hover:text-primary/70 focus:outline-none flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[14px]">close</span>
                                </button>
                            </span>
                        ))}
                    </div>

                    <div className="mt-auto">
                        <input
                            type="text"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            onKeyDown={handleAddTag}
                            placeholder="Add keywords and press enter..."
                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white"
                        />
                    </div>
                </div>

            </div>

            {/* Bottom Form Action Bar */}
            <div className="flex items-center justify-between bg-surface-light dark:bg-surface-dark p-4 md:p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm sticky bottom-6 z-40">
                <div className="flex items-center gap-4 text-sm text-muted-light dark:text-muted-dark">
                    <button className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                        <span className="hidden sm:inline">Preview Draft</span>
                    </button>
                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>
                    <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">save</span>
                        <span className="hidden sm:inline">Auto-saved at {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </span>
                </div>

                <input type="hidden" name="status" value="published" id="statusInput" />

                <div className="flex items-center gap-3">
                    <Button type="submit" onClick={() => {
                        const el = document.getElementById('statusInput') as HTMLInputElement;
                        if (el) el.value = 'draft';
                    }} variant="outline" disabled={isSaving} className="rounded-xl px-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-sm transition-colors text-sm font-semibold h-12">
                        Save as Draft
                    </Button>
                    <Button type="submit" onClick={() => {
                        const el = document.getElementById('statusInput') as HTMLInputElement;
                        if (el) el.value = 'published';
                    }} disabled={isSaving} className="rounded-xl px-6 bg-[#EA580C] hover:bg-[#EA580C]/90 text-white shadow-lg shadow-primary/20 flex items-center gap-2 border-none h-12 text-sm font-bold">
                        {isSaving ? "Saving..." : (isEditing ? "Update & Publish" : "Upload & Publish")}
                        {!isSaving && <span className="material-symbols-outlined text-lg">rocket_launch</span>}
                    </Button>
                </div>
            </div>

        </form>
    );
}
