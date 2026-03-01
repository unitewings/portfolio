"use client";

import { use, useEffect, useState } from "react";
import { doc, onSnapshot, collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Presentation, Response, Slide, PresentationSession } from "@/types/uw-interact";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Users, MessageSquare, BarChart2, Calendar } from "lucide-react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow, format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SlideWithResponses extends Slide {
    responses: Response[];
}

export default function AnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [presentation, setPresentation] = useState<Presentation | null>(null);
    const [slides, setSlides] = useState<Slide[]>([]);
    const [sessions, setSessions] = useState<PresentationSession[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [allResponses, setAllResponses] = useState<Response[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingResponses, setLoadingResponses] = useState(false);

    // Fetch presentation
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "presentations", id), (docSnap) => {
            if (docSnap.exists()) {
                setPresentation({ id: docSnap.id, ...docSnap.data() } as Presentation);
            }
        });
        return () => unsub();
    }, [id]);

    // Fetch slides
    useEffect(() => {
        const q = query(collection(db, "presentations", id, "slides"), orderBy("order", "asc"));
        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as Slide[];
            setSlides(data);
        });
        return () => unsub();
    }, [id]);

    // Fetch sessions
    useEffect(() => {
        const q = query(collection(db, "presentations", id, "liveSessions"), orderBy("startedAt", "desc"));
        const unsub = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as unknown as PresentationSession[];
            setSessions(data);
            // Auto-select first session if none selected
            if (data.length > 0 && !selectedSessionId) {
                setSelectedSessionId(data[0].id);
            }
            setLoading(false);
        });
        return () => unsub();
    }, [id, selectedSessionId]);

    // Fetch responses for selected session
    useEffect(() => {
        if (!selectedSessionId || slides.length === 0) {
            return;
        }

        const fetchResponses = async () => {
            setLoadingResponses(true);
            const responses: Response[] = [];

            for (const slide of slides) {
                const responsesRef = collection(db, "presentations", id, "liveSessions", selectedSessionId, "slides", slide.id, "responses");
                const snapshot = await getDocs(responsesRef);
                snapshot.docs.forEach(d => {
                    responses.push({ id: d.id, ...d.data() } as Response);
                });
            }

            setAllResponses(responses);
            setLoadingResponses(false);
        };

        fetchResponses();
    }, [selectedSessionId, slides, id]);

    // Map responses to slides
    const slidesWithResponses: SlideWithResponses[] = slides.map(slide => ({
        ...slide,
        responses: allResponses.filter(r => r.slideId === slide.id)
    }));

    const handleExportCSV = () => {
        if (!allResponses.length) return;

        const headers = ["Session", "Slide", "Question", "Participant", "Response", "Timestamp"];
        const selectedSession = sessions.find(s => s.id === selectedSessionId);
        const sessionLabel = selectedSession?.startedAt
            ? format(new Date((selectedSession.startedAt as any).seconds * 1000), "MMM d, yyyy HH:mm")
            : selectedSessionId;

        const rows = allResponses.map(r => {
            const slide = slides.find(s => s.id === r.slideId);
            return [
                sessionLabel,
                `Slide ${(slides.findIndex(s => s.id === r.slideId) + 1) || '?'}`,
                slide?.content?.question || "Unknown",
                r.participantId.slice(0, 8),
                r.data.optionId || r.data.text || JSON.stringify(r.data),
                r.createdAt ? new Date((r.createdAt as any).seconds * 1000).toISOString() : ""
            ];
        });

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.map(c => `"${c}"`).join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `analytics_${presentation?.title || id}_${selectedSessionId}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="p-8">Loading analytics...</div>;

    const uniqueParticipants = new Set(allResponses.map(r => r.participantId)).size;
    const selectedSession = sessions.find(s => s.id === selectedSessionId);

    return (
        <div className="container mx-auto p-8 max-w-5xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/admin/presenter">
                            <ArrowLeft size={18} />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                        <p className="text-muted-foreground">{presentation?.title}</p>
                    </div>
                </div>
                <Button onClick={handleExportCSV} disabled={!allResponses.length}>
                    <Download className="mr-2 h-4 w-4" /> Export CSV
                </Button>
            </div>

            {/* Session Selector */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Select Session</label>
                {sessions.length === 0 ? (
                    <p className="text-muted-foreground">No sessions recorded yet. Present your slideshow to create a session.</p>
                ) : (
                    <div className="flex gap-2 flex-wrap">
                        {sessions.map((session, index) => (
                            <button
                                key={session.id}
                                onClick={() => setSelectedSessionId(session.id)}
                                className={`px-4 py-2 rounded-lg border transition-all flex items-center gap-2 ${selectedSessionId === session.id
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-border hover:border-primary/50"
                                    }`}
                            >
                                <Calendar size={14} />
                                <span className="font-medium">Session {sessions.length - index}</span>
                                <span className="text-xs text-muted-foreground">
                                    {session.startedAt && format(new Date((session.startedAt as any).seconds * 1000), "MMM d, HH:mm")}
                                </span>
                                {session.participantCount > 0 && (
                                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                                        {session.participantCount} 👤
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {selectedSession && (
                <>
                    {/* Summary Cards */}
                    <div className="grid gap-4 md:grid-cols-3 mb-8">
                        <div className="p-6 bg-card rounded-xl border shadow-sm">
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                <Users size={16} /> Participants
                            </div>
                            <div className="text-3xl font-bold">
                                {loadingResponses ? "..." : uniqueParticipants}
                            </div>
                        </div>
                        <div className="p-6 bg-card rounded-xl border shadow-sm">
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                <MessageSquare size={16} /> Total Responses
                            </div>
                            <div className="text-3xl font-bold">
                                {loadingResponses ? "..." : allResponses.length}
                            </div>
                        </div>
                        <div className="p-6 bg-card rounded-xl border shadow-sm">
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                <BarChart2 size={16} /> Slides
                            </div>
                            <div className="text-3xl font-bold">{slides.length}</div>
                        </div>
                    </div>

                    {/* Tabs for By Slide / All Responses */}
                    <Tabs defaultValue="by-slide" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="by-slide">By Slide</TabsTrigger>
                            <TabsTrigger value="all">All Responses</TabsTrigger>
                        </TabsList>

                        <TabsContent value="by-slide" className="space-y-6">
                            {loadingResponses ? (
                                <div className="text-center py-8 text-muted-foreground">Loading responses...</div>
                            ) : slidesWithResponses.length === 0 ? (
                                <div className="text-center text-muted-foreground py-8">No slides found.</div>
                            ) : (
                                slidesWithResponses.map((slide, index) => (
                                    <div key={slide.id} className="border rounded-lg overflow-hidden">
                                        <div className="bg-muted/50 px-4 py-3 border-b">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="text-sm font-mono text-muted-foreground mr-2">
                                                        Slide {index + 1}
                                                    </span>
                                                    <span className="font-medium">{slide.content?.question || "Untitled"}</span>
                                                </div>
                                                <span className="text-sm text-muted-foreground">
                                                    {slide.responses.length} responses
                                                </span>
                                            </div>
                                        </div>
                                        {slide.responses.length === 0 ? (
                                            <div className="p-4 text-center text-muted-foreground text-sm">
                                                No responses yet
                                            </div>
                                        ) : (
                                            <div className="divide-y">
                                                {slide.responses.slice(0, 20).map((r, i) => (
                                                    <div key={i} className="px-4 py-3 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-mono">
                                                                {r.participantId.slice(0, 2).toUpperCase()}
                                                            </div>
                                                            <span className="font-medium">
                                                                {r.data.text || r.data.optionId || JSON.stringify(r.data)}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">
                                                            {r.createdAt && formatDistanceToNow(new Date((r.createdAt as { seconds: number }).seconds * 1000), { addSuffix: true })}
                                                        </span>
                                                    </div>
                                                ))}
                                                {slide.responses.length > 20 && (
                                                    <div className="px-4 py-2 text-center text-sm text-muted-foreground">
                                                        + {slide.responses.length - 20} more responses
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </TabsContent>

                        <TabsContent value="all">
                            {loadingResponses ? (
                                <div className="text-center py-8 text-muted-foreground">Loading responses...</div>
                            ) : allResponses.length === 0 ? (
                                <div className="text-center text-muted-foreground py-8">
                                    No responses in this session.
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Slide</TableHead>
                                            <TableHead>Participant</TableHead>
                                            <TableHead>Response</TableHead>
                                            <TableHead>Time</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {allResponses.map((r, i) => (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    Slide {(slides.findIndex(s => s.id === r.slideId) + 1) || "?"}
                                                </TableCell>
                                                <TableCell className="font-mono text-xs">
                                                    {r.participantId.slice(0, 8)}
                                                </TableCell>
                                                <TableCell>
                                                    {r.data.text || r.data.optionId || JSON.stringify(r.data)}
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {r.createdAt && formatDistanceToNow(new Date((r.createdAt as { seconds: number }).seconds * 1000), { addSuffix: true })}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </TabsContent>
                    </Tabs>
                </>
            )}
        </div>
    );
}
