"use server";

import { cookies } from "next/headers";

export async function setSessionCookie(token: string) {
    const cookieStore = await cookies();
    // In a real production app, verify the token with firebase-admin here.
    // For now, we trust the client-side authentication for this personal portfolio.
    // We set a session cookie that middleware will check.

    cookieStore.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 5, // 5 days
        path: "/",
    });
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}
