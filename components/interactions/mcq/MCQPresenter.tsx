"use client";

import { useEffect, useState } from "react";
import { Slide, Response } from "@/types/uw-interact";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";

interface MCQPresenterProps {
    slide: Slide;
}

export function MCQPresenter({ slide }: MCQPresenterProps) {
    const [data, setData] = useState<{ name: string, count: number, fill: string }[]>([]);

    useEffect(() => {
        // Listen to responses for this slide
        const q = query(
            collection(db, "responses"),
            where("slideId", "==", slide.id)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const responses = snapshot.docs.map(doc => doc.data()) as Response[];

            // Aggregation
            const counts: Record<string, number> = {};
            // Initialize counts
            slide.content.options?.forEach(opt => counts[opt.id] = 0);

            responses.forEach(r => {
                if (r.data.optionId && counts[r.data.optionId] !== undefined) {
                    counts[r.data.optionId]++;
                }
            });

            // Format for Recharts
            const chartData = slide.content.options?.map((opt, index) => ({
                name: opt.label,
                count: counts[opt.id] || 0,
                fill: opt.color || `hsl(${index * 60}, 70%, 50%)` // Fallback colors
            })) || [];

            setData(chartData);
        });

        return () => unsubscribe();
    }, [slide.id, slide.content.options]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <h2 className="text-4xl font-bold mb-8 text-center">{slide.content.question}</h2>

            <div className="w-full h-[400px] max-w-4xl">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={150}
                            tick={{ fill: 'currentColor', fontSize: 18, fontWeight: 600 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '8px', color: '#fff' }}
                            cursor={{ fill: 'rgba(255,255,255,0.1)' }}
                        />
                        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Legend / Total votes */}
            <div className="mt-8 text-2xl font-mono text-muted-foreground">
                Total Votes: {data.reduce((acc, curr) => acc + curr.count, 0)}
            </div>
        </div>
    );
}
