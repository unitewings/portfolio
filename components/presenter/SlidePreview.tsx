"use client";

import { Slide } from "@/types/uw-interact";

export function SlidePreview({ slide }: { slide: Slide | null }) {
    if (!slide) {
        return (
            <div className="flex-1 bg-muted/50 p-8 flex items-center justify-center">
                <div className="text-muted-foreground">Select a slide to edit</div>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-muted/50 p-8 flex items-center justify-center overflow-hidden">
            <div
                className="aspect-video w-full max-w-4xl bg-white shadow-lg flex flex-col items-center justify-center p-12 text-center rounded-lg relative overflow-hidden"
                style={{ color: '#000' }} // Force black text for preview on white slide
            >
                <h1 className="text-4xl font-bold mb-8">{slide.content.question || "Result Question"}</h1>

                {slide.type === 'mcq' && (
                    <div className="grid gap-2 w-full max-w-md">
                        {slide.content.options?.map((opt) => (
                            <div
                                key={opt.id}
                                className="p-4 rounded-md border-2 border-transparent bg-gray-100 font-medium"
                            >
                                {opt.label || "Option Label"}
                            </div>
                        ))}
                    </div>
                )}

                {slide.type === 'heading' && (
                    <div className="text-muted-foreground">
                        {slide.content.subtext || "Enter subheading..."}
                    </div>
                )}

                {/* Placeholder for other types */}
                {slide.type !== 'mcq' && slide.type !== 'heading' && (
                    <div className="p-8 border-2 border-dashed border-gray-300 rounded-xl">
                        Preview for {slide.type}
                    </div>
                )}
            </div>
        </div>
    );
}
