"use client";

import { useMemo } from "react";
import { Slide, SlideType } from "@/types/uw-interact";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, Trash2 } from "lucide-react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SlideListProps {
    slides: Slide[];
    activeSlideId: string | null;
    onSelectSlide: (id: string) => void;
    onAddSlide: (type: SlideType) => void;
    onDeleteSlide: (id: string) => void;
    onReorderSlides: (slides: Slide[]) => void;
}

export function SlideList({
    slides,
    activeSlideId,
    onSelectSlide,
    onAddSlide,
    onDeleteSlide,
    onReorderSlides
}: SlideListProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = slides.findIndex((s) => s.id === active.id);
            const newIndex = slides.findIndex((s) => s.id === over.id);
            onReorderSlides(arrayMove(slides, oldIndex, newIndex));
        }
    }

    return (
        <div className="flex bg-muted/20 flex-col h-full border-r">
            <div className="p-4 border-b">
                <h2 className="text-sm font-semibold mb-2">Slides</h2>
                <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" variant="outline" onClick={() => onAddSlide("mcq")}>
                        <Plus className="mr-2 h-4 w-4" /> MCQ
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onAddSlide("wordcloud")}>
                        <Plus className="mr-2 h-4 w-4" /> Cloud
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={slides.map(s => s.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        {slides.map((slide, index) => (
                            <SortableSlideItem
                                key={slide.id}
                                id={slide.id}
                                slide={slide}
                                index={index}
                                isActive={slide.id === activeSlideId}
                                onSelect={() => onSelectSlide(slide.id)}
                                onDelete={() => onDeleteSlide(slide.id)}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    );
}

function SortableSlideItem({
    id,
    slide,
    index,
    isActive,
    onSelect,
    onDelete
}: {
    id: string;
    slide: Slide;
    index: number;
    isActive: boolean;
    onSelect: () => void;
    onDelete: (e: React.MouseEvent) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative group flex flex-col gap-1 p-2 rounded-md border text-sm cursor-pointer transition-colors ${isActive ? "bg-primary/10 border-primary" : "bg-card hover:border-primary/50"
                }`}
            onClick={onSelect}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-muted-foreground w-4 text-xs font-mono">{index + 1}</span>
                    <span className="font-medium truncate max-w-[120px]">
                        {slide.content.question || "New Slide"}
                    </span>
                </div>
                <div
                    {...attributes}
                    {...listeners}
                    className="cursor-move text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted"
                >
                    <GripVertical size={14} />
                </div>
            </div>
            <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                    {slide.type}
                </span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(e);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-destructive hover:bg-destructive/10 rounded transition-opacity"
                >
                    <Trash2 size={12} />
                </button>
            </div>
        </div>
    );
}
