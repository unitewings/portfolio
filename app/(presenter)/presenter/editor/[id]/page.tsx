"use client";

import { use, useEffect, useState, useCallback, useRef } from "react";
import { Slide, SlideType, Presentation, PresentationConfig } from "@/types/uw-interact";
import { collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, writeBatch, serverTimestamp, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SlideList } from "@/components/presenter/SlideList";
import { SlidePreview } from "@/components/presenter/SlidePreview";
import { SlideProperties } from "@/components/presenter/SlideProperties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Play, Loader2, Share2, Settings, Copy, Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";

export default function SlideEditorPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [presentation, setPresentation] = useState<Presentation | null>(null);
    const [slides, setSlides] = useState<Slide[]>([]);
    const [activeSlideId, setActiveSlideId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const hasInitialized = useRef(false);

    // Share dialog state
    const [shareOpen, setShareOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // Settings dialog state
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [settingsForm, setSettingsForm] = useState({
        title: "",
        description: "",
        requireName: false,
        allowAnonymous: true,
        accentColor: "#2563EB"
    });

    // Fetch Presentation
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "presentations", id), (docSnap) => {
            if (docSnap.exists()) {
                const data = { id: docSnap.id, ...docSnap.data() } as Presentation;
                setPresentation(data);
                // Initialize settings form when presentation loads
                setSettingsForm({
                    title: data.title || "",
                    description: (data as any).description || "",
                    requireName: data.config?.requireName || false,
                    allowAnonymous: data.config?.allowAnonymous ?? true,
                    accentColor: data.config?.accentColor || "#2563EB"
                });
            }
        });
        return () => unsub();
    }, [id]);

    // Fetch Slides
    useEffect(() => {
        const q = query(collection(db, "presentations", id, "slides"), orderBy("order", "asc"));
        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Slide[];
            setSlides(data);
            if (data.length > 0 && !hasInitialized.current) {
                setActiveSlideId(data[0].id);
                hasInitialized.current = true;
            }
            setLoading(false);
        });
        return () => unsub();
    }, [id]);

    const handleAddSlide = async (type: SlideType) => {
        const newOrder = slides.length > 0 ? slides[slides.length - 1].order + 1 : 0;
        const newSlide = {
            presentationId: id,
            type,
            order: newOrder,
            content: {
                question: type === 'heading' ? "New Heading" : "New Question",
                options: type === 'mcq' ? [
                    { id: "1", label: "Option 1" },
                    { id: "2", label: "Option 2" }
                ] : []
            },
            settings: {
                hideResults: false,
                timer: 0,
                profanityFilter: false
            }
        };

        const docRef = await addDoc(collection(db, "presentations", id, "slides"), newSlide);
        setActiveSlideId(docRef.id);
    };

    const handleDeleteSlide = async (slideId: string) => {
        if (confirm("Are you sure you want to delete this slide?")) {
            await deleteDoc(doc(db, "presentations", id, "slides", slideId));
            if (activeSlideId === slideId) {
                setActiveSlideId(null);
            }
        }
    };

    const handleUpdateSlide = async (updates: Partial<Slide>) => {
        if (!activeSlideId) return;
        await updateDoc(doc(db, "presentations", id, "slides", activeSlideId), updates);
    };

    const handleReorderSlides = async (reorderedSlides: Slide[]) => {
        setSlides(reorderedSlides);
        const batch = writeBatch(db);
        reorderedSlides.forEach((slide, index) => {
            const ref = doc(db, "presentations", id, "slides", slide.id);
            batch.update(ref, { order: index });
        });
        await batch.commit();
    };

    // Share functionality
    const getShareUrl = () => {
        if (typeof window !== "undefined" && presentation?.accessCode) {
            return `${window.location.origin}/live/${presentation.accessCode}`;
        }
        return "";
    };

    const handleCopyLink = async () => {
        const url = getShareUrl();
        if (url) {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleCopyCode = async () => {
        if (presentation?.accessCode) {
            await navigator.clipboard.writeText(presentation.accessCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Settings save
    const handleSaveSettings = async () => {
        if (!presentation) return;

        await updateDoc(doc(db, "presentations", id), {
            title: settingsForm.title,
            description: settingsForm.description,
            config: {
                requireName: settingsForm.requireName,
                allowAnonymous: settingsForm.allowAnonymous,
                accentColor: settingsForm.accentColor
            },
            updatedAt: serverTimestamp()
        });
        setSettingsOpen(false);
    };

    const activeSlide = slides.find(s => s.id === activeSlideId) || null;

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <header className="h-14 border-b flex items-center justify-between px-4 bg-card shrink-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/presenter">
                            <ArrowLeft size={18} />
                        </Link>
                    </Button>
                    <span className="font-semibold">{presentation?.title || "Untitled"}</span>
                </div>
                <div className="flex items-center gap-2">
                    {/* Settings Button */}
                    <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Settings className="mr-2 h-4 w-4" /> Settings
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Presentation Settings</DialogTitle>
                                <DialogDescription>
                                    Configure your presentation options
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={settingsForm.title}
                                        onChange={(e) => setSettingsForm(s => ({ ...s, title: e.target.value }))}
                                        placeholder="Presentation title"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={settingsForm.description}
                                        onChange={(e) => setSettingsForm(s => ({ ...s, description: e.target.value }))}
                                        placeholder="Optional description"
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="accentColor">Accent Color</Label>
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            id="accentColor"
                                            type="color"
                                            value={settingsForm.accentColor}
                                            onChange={(e) => setSettingsForm(s => ({ ...s, accentColor: e.target.value }))}
                                            className="w-12 h-10 p-1 cursor-pointer"
                                        />
                                        <Input
                                            value={settingsForm.accentColor}
                                            onChange={(e) => setSettingsForm(s => ({ ...s, accentColor: e.target.value }))}
                                            className="flex-1 font-mono"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3 pt-2">
                                    <Label>Audience Options</Label>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-sm">Require Name</div>
                                            <div className="text-xs text-muted-foreground">Ask audience for their name before joining</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settingsForm.requireName}
                                            onChange={(e) => setSettingsForm(s => ({ ...s, requireName: e.target.checked }))}
                                            className="w-5 h-5 accent-primary"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-sm">Allow Anonymous</div>
                                            <div className="text-xs text-muted-foreground">Let audience join without identification</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={settingsForm.allowAnonymous}
                                            onChange={(e) => setSettingsForm(s => ({ ...s, allowAnonymous: e.target.checked }))}
                                            className="w-5 h-5 accent-primary"
                                        />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setSettingsOpen(false)}>Cancel</Button>
                                <Button onClick={handleSaveSettings}>Save Changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Share Button */}
                    <Dialog open={shareOpen} onOpenChange={setShareOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Share2 className="mr-2 h-4 w-4" /> Share
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Share Presentation</DialogTitle>
                                <DialogDescription>
                                    Share this link with your audience to let them join
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Access Code</Label>
                                    <div className="flex gap-2">
                                        <div className="flex-1 bg-muted rounded-lg px-4 py-3 font-mono text-2xl tracking-widest text-center">
                                            {presentation?.accessCode}
                                        </div>
                                        <Button variant="outline" size="icon" onClick={handleCopyCode}>
                                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Direct Link</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            readOnly
                                            value={getShareUrl()}
                                            className="font-mono text-sm"
                                        />
                                        <Button variant="outline" size="icon" onClick={handleCopyLink}>
                                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                                <Button className="w-full" asChild>
                                    <a href={getShareUrl()} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="mr-2 h-4 w-4" /> Open Audience View
                                    </a>
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Button size="sm" asChild>
                        <Link href={`/presenter/live/${id}`} target="_blank">
                            <Play className="mr-2 h-4 w-4" /> Present
                        </Link>
                    </Button>
                </div>
            </header>

            {/* Main Editor */}
            <div className="flex flex-1 overflow-hidden">
                <div className="w-64 shrink-0 flex flex-col">
                    <SlideList
                        slides={slides}
                        activeSlideId={activeSlideId}
                        onSelectSlide={setActiveSlideId}
                        onAddSlide={handleAddSlide}
                        onDeleteSlide={handleDeleteSlide}
                        onReorderSlides={handleReorderSlides}
                    />
                </div>

                <SlidePreview slide={activeSlide} />

                <SlideProperties
                    slide={activeSlide}
                    onUpdate={handleUpdateSlide}
                />
            </div>
        </div>
    );
}
