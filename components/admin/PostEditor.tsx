"use client";

import { createPost, updatePost, uploadFile } from "@/lib/actions";
import { BlogPost } from "@/types";
import { useState } from "react";
import { toast } from "sonner";

interface PostEditorProps {
    initialData?: BlogPost;
    defaultType?: string;
}

export default function PostEditor({ initialData, defaultType = "article" }: PostEditorProps) {
    const isEditing = !!initialData;
    const action = isEditing ? updatePost : createPost;
    const [isProtected, setIsProtected] = useState(initialData?.isProtected || false);
    const [isUploading, setIsUploading] = useState(false);
    const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnailUrl || "");

    return (
        <form action={action}>
            {isEditing && (
                <>
                    <input type="hidden" name="id" value={initialData.id} />
                    <input type="hidden" name="slug" value={initialData.slug} />
                    <input type="hidden" name="date" value={initialData.date} />
                </>
            )}

            <div className="bento-grid">
                {/* Main Editor Tile */}
                <div className="editor-main-tile tile bg-surface-light dark:bg-surface-dark p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                    {/* Title */}
                    <div className="mb-6">
                        <label className="text-sm font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-2 block">Article Title</label>
                        <input
                            name="title"
                            type="text"
                            required
                            defaultValue={initialData?.title}
                            className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-0 p-4 text-2xl font-bold text-gray-900 dark:text-white placeholder-gray-300 focus:ring-2 focus:ring-primary"
                            placeholder="Enter a compelling title…"
                        />
                    </div>

                    {/* Category Type Input - Hidden */}
                    <input type="hidden" name="type" value={defaultType} />

                    {/* Excerpt */}
                    <div className="mb-6">
                        <label className="text-sm font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-2 block">Excerpt</label>
                        <textarea
                            name="excerpt"
                            defaultValue={initialData?.excerpt}
                            className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-0 p-4 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary resize-none h-20"
                            placeholder="Short summary for the feed..."
                        />
                    </div>

                    {/* Content Editor */}
                    <div className="flex-1 flex flex-col">
                        <label className="text-sm font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-2 block">Content Editor</label>
                        <div className="flex items-center gap-1 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-t-2xl border-b border-gray-100 dark:border-gray-700">
                            <button type="button" className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"><span className="font-bold text-sm">B</span></button>
                            <button type="button" className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"><span className="italic text-sm">I</span></button>
                            <button type="button" className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"><span className="material-symbols-outlined text-sm">format_list_bulleted</span></button>
                            <button type="button" className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"><span className="material-symbols-outlined text-sm">link</span></button>
                            <div className="flex-1"></div>
                            <button type="button" className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"><span className="material-symbols-outlined text-sm">image</span></button>
                            <button type="button" className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"><span className="material-symbols-outlined text-sm">code</span></button>
                        </div>
                        <textarea
                            name="content"
                            required
                            defaultValue={initialData?.content}
                            className="flex-1 w-full bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl border-0 p-4 font-mono text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary resize-none min-h-[300px]"
                            placeholder="Start writing your story..."
                        />
                    </div>
                </div>

                {/* Cover Image Tile */}
                <div className="editor-side-tile tile bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h4 className="font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">image</span>
                        Cover Image
                    </h4>

                    <div className="space-y-4">
                        <input
                            type="file"
                            accept="image/svg+xml,image/png,image/jpeg,image/jpg"
                            onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                setIsUploading(true);
                                try {
                                    const formData = new FormData();
                                    formData.append("file", file);

                                    const result = await uploadFile(formData);
                                    if (result.success && result.url) {
                                        setThumbnailUrl(result.url);
                                        toast.success("Cover image uploaded!");
                                    } else {
                                        console.error("Upload failed:", result);
                                        toast.error(result.message || "Failed to upload image.");
                                    }
                                } catch (error) {
                                    console.error("Upload error:", error);
                                    toast.error("An error occurred during upload.");
                                } finally {
                                    setIsUploading(false);
                                }
                            }}
                            className="block w-full text-sm text-gray-500 dark:text-gray-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-primary/10 file:text-primary
                                hover:file:bg-primary/20 transition-colors cursor-pointer"
                            disabled={isUploading}
                        />

                        {isUploading && (
                            <p className="text-xs text-primary animate-pulse">Uploading image...</p>
                        )}

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-light dark:text-muted-dark font-medium uppercase">OR Paste URL:</span>
                        </div>

                        <input
                            name="thumbnailUrl"
                            type="url"
                            value={thumbnailUrl}
                            onChange={(e) => setThumbnailUrl(e.target.value)}
                            className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 p-4 text-sm placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary"
                            placeholder="Paste image URL..."
                        />

                        {(thumbnailUrl || initialData?.thumbnailUrl) && (
                            <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 relative aspect-video">
                                <img
                                    src={thumbnailUrl || initialData?.thumbnailUrl || ""}
                                    alt="Cover preview"
                                    className="object-cover w-full h-full"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                    onLoad={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'block';
                                    }}
                                />
                            </div>
                        )}
                        <p className="text-xs text-muted-light dark:text-muted-dark">SVG, PNG, JPG (max. 5MB)</p>
                    </div>
                </div>

                {/* SEO Settings Tile */}
                <div className="editor-side-tile tile bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h4 className="font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">search</span>
                        SEO Settings
                    </h4>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-1 block">Meta Description</label>
                            <textarea
                                name="seoDescription"
                                defaultValue={initialData?.seoDescription}
                                className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 p-3 text-sm placeholder-gray-400 focus:ring-2 focus:ring-primary resize-none h-20"
                                placeholder="Enter a brief summary for search results..."
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-1 block">Tags</label>
                            <input
                                name="tags"
                                type="text"
                                defaultValue={initialData?.tags?.join(", ")}
                                className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 p-3 text-sm placeholder-gray-400 focus:ring-2 focus:ring-primary"
                                placeholder="Add tags (separated by commas)"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-1 block">SEO Title</label>
                            <input
                                name="seoTitle"
                                type="text"
                                defaultValue={initialData?.seoTitle}
                                className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 p-3 text-sm placeholder-gray-400 focus:ring-2 focus:ring-primary"
                                placeholder="Optimized title for search engines"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-muted-light dark:text-muted-dark uppercase tracking-wider mb-1 block">Canonical URL</label>
                            <input
                                name="canonicalUrl"
                                type="url"
                                defaultValue={initialData?.canonicalUrl}
                                className="w-full bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 p-3 text-sm placeholder-gray-400 focus:ring-2 focus:ring-primary"
                                placeholder="https://original-source.com/..."
                            />
                        </div>
                    </div>
                </div>

                {/* Publishing Options Tile */}
                <div className="editor-side-tile tile bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h4 className="font-display font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-lg">send</span>
                        Publishing Options
                    </h4>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="pinned" name="pinned" defaultChecked={initialData?.pinned} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                            <label htmlFor="pinned" className="text-sm font-medium">Pin to Highlights</label>
                        </div>
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="isListed" name="isListed" defaultChecked={initialData?.isListed !== false} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                            <label htmlFor="isListed" className="text-sm font-medium">List on Website</label>
                        </div>
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="isProtected" name="isProtected" checked={isProtected} onChange={(e) => setIsProtected(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                            <label htmlFor="isProtected" className="text-sm font-medium">Email Required</label>
                        </div>
                    </div>



                    <input type="hidden" name="status" value="published" id="statusInput" />

                    <button type="submit" onClick={() => {
                        const el = document.getElementById('statusInput') as HTMLInputElement;
                        if (el) el.value = 'published';
                    }} className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-orange-700 text-white font-bold py-3 px-5 rounded-2xl transition-all shadow-lg shadow-orange-500/20 mb-3">
                        <span className="material-symbols-outlined text-sm">publish</span>
                        {isEditing ? "Update & Publish" : "Publish Now"}
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                        <button type="submit" onClick={() => {
                            const el = document.getElementById('statusInput') as HTMLInputElement;
                            if (el) el.value = 'draft';
                        }} className="flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-bold py-3 px-4 rounded-2xl transition-all border border-gray-100 dark:border-gray-700 text-sm">
                            <span className="material-symbols-outlined text-sm">save</span>
                            Draft
                        </button>
                        <button type="button" className="flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-bold py-3 px-4 rounded-2xl transition-all border border-gray-100 dark:border-gray-700 text-sm">
                            <span className="material-symbols-outlined text-sm">calendar_month</span>
                            Schedule
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}
