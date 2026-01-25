"use client";

import { useState } from "react";
import { Page, BlogPost } from "@/types";
import { Button } from "@/components/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/card";
import { savePageAction, deletePageAction } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { BlogPicker } from "./BlogPicker";

export function PageEditor({ initialPage, allPosts = [] }: { initialPage?: Page; allPosts?: BlogPost[] }) {
    const router = useRouter();
    const [formData, setFormData] = useState<Page>(initialPage || {
        id: crypto.randomUUID(),
        title: "",
        slug: "",
        content: "",
        inSidebar: true,
        order: 0,
        seoTitle: "",
        seoDescription: "",

        isSystem: false,
        type: 'page',
        externalUrl: "",

        // Custom Page Defaults
        postIds: [],
        isProtected: false,
        password: "",
        passwordHintLink: "",
        lastUpdated: new Date().toISOString()
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handlePostSelection = (ids: string[]) => {
        setFormData(prev => ({ ...prev, postIds: ids }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        // Ensure we update lastUpdated
        const finalData = { ...formData, lastUpdated: new Date().toISOString() };

        try {
            const result = await savePageAction(finalData);
            if (result.success) {
                toast.success(result.message);
                router.push("/admin/pages");
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            const result = await deletePageAction(formData.id);
            if (result.success) {
                toast.success(result.message);
                router.push("/admin/pages");
            } else {
                toast.error(result.message);
                setIsDeleting(false);
            }
        } catch (error) {
            toast.error("Failed to delete page.");
            setIsDeleting(false);
        }
    };

    // Auto-generate slug from title if empty (simple version)
    const handleTitleBlur = () => {
        if (!formData.slug && formData.title && !formData.isSystem) {
            const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
            setFormData(prev => ({ ...prev, slug }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="w-full lg:w-2/3 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Page Content {formData.isSystem && <span className="text-sm font-normal text-muted-foreground ml-2">(System Page)</span>}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Type</label>
                                <select
                                    name="type"
                                    value={formData.type || 'page'}
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    disabled={!!formData.isSystem}
                                >
                                    <option value="page">Page</option>
                                    <option value="heading">Heading</option>
                                    <option value="link">External Link</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title</label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    onBlur={handleTitleBlur}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    placeholder="Page Title"
                                    required
                                />
                            </div>

                            {(formData.type === 'page' || !formData.type) && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Slug (URL)</label>
                                    <input
                                        name="slug"
                                        value={formData.slug}
                                        onChange={handleChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono disabled:opacity-50"
                                        placeholder="page-slug"
                                        required={formData.type === 'page'}
                                        disabled={!!formData.isSystem}
                                    />
                                    {formData.isSystem && <p className="text-xs text-muted-foreground">System page slugs cannot be changed.</p>}
                                </div>
                            )}

                            {formData.type === 'link' && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">External URL</label>
                                    <input
                                        name="externalUrl"
                                        value={formData.externalUrl || ""}
                                        onChange={handleChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                                        placeholder="https://example.com"
                                        required
                                    />
                                </div>
                            )}

                            {(formData.type === 'page' || !formData.type || formData.isSystem) && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Content (Markdown)</label>
                                    <textarea
                                        name="content"
                                        value={formData.content}
                                        onChange={handleChange}
                                        className="flex min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono disabled:opacity-50"
                                        placeholder="# Heading..."
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Curated Posts Section */}
                    {(formData.type === 'page' || !formData.type) && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Curated Posts (Optional)</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-xs text-muted-foreground mb-4">Select and reorder blogs to display them at the bottom of the page.</p>
                                <BlogPicker
                                    allPosts={allPosts}
                                    selectedIds={formData.postIds || []}
                                    onSelectionChange={handlePostSelection}
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="w-full lg:w-1/3 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="inSidebar"
                                    name="inSidebar"
                                    checked={formData.inSidebar}
                                    onChange={handleCheckboxChange}
                                    className="h-4 w-4"
                                />
                                <label htmlFor="inSidebar" className="text-sm font-medium leading-none">
                                    Show in Sidebar
                                </label>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Order</label>
                                <input
                                    type="number"
                                    name="order"
                                    value={formData.order}
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Protection Settings */}
                    {(formData.type === 'page' || !formData.type) && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Access Control</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="isProtected"
                                        name="isProtected"
                                        checked={formData.isProtected}
                                        onChange={handleCheckboxChange}
                                        className="h-4 w-4"
                                    />
                                    <label htmlFor="isProtected" className="text-sm font-medium leading-none">
                                        Password Protection
                                    </label>
                                </div>

                                {formData.isProtected && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 pt-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Password</label>
                                            <input
                                                name="password"
                                                value={formData.password || ""}
                                                onChange={handleChange}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                placeholder="Secure password"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Hint Link</label>
                                            <input
                                                name="passwordHintLink"
                                                value={formData.passwordHintLink || ""}
                                                onChange={handleChange}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {(formData.type === 'page' || !formData.type) && (
                        <Card>
                            <CardHeader>
                                <CardTitle>SEO Metadata</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">SEO Title</label>
                                    <input
                                        name="seoTitle"
                                        value={formData.seoTitle || ""}
                                        onChange={handleChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">SEO Description</label>
                                    <textarea
                                        name="seoDescription"
                                        value={formData.seoDescription || ""}
                                        onChange={handleChange}
                                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Button type="submit" disabled={isSaving} className="w-full">
                        {isSaving ? "Saving..." : "Save Page"}
                    </Button>

                    {!formData.isSystem && formData.id && (
                        <div className="pt-2">
                            {isDeleting ? (
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        className="w-full flex-1"
                                        onClick={handleDeleteConfirm}
                                    >
                                        Confirm Delete
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsDeleting(false)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    className="w-full gap-2"
                                    onClick={() => setIsDeleting(true)}
                                >
                                    <Trash2 size={16} />
                                    Delete Page
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div >
        </form >
    );
}
