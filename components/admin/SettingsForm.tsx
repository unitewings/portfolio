"use client";

import { useState } from "react";
import { SiteSettings } from "@/types";
import { Button } from "@/components/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/card";
import { updateSettings } from "@/lib/actions";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export function SettingsForm({ initialData }: { initialData: SiteSettings }) {
    const [formData, setFormData] = useState<SiteSettings>(initialData);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateSettings(formData);
            toast.success("Settings saved successfully!");
        } catch (error) {
            toast.error("Failed to save settings.");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Sidebar Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Profile Name</label>
                            <input
                                name="profileName"
                                value={formData.profileName || ""}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Jeff Su"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Profile Label</label>
                            <input
                                name="profileLabel"
                                value={formData.profileLabel || ""}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                placeholder="Productivity Expert"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Social Profiles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setFormData(prev => ({
                                    ...prev,
                                    socialLinks: [...(prev.socialLinks || []), { network: "linkedin", username: "", url: "" }]
                                }));
                            }}
                        >
                            <Plus size={16} className="mr-2" />
                            Add Profile
                        </Button>
                    </div>
                    {(formData.socialLinks || []).map((link, idx) => (
                        <div key={idx} className="flex gap-4 items-start rounded-md border p-4 bg-card">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium">Network</label>
                                    <select
                                        value={link.network}
                                        onChange={(e) => {
                                            const newLinks = [...(formData.socialLinks || [])];
                                            newLinks[idx] = { ...newLinks[idx], network: e.target.value };
                                            setFormData(prev => ({ ...prev, socialLinks: newLinks }));
                                        }}
                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                                    >
                                        <option value="linkedin">LinkedIn</option>
                                        <option value="twitter">X (Twitter)</option>
                                        <option value="github">GitHub</option>
                                        <option value="youtube">YouTube</option>
                                        <option value="instagram">Instagram</option>
                                        <option value="facebook">Facebook</option>
                                        <option value="email">Email</option>
                                        <option value="website">Website</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium">URL</label>
                                    <input
                                        value={link.url}
                                        onChange={(e) => {
                                            const newLinks = [...(formData.socialLinks || [])];
                                            newLinks[idx] = { ...newLinks[idx], url: e.target.value };
                                            setFormData(prev => ({ ...prev, socialLinks: newLinks }));
                                        }}
                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive mt-6"
                                onClick={() => {
                                    const newLinks = [...(formData.socialLinks || [])];
                                    newLinks.splice(idx, 1);
                                    setFormData(prev => ({ ...prev, socialLinks: newLinks }));
                                }}
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Newsletter Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Newsletter Title</label>
                        <input
                            name="newsletterTitle"
                            value={formData.newsletterTitle || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            placeholder="Newsletter"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Newsletter Description</label>
                        <textarea
                            name="newsletterDescription"
                            value={formData.newsletterDescription || ""}
                            onChange={handleChange}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            placeholder="Join subscribers..."
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Global SEO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Global Site Title</label>
                        <input
                            name="globalTitle"
                            value={formData.globalTitle}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Global Description</label>
                        <textarea
                            name="globalDescription"
                            value={formData.globalDescription}
                            onChange={handleChange}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Home Page Content</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Intro Markdown</label>
                        <p className="text-xs text-muted-foreground mb-2">
                            This text appears at the top of your home page. Supports basic Markdown (bold, italic, list).
                        </p>
                        <textarea
                            name="homeIntroContent"
                            value={formData.homeIntroContent}
                            onChange={handleChange}
                            className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Contact Page</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Contact Intro Markdown</label>
                        <p className="text-xs text-muted-foreground mb-2">
                            Text displayed above the contact form.
                        </p>
                        <textarea
                            name="contactIntro"
                            value={formData.contactIntro || ""}
                            onChange={handleChange}
                            className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
                            placeholder="## Get in touch..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Contact Email (Display)</label>
                        <input
                            name="contactEmail"
                            value={formData.contactEmail || ""}
                            onChange={handleChange}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            placeholder="hello@example.com"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Metadata & Scripts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Head Scripts</label>
                        <p className="text-xs text-muted-foreground mb-2">
                            Raw HTML/JS injected into the &lt;head&gt;. Use for Analytics, verification tags, etc.
                            <strong> Warning: Be careful with what you paste here.</strong>
                        </p>
                        <textarea
                            name="headScripts"
                            value={formData.headScripts || ""}
                            onChange={handleChange}
                            className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                            placeholder="<script>...</script>"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </form >
    );
}
