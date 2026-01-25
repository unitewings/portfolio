import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { ResumeData, BlogPost, SiteSettings, Page, Subscriber, ContactSubmission } from "@/types";
// import fs from 'fs/promises'; // REMOVED
// import path from 'path'; // REMOVED
import { getLocalResume, getLocalPosts } from "@/lib/seed";

// --- Seeding Logic ---
// We keep the local file reading logic ONLY for the initial seed.
// Imported from @/lib/seed to avoid fs issues in client bundle.

// --- Resume Operations ---

export async function getResume(): Promise<ResumeData> {
    const docRef = doc(db, "portfolio", "resume");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data() as ResumeData;
    } else {
        console.log("No resume in Firestore, attempting to seed from local...");
        const localData = await getLocalResume();
        if (localData) {
            await setDoc(docRef, localData);
            return localData;
        }

        // Return default/empty structure if seeding fails
        return {
            basics: { name: "New User", label: "", image: "", email: "", summary: "", location: { city: "", countryCode: "", region: "" }, profiles: [] },
            work: [], education: [], skills: [], publications: [], certifications: []
        };
    }
}

export async function saveResume(data: ResumeData): Promise<void> {
    const docRef = doc(db, "portfolio", "resume");
    await setDoc(docRef, data);
}

// --- Blog Post Operations ---

export async function getPosts(): Promise<BlogPost[]> {
    const colRef = collection(db, "posts");
    const snapshot = await getDocs(colRef);

    if (!snapshot.empty) {
        const posts = snapshot.docs.map(doc => doc.data() as BlogPost);
        return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    // Check if we need to seed (only if collection is completely empty)
    // Optimization: In a real app, maybe don't check every time. But for this migration tool it's fine.
    console.log("No posts in Firestore, checking local seed...");
    const localPosts = await getLocalPosts();

    if (localPosts.length > 0) {
        // Seed all posts
        await Promise.all(localPosts.map(post => {
            const docRef = doc(db, "posts", post.id);
            return setDoc(docRef, post);
        }));
        return localPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return [];
}

export async function savePost(post: BlogPost): Promise<void> {
    const docRef = doc(db, "posts", post.id);
    await setDoc(docRef, post);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
    const posts = await getPosts();
    return posts.find(p => p.slug === slug) || null;
}

export async function deletePost(id: string): Promise<void> {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
}

// --- Subscriber Operations ---

export async function subscribeToNewsletter(email: string, name: string, phone?: string): Promise<void> {
    // Check if distinct email needed, for now just push
    // In production we might want to check for duplicates
    const id = crypto.randomUUID();
    const docRef = doc(db, "subscribers", id);
    await setDoc(docRef, {
        id,
        email,
        name,
        phone: phone || null,
        subscribedAt: new Date().toISOString()
    });
}

export async function getSubscribers(): Promise<Subscriber[]> {
    const colRef = collection(db, "subscribers");
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) return [];
    return snapshot.docs.map(doc => doc.data() as Subscriber);
}

// --- Page Operations ---

export async function getPages(): Promise<Page[]> {
    const colRef = collection(db, "pages");
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) return [];

    const pages = snapshot.docs.map(doc => doc.data() as Page);

    // Ensure system pages exist
    const systemPages = [
        { id: "home", title: "Home", slug: "", path: "/", inSidebar: true, order: 0, isSystem: true, content: "" },
        { id: "resume", title: "Resume", slug: "resume", path: "/resume", inSidebar: true, order: 1, isSystem: true, content: "" },
        { id: "contact", title: "Contact", slug: "contact", path: "/contact", inSidebar: true, order: 2, isSystem: true, content: "" },
        { id: "resources", title: "Resources", slug: "resources", path: "/resources", inSidebar: true, order: 3, isSystem: true, content: "# Resources\n\nExplore our latest articles and resources." }
    ];

    let hasChanges = false;
    for (const sysPage of systemPages) {
        if (!pages.find(p => p.id === sysPage.id)) {
            console.log(`Seeding system page: ${sysPage.title}`);
            const docRef = doc(db, "pages", sysPage.id);
            await setDoc(docRef, sysPage);
            pages.push(sysPage as Page); // Add to local list
            hasChanges = true; // Mark change (though we added to local, sorting happens next)
        }
    }

    // Sort by order
    return pages.sort((a, b) => (a.order || 0) - (b.order || 0));
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
    const pages = await getPages();
    return pages.find(p => p.slug === slug) || null;
}

export async function savePage(page: Page): Promise<void> {
    const docRef = doc(db, "pages", page.id);
    await setDoc(docRef, page);
}

export async function deletePage(id: string): Promise<void> {
    const docRef = doc(db, "pages", id);
    await deleteDoc(docRef);
}

// --- Site Settings Operations ---

export async function getSiteSettings(): Promise<SiteSettings> {
    try {
        const docRef = doc(db, "portfolio", "settings");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as SiteSettings;
        }

        // Return defaults if not found
        return {
            globalTitle: "Jeff Su | Productivity & Gear",
            globalDescription: "Digital Knowledge Hub for Productivity, Gear, and Life.",
            homeIntroContent: "## Welcome\n\nI help people stay **productive** and find the best **gear** for their setup.",
            socialLinks: [],
            profileName: "Jeff Su",
            profileLabel: "Productivity Expert",
            newsletterTitle: "Newsletter",
            newsletterDescription: "Join 50k+ subscribers. Practical productivity tips delivered to your inbox.",
            contactIntro: "## Get in Touch\nI'd love to hear from you. Fill out the form below.",
            contactEmail: "hello@example.com",
        };
    } catch (error) {
        console.warn("Firestore error (settings), using defaults:", error);
        return {
            globalTitle: "Jeff Su | Productivity & Gear",
            globalDescription: "Digital Knowledge Hub for Productivity, Gear, and Life.",
            homeIntroContent: "## Welcome\n\nI help people stay **productive** and find the best **gear** for their setup.",
            socialLinks: [],
            profileName: "Jeff Su",
            profileLabel: "Productivity Expert",
            newsletterTitle: "Newsletter",
            newsletterDescription: "Join 50k+ subscribers. Practical productivity tips delivered to your inbox.",
            contactIntro: "## Get in Touch\nI'd love to hear from you. Fill out the form below.",
            contactEmail: "hello@example.com",
        };
    }
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
    const docRef = doc(db, "portfolio", "settings");
    await setDoc(docRef, settings);
}

// --- Contact Operations ---

export async function getContactSubmissions(): Promise<ContactSubmission[]> {
    const colRef = collection(db, "contact_submissions");
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) return [];

    const submissions = snapshot.docs.map(doc => doc.data() as ContactSubmission);
    // Sort by date descending
    return submissions.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export async function saveContactSubmission(submission: ContactSubmission): Promise<void> {
    const docRef = doc(db, "contact_submissions", submission.id);
    await setDoc(docRef, submission);
}



