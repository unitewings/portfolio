import { NextResponse } from "next/server";
import { getMDXSettings } from "@/lib/data";

export async function GET() {
    try {
        const settings = await getMDXSettings();
        return NextResponse.json(settings);
    } catch (error) {
        console.error("Error fetching MDX settings:", error);
        return NextResponse.json(
            { error: "Failed to fetch MDX settings" },
            { status: 500 }
        );
    }
}
