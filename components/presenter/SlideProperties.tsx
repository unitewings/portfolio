"use client";

import { Slide } from "@/types/uw-interact";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface SlidePropertiesProps {
    slide: Slide | null;
    onUpdate: (updates: Partial<Slide>) => void;
}

export function SlideProperties({ slide, onUpdate }: SlidePropertiesProps) {
    if (!slide) {
        return (
            <div className="w-80 border-l bg-card p-4 text-sm text-muted-foreground">
                No slide selected.
            </div>
        );
    }

    const handleContentChange = (field: string, value: any) => {
        onUpdate({
            content: {
                ...slide.content,
                [field]: value
            }
        });
    };

    const updateOption = (id: string, field: string, value: any) => {
        const newOptions = slide.content.options?.map(opt =>
            opt.id === id ? { ...opt, [field]: value } : opt
        );
        handleContentChange("options", newOptions);
    };

    const addOption = () => {
        const newOption = {
            id: Math.random().toString(36).substr(2, 9),
            label: "",
            isCorrect: false
        };
        handleContentChange("options", [...(slide.content.options || []), newOption]);
    };

    const removeOption = (id: string) => {
        const newOptions = slide.content.options?.filter(opt => opt.id !== id);
        handleContentChange("options", newOptions);
    };

    return (
        <div className="w-80 border-l bg-card flex flex-col h-full">
            <div className="p-4 border-b font-medium">Properties</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                <div className="space-y-2">
                    <Label>Question / Heading</Label>
                    <Input
                        value={slide.content.question}
                        onChange={(e) => handleContentChange("question", e.target.value)}
                    />
                </div>

                {slide.type === 'heading' && (
                    <div className="space-y-2">
                        <Label>Subtext</Label>
                        <Textarea
                            value={slide.content.subtext || ""}
                            onChange={(e) => handleContentChange("subtext", e.target.value)}
                        />
                    </div>
                )}

                {slide.type === 'mcq' && (
                    <div className="space-y-4">
                        <Label>Options</Label>
                        <div className="space-y-2">
                            {slide.content.options?.map((opt) => (
                                <div key={opt.id} className="flex gap-2">
                                    <Input
                                        value={opt.label}
                                        onChange={(e) => updateOption(opt.id, "label", e.target.value)}
                                        placeholder="Option text"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeOption(opt.id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button size="sm" variant="outline" onClick={addOption} className="w-full">
                            <Plus className="mr-2 h-4 w-4" /> Add Option
                        </Button>
                    </div>
                )}

                {/* Add more type-specific fields here */}

            </div>
        </div>
    );
}
