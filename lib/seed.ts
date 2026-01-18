import 'server-only';
import fs from 'fs/promises';
import path from 'path';
import { ResumeData, BlogPost } from "@/types";

const DATA_DIR = path.join(process.cwd(), 'data');

export async function getLocalResume(): Promise<ResumeData | null> {
    try {
        const filePath = path.join(DATA_DIR, 'resume.json');
        const file = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(file);
    } catch (e) {
        console.warn("Local resume.json not found for seeding.");
        return null;
    }
}

export async function getLocalPosts(): Promise<BlogPost[]> {
    try {
        const filePath = path.join(DATA_DIR, 'posts.json');
        const file = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(file);
    } catch (e) {
        return [];
    }
}
