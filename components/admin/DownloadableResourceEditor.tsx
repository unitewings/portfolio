"use client";

import { useState } from "react";
import { Button } from "@/components/shared/ui/button";
import { Label } from "@/components/ui/label";
import { BlogPost } from "@/types";
import { createPost, updatePost, uploadFile } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DownloadableResourceEditorProps {
    initialData?: BlogPost;
}

export default function DownloadableResourceEditor({ initialData }: DownloadableResourceEditorProps) {
    const router = useRouter();
    const [title, setTitle] = useState(initialData?.title || "");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [requireEmail, setRequireEmail] = useState(true);

    // UI state for fake upload
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploaded, setIsUploaded] = useState(false);
    const [fileName, setFileName] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [isSaving, setIsSaving] = useState(false);
    const isEditing = !!initialData;

    const handleSave = async (formData: FormData) => {
        setIsSaving(true);
        // 1. Get uploaded file URL
        const finalFileUrl = uploadedFileUrl;

        if (!finalFileUrl) {
            toast.error("Please upload a file first.");
            setIsSaving(false);
            return;
        }

        // 2. Build JSON content for downloadable resource specific fields
        const contentData = {
            category,
            fileUrl: finalFileUrl,
            coverImage: "/sample-cover.jpg"
        };
        formData.append("content", JSON.stringify(contentData));
        formData.append("excerpt", description);
        formData.append("type", "downloadable");
        formData.append("isListed", "on");

        if (requireEmail) {
            formData.append("isProtected", "on");
        }

        try {
            if (isEditing && initialData.id) {
                formData.append("id", initialData.id);
                formData.append("slug", initialData.slug);
                await updatePost(formData);
                toast.success("Downloadable resource updated successfully!");
            } else {
                await createPost(formData);
                toast.success("Downloadable resource published successfully!");
            }
            router.push("/admin/posts");
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save downloadable resource.");
        } finally {
            setIsSaving(false);
        }
    };

    const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(
        initialData?.content ? JSON.parse(initialData.content).fileUrl : null
    );

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileName(file.name);
            setSelectedFile(file);
            setUploadProgress(0);
            setIsUploaded(false);

            // Start simulated progress for UX while uploading
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += 5;
                if (progress <= 90) {
                    setUploadProgress(progress);
                }
            }, 100);

            const fileData = new FormData();
            fileData.append("file", file);

            try {
                const uploadResult = await uploadFile(fileData);
                clearInterval(progressInterval);

                if (uploadResult.success && uploadResult.url) {
                    setUploadProgress(100);
                    setIsUploaded(true);
                    setUploadedFileUrl(uploadResult.url);
                    toast.success("File uploaded successfully.");
                } else {
                    toast.error(uploadResult.message || "Failed to upload file");
                    setUploadProgress(0);
                    setFileName("");
                    setSelectedFile(null);
                }
            } catch (error) {
                clearInterval(progressInterval);
                toast.error("An error occurred during upload");
                setUploadProgress(0);
                setFileName("");
                setSelectedFile(null);
            }
        }
    };

    return (
        <form action={handleSave} className="max-w-[1200px] mx-auto space-y-6 pb-20">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Left Column: File Assets & Description */}
                <div className="space-y-6">

                    {/* File Assets */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm relative">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-primary">upload_file</span>
                            <h2 className="font-display font-bold text-gray-900 dark:text-white text-lg">File Assets</h2>
                        </div>

                        <div className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl p-10 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group relative mb-6">
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                onChange={handleFileChange}
                            />

                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform">
                                <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                            </div>

                            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Drop your file here</h3>
                            <p className="text-sm text-muted-light dark:text-muted-dark mb-6">
                                Support for ZIP, PDF, XLSX, and PNG (Max 50MB)
                            </p>

                            <Button variant="outline" className="rounded-full px-6 bg-gray-100 dark:bg-gray-800 border-none hover:bg-gray-200 dark:hover:bg-gray-700 shadow-none pointer-events-none text-gray-700 dark:text-gray-300">
                                Select Files
                            </Button>
                        </div>

                        {/* Progress Bar (Visible during upload or fake uploaded state) */}
                        {(uploadProgress > 0 || isUploaded) && (
                            <div className="flex items-center justify-between text-sm py-2">
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                    <span className="material-symbols-outlined text-primary text-[18px]">insert_drive_file</span>
                                    <span className="font-medium truncate max-w-[200px]">{fileName}</span>
                                </div>
                                <span className="text-primary font-bold">{isUploaded ? '100%' : `${uploadProgress}%`}</span>
                            </div>
                        )}
                        {(uploadProgress > 0 || isUploaded) && (
                            <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full mt-2 overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all duration-200"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        )}
                    </div>

                    {/* Resource Description */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h2 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-4">Resource Description</h2>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Briefly describe the value this resource provides..."
                            className="w-full h-32 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none text-gray-900 dark:text-white text-sm"
                        />
                    </div>

                </div>

                {/* Right Column: Name, Category, Gates */}
                <div className="space-y-6">

                    {/* Resource Name */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                        <h2 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-4">Resource Name</h2>
                        <input
                            type="text"
                            name="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. 2024 Product Management Framework"
                            required
                            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 mb-3 focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white text-sm"
                        />
                        <p className="text-xs text-muted-light dark:text-muted-dark">
                            This title will be displayed as the main header on the resource page.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Category */}
                        <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                            <h2 className="font-display font-bold text-gray-900 dark:text-white text-lg mb-4">Category</h2>
                            <div className="relative">
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl pl-4 pr-10 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-gray-900 dark:text-white text-sm"
                                >
                                    <option value="">Select Category</option>
                                    <option value="frameworks">Frameworks & Templates</option>
                                    <option value="research">Research Data</option>
                                    <option value="tools">Tools & Planners</option>
                                    <option value="guides">Quick Guides</option>
                                </select>
                                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">
                                    keyboard_arrow_down
                                </span>
                            </div>
                        </div>

                        <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-display font-bold text-gray-900 dark:text-white text-lg">Gated Content</h2>
                                {/* iOS style toggle */}
                                <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${requireEmail ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                                    onClick={() => setRequireEmail(!requireEmail)}
                                >
                                    <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${requireEmail ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setRequireEmail(true)}>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${requireEmail ? 'border-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                                        {requireEmail && <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>}
                                    </div>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Email Signup Required</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            <input type="hidden" name="status" value="published" id="statusInput" />

            {/* Bottom Form Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between bg-surface-light dark:bg-surface-dark p-4 md:p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm sticky bottom-6 z-40 gap-4">
                <div className="flex items-center gap-3 text-sm text-muted-light dark:text-muted-dark w-full sm:w-auto">
                    <span className="material-symbols-outlined text-[20px] bg-gray-100 dark:bg-gray-800 rounded-full p-1 text-gray-500 shrink-0">info</span>
                    <span className="text-xs sm:text-sm">Once uploaded, the resource will be available for public/gated access immediately.</span>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                    <Button type="submit" onClick={() => {
                        const el = document.getElementById('statusInput') as HTMLInputElement;
                        if (el) el.value = 'draft';
                    }} variant="outline" disabled={isSaving} className="flex-1 sm:flex-none rounded-xl px-6 bg-gray-100 dark:bg-gray-800 border-none hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors text-sm font-semibold h-12">
                        Save as Draft
                    </Button>
                    <Button type="submit" onClick={() => {
                        const el = document.getElementById('statusInput') as HTMLInputElement;
                        if (el) el.value = 'published';
                    }} disabled={isSaving} className="flex-1 sm:flex-none rounded-xl px-6 bg-[#EA580C] hover:bg-[#EA580C]/90 text-white shadow-lg shadow-primary/20 flex items-center justify-center gap-2 border-none h-12 text-sm font-bold">
                        {isSaving ? "Saving..." : (isEditing ? "Update Resource" : "Upload & Save")}
                        {!isSaving && <span className="material-symbols-outlined text-lg">upload</span>}
                    </Button>
                </div>
            </div>

        </form>
    );
}
