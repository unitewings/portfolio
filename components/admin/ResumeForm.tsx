"use client";

import { useState } from "react";
import { ResumeData, WorkExperience } from "@/types";
import { updateResume } from "@/lib/actions";
import { Button } from "@/components/shared/ui/button";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

export default function ResumeForm({ initialData }: { initialData: ResumeData }) {
    const [data, setData] = useState<ResumeData>(initialData);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsSaving(true);
        // Serialize state to send to server action
        formData.set("resumeData", JSON.stringify(data));

        const result = await updateResume(formData);

        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
        setIsSaving(false);
    };

    const handleBasicChange = (field: keyof ResumeData["basics"], value: string) => {
        setData(prev => ({
            ...prev,
            basics: { ...prev.basics, [field]: value }
        }));
    };

    // --- Work Experience Handlers ---
    const addWork = () => {
        const newJob: WorkExperience = {
            id: crypto.randomUUID(),
            company: "New Company",
            position: "Position",
            startDate: new Date().toISOString().split("T")[0],
            endDate: "Present",
            highlights: []
        };
        setData(prev => ({ ...prev, work: [newJob, ...prev.work] }));
    };

    const removeWork = (id: string) => {
        setData(prev => ({ ...prev, work: prev.work.filter(w => w.id !== id) }));
    };

    const updateWork = (id: string, field: keyof WorkExperience, value: any) => {
        setData(prev => ({
            ...prev,
            work: prev.work.map(w => w.id === id ? { ...w, [field]: value } : w)
        }));
    };

    const addHighlight = (workId: string) => {
        setData(prev => ({
            ...prev,
            work: prev.work.map(w => w.id === workId ? { ...w, highlights: [...w.highlights, "New highlight"] } : w)
        }));
    };

    const updateHighlight = (workId: string, index: number, value: string) => {
        setData(prev => ({
            ...prev,
            work: prev.work.map(w => w.id === workId ? {
                ...w,
                highlights: w.highlights.map((h, i) => i === index ? value : h)
            } : w)
        }));
    };

    const removeHighlight = (workId: string, index: number) => {
        setData(prev => ({
            ...prev,
            work: prev.work.map(w => w.id === workId ? {
                ...w,
                highlights: w.highlights.filter((_, i) => i !== index)
            } : w)
        }));
    };

    return (
        <form action={handleSubmit} className="space-y-8 pb-20">

            {/* Basics Section */}
            <div className="space-y-4 rounded-lg border bg-card p-6">
                <h2 className="text-lg font-semibold">Basics</h2>
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="text-sm font-medium">Name</label>
                        <input
                            type="text"
                            value={data.basics.name}
                            onChange={e => handleBasicChange("name", e.target.value)}
                            className="w-full rounded-md border p-2 bg-background"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Label</label>
                        <input
                            type="text"
                            value={data.basics.label}
                            onChange={e => handleBasicChange("label", e.target.value)}
                            className="w-full rounded-md border p-2 bg-background"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-sm font-medium">Summary</label>
                        <textarea
                            value={data.basics.summary}
                            onChange={e => handleBasicChange("summary", e.target.value)}
                            className="w-full rounded-md border p-2 bg-background h-24"
                        />
                    </div>
                </div>
            </div>

            {/* Work Experience Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Experience</h2>
                    <Button type="button" onClick={addWork} variant="outline" size="sm">
                        <Plus size={16} className="mr-2" /> Add Job
                    </Button>
                </div>

                {data.work.map((job) => (
                    <div key={job.id} className="relative rounded-lg border bg-card p-6 space-y-4">
                        <button
                            type="button"
                            onClick={() => removeWork(job.id)}
                            className="absolute top-4 right-4 text-destructive hover:bg-destructive/10 p-2 rounded-md transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>

                        <div className="grid gap-4 md:grid-cols-2 pr-12">
                            <div>
                                <label className="text-xs text-muted-foreground">Company</label>
                                <input
                                    value={job.company}
                                    onChange={e => updateWork(job.id, "company", e.target.value)}
                                    className="w-full rounded-md border p-2 bg-background font-medium"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground">Position</label>
                                <input
                                    value={job.position}
                                    onChange={e => updateWork(job.id, "position", e.target.value)}
                                    className="w-full rounded-md border p-2 bg-background"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground">Start Date</label>
                                <input
                                    value={job.startDate}
                                    onChange={e => updateWork(job.id, "startDate", e.target.value)}
                                    className="w-full rounded-md border p-2 bg-background"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-muted-foreground">End Date</label>
                                <input
                                    value={job.endDate}
                                    onChange={e => updateWork(job.id, "endDate", e.target.value)}
                                    className="w-full rounded-md border p-2 bg-background"
                                />
                            </div>
                        </div>

                        {/* Highlights Array */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs text-muted-foreground">Highlights</label>
                                <button type="button" onClick={() => addHighlight(job.id)} className="text-xs text-primary hover:underline">
                                    + Add Bullet
                                </button>
                            </div>
                            {job.highlights.map((bullet, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <input
                                        value={bullet}
                                        onChange={e => updateHighlight(job.id, idx, e.target.value)}
                                        className="flex-1 rounded-md border p-2 bg-background text-sm"
                                    />
                                    <button type="button" onClick={() => removeHighlight(job.id, idx)} className="text-muted-foreground hover:text-destructive">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Education Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Education</h2>
                    <Button type="button" onClick={() => {
                        const newEdu = {
                            id: crypto.randomUUID(),
                            institution: "University",
                            area: "Major",
                            studyType: "Bachelor",
                            startDate: "2020-01-01",
                            endDate: "2024-01-01",
                            score: ""
                        };
                        setData(prev => ({ ...prev, education: [...prev.education, newEdu] }));
                    }} variant="outline" size="sm">
                        <Plus size={16} className="mr-2" /> Add Education
                    </Button>
                </div>

                {
                    data.education.map((edu) => (
                        <div key={edu.id} className="relative rounded-lg border bg-card p-6 space-y-4">
                            <button
                                type="button"
                                onClick={() => setData(prev => ({ ...prev, education: prev.education.filter(e => e.id !== edu.id) }))}
                                className="absolute top-4 right-4 text-destructive hover:bg-destructive/10 p-2 rounded-md transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="grid gap-4 md:grid-cols-2 pr-12">
                                <div>
                                    <label className="text-xs text-muted-foreground">Institution</label>
                                    <input
                                        value={edu.institution}
                                        onChange={e => setData(prev => ({ ...prev, education: prev.education.map(ed => ed.id === edu.id ? { ...ed, institution: e.target.value } : ed) }))}
                                        className="w-full rounded-md border p-2 bg-background font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground">Area of Study</label>
                                    <input
                                        value={edu.area}
                                        onChange={e => setData(prev => ({ ...prev, education: prev.education.map(ed => ed.id === edu.id ? { ...ed, area: e.target.value } : ed) }))}
                                        className="w-full rounded-md border p-2 bg-background"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground">Degree Type</label>
                                    <input
                                        value={edu.studyType}
                                        onChange={e => setData(prev => ({ ...prev, education: prev.education.map(ed => ed.id === edu.id ? { ...ed, studyType: e.target.value } : ed) }))}
                                        className="w-full rounded-md border p-2 bg-background"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground">Score / GPA</label>
                                    <input
                                        value={edu.score || ""}
                                        onChange={e => setData(prev => ({ ...prev, education: prev.education.map(ed => ed.id === edu.id ? { ...ed, score: e.target.value } : ed) }))}
                                        className="w-full rounded-md border p-2 bg-background"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground">Start Date</label>
                                    <input
                                        value={edu.startDate}
                                        onChange={e => setData(prev => ({ ...prev, education: prev.education.map(ed => ed.id === edu.id ? { ...ed, startDate: e.target.value } : ed) }))}
                                        className="w-full rounded-md border p-2 bg-background"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-muted-foreground">End Date</label>
                                    <input
                                        value={edu.endDate}
                                        onChange={e => setData(prev => ({ ...prev, education: prev.education.map(ed => ed.id === edu.id ? { ...ed, endDate: e.target.value } : ed) }))}
                                        className="w-full rounded-md border p-2 bg-background"
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>

            {/* Skills Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Skills</h2>
                    <Button type="button" onClick={() => {
                        const newSkill = { id: crypto.randomUUID(), name: "Category Name", keywords: [] };
                        setData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
                    }} variant="outline" size="sm">
                        <Plus size={16} className="mr-2" /> Add Skill Category
                    </Button>
                </div>

                {data.skills.map((skill) => (
                    <div key={skill.id} className="relative rounded-lg border bg-card p-6 space-y-4">
                        <button
                            type="button"
                            onClick={() => setData(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== skill.id) }))}
                            className="absolute top-4 right-4 text-destructive hover:bg-destructive/10 p-2 rounded-md transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>

                        <div className="grid gap-4 md:grid-cols-2 pr-12">
                            <div>
                                <label className="text-xs text-muted-foreground">Category Name</label>
                                <input
                                    value={skill.name}
                                    onChange={e => setData(prev => ({ ...prev, skills: prev.skills.map(s => s.id === skill.id ? { ...s, name: e.target.value } : s) }))}
                                    className="w-full rounded-md border p-2 bg-background font-medium"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs text-muted-foreground">Keywords (comma separated)</label>
                                <input
                                    value={skill.keywords.join(", ")}
                                    onChange={e => {
                                        const val = e.target.value;
                                        const keywords = val.split(",").map(k => k); // Keep spaces while typing, trim when saving? Or just raw string for now
                                        // Better UX: just store as array of strings, split properly
                                        setData(prev => ({ ...prev, skills: prev.skills.map(s => s.id === skill.id ? { ...s, keywords: val.split(",") } : s) }));
                                    }}
                                    className="w-full rounded-md border p-2 bg-background"
                                    placeholder="React, TypeScript, Node.js"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating Save Button */}
            <div className="fixed bottom-6 right-6">
                <Button type="submit" disabled={isSaving} className="shadow-lg h-12 px-6 rounded-full">
                    <Save className="mr-2" size={18} />
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

        </form>
    );
}
