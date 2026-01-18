"use client";

import { createPost, updatePost } from "@/lib/actions";
import { Button } from "@/components/shared/ui/button";
import { BlogPost } from "@/types";

interface PostEditorProps {
    initialData?: BlogPost;
}

export default function PostEditor({ initialData }: PostEditorProps) {
    const isEditing = !!initialData;
    const action = isEditing ? updatePost : createPost;

    return (
        <form action={action} className="space-y-6 max-w-3xl">
            {isEditing && (
                <>
                    <input type="hidden" name="id" value={initialData.id} />
                    <input type="hidden" name="slug" value={initialData.slug} />
                    <input type="hidden" name="date" value={initialData.date} />
                </>
            )}

            <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <input
                    name="title"
                    type="text"
                    required
                    defaultValue={initialData?.title}
                    className="w-full rounded-md border p-2 bg-background text-lg font-bold"
                    placeholder="Enter post title..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Excerpt</label>
                <textarea
                    name="excerpt"
                    defaultValue={initialData?.excerpt}
                    className="w-full rounded-md border p-2 bg-background h-20"
                    placeholder="Short summary for the feed..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Content (Markdown)</label>
                <textarea
                    name="content"
                    required
                    defaultValue={initialData?.content}
                    className="w-full rounded-md border p-2 bg-background font-mono h-96"
                    placeholder="# Hello World..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Image URL</label>
                <input
                    name="thumbnailUrl"
                    type="url"
                    defaultValue={initialData?.thumbnailUrl}
                    className="w-full rounded-md border p-2 bg-background"
                    placeholder="https://..."
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Tags (comma separated)</label>
                    <input
                        name="tags"
                        type="text"
                        defaultValue={initialData?.tags?.join(", ")}
                        placeholder="Productivity, Gear"
                        className="w-full rounded-md border p-2 bg-background"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <select
                        name="status"
                        defaultValue={initialData?.status || "draft"}
                        className="w-full rounded-md border p-2 bg-background"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="pinned"
                    name="pinned"
                    defaultChecked={initialData?.pinned}
                    className="h-4 w-4"
                />
                <label htmlFor="pinned" className="text-sm font-medium leading-none">
                    Pin to Highlights
                </label>
            </div>

            <div className="border-t pt-4 space-y-4">
                <h3 className="font-semibold">SEO Settings</h3>
                <div className="space-y-2">
                    <label className="text-sm font-medium">SEO Title (Optional)</label>
                    <input
                        name="seoTitle"
                        type="text"
                        defaultValue={initialData?.seoTitle}
                        className="w-full rounded-md border p-2 bg-background"
                        placeholder="Optimized title for search engines"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">SEO Description (Optional)</label>
                    <textarea
                        name="seoDescription"
                        defaultValue={initialData?.seoDescription}
                        className="w-full rounded-md border p-2 bg-background h-20"
                        placeholder="Meta description..."
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Canonical URL (Optional)</label>
                    <input
                        name="canonicalUrl"
                        type="url"
                        defaultValue={initialData?.canonicalUrl}
                        className="w-full rounded-md border p-2 bg-background"
                        placeholder="https://original-source.com/..."
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit">{isEditing ? "Update Post" : "Create Post"}</Button>
            </div>
        </form >
    )
}
