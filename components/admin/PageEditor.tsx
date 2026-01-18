"use client";

import { useState } from "react";
import { Page } from "@/types";
import { Button } from "@/components/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/card";
import { savePageAction, deletePageAction } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function PageEditor({ initialPage }: { initialPage?: Page }) {
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
        isSystem: false
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const result = await savePageAction(formData);
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
        // setIsDeleting(true); // Already true if we are here
        try {
            const result = await deletePageAction(formData.id);
            if (result.success) {
                toast.success(result.message);
                router.push("/admin/pages");
            } else {
                toast.error(result.message);
                setIsDeleting(false); // Reset on error
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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-4">
                <div className="w-2/3 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Page Content {formData.isSystem && <span className="text-sm font-normal text-muted-foreground ml-2">(System Page)</span>}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
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
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Slug (URL)</label>
                                <input
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono disabled:opacity-50"
                                    placeholder="page-slug"
                                    required
                                    disabled={!!formData.isSystem}
                                />
                                {formData.isSystem && <p className="text-xs text-muted-foreground">System page slugs cannot be changed.</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Content (Markdown)</label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    className="flex min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono disabled:opacity-50"
                                    placeholder="# Heading..."
                                />
                                {formData.isSystem && <p className="text-xs text-muted-foreground">System page slugs cannot be changed, but content is editable.</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="w-1/3 space-y-6">
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
            </div>
        </form>
    );
}
