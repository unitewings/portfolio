"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";

export function CreatePresentationDialog() {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user } = useAuth();

    const handleCreate = async () => {
        if (!title.trim() || !user) return;

        setLoading(true);
        try {
            const accessCode = Math.floor(100000 + Math.random() * 900000).toString();

            const docRef = await addDoc(collection(db, "presentations"), {
                title: title.trim(),
                ownerId: user.uid,
                accessCode,
                status: "draft",
                activeSlideId: null,
                config: {
                    requireName: false,
                    allowAnonymous: true,
                    accentColor: "#2563EB"
                },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            setOpen(false);
            setTitle("");
            // Redirect to editor
            router.push(`/presenter/editor/${docRef.id}`);
        } catch (error) {
            console.error("Error creating presentation:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Presentation
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Presentation</DialogTitle>
                    <DialogDescription>
                        Give your new presentation a name to get started.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                            Title
                        </Label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g. Weekly Standup"
                            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleCreate} disabled={loading || !title.trim()}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
