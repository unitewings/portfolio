"use client";

import { Slide } from "@/types/uw-interact";
import { MCQPresenter } from "@/components/interactions/mcq/MCQPresenter";
import { WordCloudPresenter } from "@/components/interactions/wordcloud/WordCloudPresenter";

export function LiveSlideRenderer({ slide }: { slide: Slide }) {
    if (!slide) return null;

    switch (slide.type) {
        case "heading":
            return (
                <div className="text-center">
                    <h1 className="text-6xl font-extrabold mb-6">{slide.content.question}</h1>
                    {slide.content.subtext && (
                        <p className="text-3xl text-muted-foreground">{slide.content.subtext}</p>
                    )}
                </div>
            );
        case "mcq":
            return <MCQPresenter slide={slide} />;
        case "wordcloud":
            return <WordCloudPresenter slide={slide} />;
        default:
            return (
                <div className="text-center p-8 border rounded-lg bg-white/10 text-white">
                    <h3 className="font-bold text-lg mb-2">Wait...</h3>
                    <p className="text-muted-foreground">{slide.type} visualization coming soon.</p>
                </div>
            );
    }
}
