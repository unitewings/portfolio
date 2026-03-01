"use client";

import { useState } from "react";
import { SiteSettings } from "@/types";
import { Button } from "@/components/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shared/ui/card";
import { updateSettings } from "@/lib/actions";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";
import { FloatingLabelTextarea } from "@/components/ui/FloatingLabelTextarea";

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
                            <FloatingLabelInput
                                name="profileName"
                                value={formData.profileName || ""}
                                onChange={handleChange}
                                label="Profile Name"
                                placeholder="Swarn Shauryam"
                            />
                        </div>
                        <div className="space-y-2">
                            <FloatingLabelInput
                                name="profileLabel"
                                value={formData.profileLabel || ""}
                                onChange={handleChange}
                                label="Profile Label"
                                placeholder="AI, Growth & Journey"
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
                                    <FloatingLabelInput
                                        value={link.url}
                                        onChange={(e) => {
                                            const newLinks = [...(formData.socialLinks || [])];
                                            newLinks[idx] = { ...newLinks[idx], url: e.target.value };
                                            setFormData(prev => ({ ...prev, socialLinks: newLinks }));
                                        }}
                                        label="URL"
                                        placeholder="https://..."
                                        className="h-auto"
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
                        <FloatingLabelInput
                            name="newsletterTitle"
                            value={formData.newsletterTitle || ""}
                            onChange={handleChange}
                            label="Newsletter Title"
                            placeholder="Newsletter"
                        />
                    </div>
                    <div className="space-y-2">
                        <FloatingLabelTextarea
                            name="newsletterDescription"
                            value={formData.newsletterDescription || ""}
                            onChange={handleChange}
                            label="Newsletter Description"
                            placeholder="Join subscribers..."
                            className="min-h-[80px]"
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
                        <FloatingLabelInput
                            name="globalTitle"
                            value={formData.globalTitle}
                            onChange={handleChange}
                            label="Global Site Title"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <FloatingLabelTextarea
                            name="globalDescription"
                            value={formData.globalDescription}
                            onChange={handleChange}
                            label="Global Description"
                            required
                            className="min-h-[80px]"
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
                        <div className="space-y-2">
                            <p className="text-xs text-muted-foreground mb-2">
                                This text appears at the top of your home page. Supports basic Markdown (bold, italic, list).
                            </p>
                            <FloatingLabelTextarea
                                name="homeIntroContent"
                                value={formData.homeIntroContent}
                                onChange={handleChange}
                                label="Intro Markdown"
                                className="min-h-[200px] font-mono"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Community Submission Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-xs text-muted-foreground mb-4">
                        Manage the categories available for users when they submit articles, case studies, or guides.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {(formData.submissionCategories || []).map((category, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-full border border-border">
                                <span className="text-sm font-medium">{category}</span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newCategories = [...(formData.submissionCategories || [])];
                                        newCategories.splice(idx, 1);
                                        setFormData(prev => ({ ...prev, submissionCategories: newCategories }));
                                    }}
                                    className="text-muted-foreground hover:text-destructive flex items-center justify-center p-0.5 rounded-full hover:bg-destructive/10"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <FloatingLabelInput
                            label="New Category"
                            placeholder="e.g., Leadership"
                            id="newCategoryInput"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const input = e.currentTarget;
                                    const value = input.value.trim();
                                    if (value && !(formData.submissionCategories || []).includes(value)) {
                                        setFormData(prev => ({
                                            ...prev,
                                            submissionCategories: [...(prev.submissionCategories || []), value]
                                        }));
                                        input.value = '';
                                    }
                                }
                            }}
                        />
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={(e) => {
                                const input = document.getElementById('newCategoryInput') as HTMLInputElement;
                                if (input) {
                                    const value = input.value.trim();
                                    if (value && !(formData.submissionCategories || []).includes(value)) {
                                        setFormData(prev => ({
                                            ...prev,
                                            submissionCategories: [...(prev.submissionCategories || []), value]
                                        }));
                                        input.value = '';
                                    }
                                }
                            }}
                        >
                            <Plus size={16} className="mr-2" />
                            Add
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Contact Page</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="space-y-2">
                            <p className="text-xs text-muted-foreground mb-2">
                                Text displayed above the contact form.
                            </p>
                            <FloatingLabelTextarea
                                name="contactIntro"
                                value={formData.contactIntro || ""}
                                onChange={handleChange}
                                label="Contact Intro Markdown"
                                placeholder="## Get in touch..."
                                className="min-h-[120px] font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <FloatingLabelInput
                                name="contactEmail"
                                value={formData.contactEmail || ""}
                                onChange={handleChange}
                                label="Contact Email (Display)"
                                placeholder="swarn@unitewings.com"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Metadata & Scripts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <div className="space-y-2">
                            <p className="text-xs text-muted-foreground mb-2">
                                Raw HTML/JS injected into the &lt;head&gt;. Use for Analytics, verification tags, etc.
                                <strong> Warning: Be careful with what you paste here.</strong>
                            </p>
                            <FloatingLabelTextarea
                                name="headScripts"
                                value={formData.headScripts || ""}
                                onChange={handleChange}
                                label="Head Scripts"
                                className="min-h-[150px] font-mono"
                                placeholder="<script>...</script>"
                            />
                        </div>
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
