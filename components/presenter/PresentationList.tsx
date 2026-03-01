"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/use-auth";
import { Presentation } from "@/types/uw-interact";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Edit, Calendar, BarChart3 } from "lucide-react";
import { formatDistanceToNow } from "date-fns"; // Need to install date-fns or use native

export function PresentationList() {
    const { user } = useAuth();
    const [presentations, setPresentations] = useState<Presentation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "presentations"),
            where("ownerId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Presentation[];
            setPresentations(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    if (loading) {
        return <div className="text-muted-foreground">Loading presentations...</div>;
    }

    if (presentations.length === 0) {
        return (
            <div className="rounded-md border bg-card p-8 text-center text-muted-foreground w-full">
                No presentations found. Create one to get started.
            </div>
        );
    }

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {presentations.map((p) => (
                <Card key={p.id} className="flex flex-col hover:border-primary/50 transition-colors">
                    <CardHeader>
                        <CardTitle className="truncate">{p.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                            <span className={`inline-block w-2 h-2 rounded-full ${p.status === 'live' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                            {p.status.toUpperCase()}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar size={14} />
                            {(p.createdAt as any)?.seconds ? new Date((p.createdAt as any).seconds * 1000).toLocaleDateString() : 'Just now'}
                        </div>
                        <div className="mt-2 text-xs font-mono bg-muted inline-block px-2 py-1 rounded">
                            Code: {p.accessCode}
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-2 border-t pt-4">
                        <Button variant="outline" className="flex-1" asChild>
                            <Link href={`/presenter/editor/${p.id}`}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                            </Link>
                        </Button>
                        <Button variant="outline" size="icon" asChild>
                            <Link href={`/admin/presenter/analytics/${p.id}`}>
                                <BarChart3 className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button className="flex-1" asChild>
                            <Link href={`/presenter/live/${p.id}`} target="_blank">
                                <Play className="mr-2 h-4 w-4" /> Present
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
