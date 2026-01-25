"use client";

import { BlogPost } from "@/types";
import { useState } from "react";
import { Check, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/shared/ui/button";

interface BlogPickerProps {
    allPosts: BlogPost[];
    selectedIds: string[];
    onSelectionChange: (ids: string[]) => void;
}

export function BlogPicker({ allPosts, selectedIds, onSelectionChange }: BlogPickerProps) {
    // Helper to toggle selection
    const toggleSelection = (id: string) => {
        if (selectedIds.includes(id)) {
            onSelectionChange(selectedIds.filter(pid => pid !== id));
        } else {
            onSelectionChange([...selectedIds, id]);
        }
    };

    // Helper to move item up
    const moveUp = (index: number) => {
        if (index === 0) return;
        const newIds = [...selectedIds];
        const temp = newIds[index];
        newIds[index] = newIds[index - 1];
        newIds[index - 1] = temp;
        onSelectionChange(newIds);
    };

    // Helper to move item down
    const moveDown = (index: number) => {
        if (index === selectedIds.length - 1) return;
        const newIds = [...selectedIds];
        const temp = newIds[index];
        newIds[index] = newIds[index + 1];
        newIds[index + 1] = temp;
        onSelectionChange(newIds);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
            {/* Source List */}
            <div className="border rounded-lg flex flex-col overflow-hidden">
                <div className="bg-muted p-2 border-b font-medium text-sm">Available Posts</div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {allPosts.filter(p => !selectedIds.includes(p.id)).map(post => (
                        <div
                            key={post.id}
                            onClick={() => toggleSelection(post.id)}
                            className="flex items-center justify-between p-2 rounded-md hover:bg-accent cursor-pointer group transition-colors"
                        >
                            <span className="text-sm truncate">{post.title}</span>
                            <div className="opacity-0 group-hover:opacity-100 text-primary">
                                <Check size={14} />
                            </div>
                        </div>
                    ))}
                    {allPosts.length === 0 && <p className="text-xs text-muted-foreground p-2">No posts available.</p>}
                </div>
            </div>

            {/* Selected List (Ordered) */}
            <div className="border rounded-lg flex flex-col overflow-hidden">
                <div className="bg-muted p-2 border-b font-medium text-sm">Selected (In Order)</div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {selectedIds.map((id, index) => {
                        const post = allPosts.find(p => p.id === id);
                        if (!post) return null;
                        return (
                            <div key={id} className="flex items-center justify-between p-2 rounded-md bg-accent/50 border">
                                <span className="text-sm truncate flex-1">{post.title}</span>
                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={() => moveUp(index)}
                                        disabled={index === 0}
                                        className="p-1 hover:bg-background rounded disabled:opacity-30"
                                    >
                                        <ArrowUp size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveDown(index)}
                                        disabled={index === selectedIds.length - 1}
                                        className="p-1 hover:bg-background rounded disabled:opacity-30"
                                    >
                                        <ArrowDown size={14} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => toggleSelection(id)}
                                        className="p-1 hover:bg-destructive/10 text-destructive rounded ml-1"
                                    >
                                        <XSmallIcon />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {selectedIds.length === 0 && (
                        <p className="text-xs text-muted-foreground p-2 italic">Select posts from the left list.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function XSmallIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    )
}
