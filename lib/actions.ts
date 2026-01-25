"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { saveResume, savePost, getPosts, deletePost as deletePostData, saveSiteSettings, subscribeToNewsletter, savePage, deletePage as deletePageData, saveContactSubmission } from "@/lib/data";
import { ResumeData, BlogPost, SiteSettings, Page, ContactSubmission } from "@/types";
import { z } from "zod";

// --- Schemas (Basic validation) ---
const PostSchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1),
    excerpt: z.string(),
    content: z.string(),
    status: z.enum(["draft", "published"]),
});

// --- Actions ---

export async function updateResume(formData: FormData) {
    // In a real app, we'd parse the complex formData back into the JSON structure.
    // For this demo, we'll assume the client sends a raw JSON string for the complex nested object
    // or we handle specific fields if we built a granular form.
    // To keep it simple and robust for the 'Simulated CMS', accepting a JSON string 
    // from a hidden input populated by the client-side form state is often easiest for deep nesting.

    const rawData = formData.get("resumeData");
    if (!rawData || typeof rawData !== "string") {
        throw new Error("Invalid data");
    }

    try {
        const data: ResumeData = JSON.parse(rawData);
        await saveResume(data);
        revalidatePath("/resume");
        revalidatePath("/admin/resume");
        return { success: true, message: "Resume updated successfully" };
    } catch (error) {
        console.error("Update resume error", error);
        return { success: false, message: "Failed to update resume" };
    }
}

export async function createPost(formData: FormData) {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const status = formData.get("status") as "draft" | "published";
    const tagsStr = formData.get("tags") as string; // comma separated
    const pinned = formData.get("pinned") === "on";
    const isListed = formData.get("isListed") === "on"; // Checkbox present = true
    const isProtected = formData.get("isProtected") === "on"; // Default false
    const password = formData.get("password") as string;
    const passwordHintLink = formData.get("passwordHintLink") as string;

    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const newPost: BlogPost = {
        id: crypto.randomUUID(),
        title,
        slug,
        date: new Date().toISOString(),
        excerpt,
        content,
        tags: tagsStr ? tagsStr.split(",").map(t => t.trim()) : [],
        status,
        pinned,

        type: "article",
        isListed,
        isProtected,
        password,
        passwordHintLink
    };

    await savePost(newPost);
    revalidatePath("/");
    revalidatePath("/admin/posts");
    redirect("/admin/posts");
}

export async function updatePost(formData: FormData) {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const status = formData.get("status") as "draft" | "published";
    const tagsStr = formData.get("tags") as string;
    const pinned = formData.get("pinned") === "on";
    const isListed = formData.get("isListed") === "on"; // Checkbox present = true
    const isProtected = formData.get("isProtected") === "on"; // Default false
    const password = formData.get("password") as string;
    const passwordHintLink = formData.get("passwordHintLink") as string;
    const slug = formData.get("slug") as string;

    // SEO Fields
    const seoTitle = formData.get("seoTitle") as string;
    const seoDescription = formData.get("seoDescription") as string;
    const canonicalUrl = formData.get("canonicalUrl") as string;

    if (!id) throw new Error("Missing Post ID");

    // Retrieve existing date or use current if missing (shouldn't happen for update)
    // For simplicity, we keep original date.

    // Construct updated post
    // Note: In a real app we might fetch the old post to keep 'date' and other fields not in form.
    // Here we assume form has everything or we just overwrite. 
    // Ideally we should get the existing post first to preserve 'date'.

    const { getPostBySlug, savePost } = await import("@/lib/data");
    // Using dynamic import or just standard import. standard is fine since we are in actions.ts
    // But wait, savePost is already imported at top.

    const date = formData.get("date") as string || new Date().toISOString();

    const updatedPost: BlogPost = {
        id,
        title,
        slug, // In strict systems filters slug changes, here we trust form
        date,
        excerpt,
        content,
        tags: tagsStr ? tagsStr.split(",").map(t => t.trim()) : [],
        status,
        pinned,
        type: "article",
        seoTitle,
        seoDescription,
        canonicalUrl,
        isListed,
        isProtected,
        password,
        passwordHintLink
    };

    await savePost(updatedPost);
    revalidatePath("/");
    revalidatePath(`/posts/${slug}`);
    revalidatePath("/admin/posts");
    redirect("/admin/posts");
}

export async function verifyPostPassword(postId: string, password: string) {
    const { getPosts, getPages } = await import("@/lib/data");
    const posts = await getPosts();
    const post = posts.find(p => p.id === postId);

    if (!post) {
        return { success: false, message: "Post not found" };
    }

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();

    // 1. Check direct Post Password
    if (post.isProtected && post.password === password) {
        cookieStore.set(`access_granted_${postId}`, "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/"
        });
        return { success: true };
    }

    // 2. Check Parent Page Password (Inheritance)
    const allPages = await getPages();
    const parentPage = allPages.find(page =>
        page.postIds?.includes(postId) && page.isProtected
    );

    if (parentPage && parentPage.password === password) {
        // Unlock the PAGE, which in turn unlocks the post
        cookieStore.set(`access_granted_page_${parentPage.id}`, "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/"
        });
        return { success: true };
    }

    // 3. If neither matched
    return { success: false, message: "Incorrect password" };
}

export async function deletePost(id: string) {
    await deletePostData(id);
    revalidatePath("/");
    revalidatePath("/admin/posts");
}

export async function updateSettings(data: SiteSettings) {
    if (!data.globalTitle || !data.globalDescription) {
        throw new Error("Title and Description are required");
    }

    await saveSiteSettings(data);
    revalidatePath("/");
    revalidatePath("/admin/settings");
}

export async function subscribe(formData: FormData) {
    const email = formData.get("email");
    const name = formData.get("name");
    const phone = formData.get("phone");

    if (!email || typeof email !== "string") {
        return { success: false, message: "Invalid email" };
    }
    if (!name || typeof name !== "string") {
        return { success: false, message: "Name is required" };
    }

    try {
        await subscribeToNewsletter(email, name, typeof phone === "string" ? phone : undefined);
        return { success: true, message: "Subscribed successfully!" };
    } catch (error) {
        console.error("Subscription error", error);
        return { success: false, message: "Failed to subscribe" };
    }
}



export async function savePageAction(page: Page) {
    // Basic validation
    if (!page.title || !page.slug) {
        return { success: false, message: "Title and Slug are required" };
    }

    try {
        await savePage(page);
        revalidatePath("/");
        revalidatePath("/admin/pages");
        // Revalidate the specific page if it exists
        revalidatePath(`/${page.slug}`);
        return { success: true, message: "Page saved successfully!" };
    } catch (error) {
        console.error("Save page error", error);
        return { success: false, message: "Failed to save page" };
    }
}

export async function deletePageAction(id: string) {
    try {
        await deletePageData(id);
        revalidatePath("/");
        revalidatePath("/admin/pages");
        return { success: true, message: "Page deleted successfully" };
    } catch (error) {
        console.error("Delete page error", error);
        return { success: false, message: "Failed to delete page" };
    }
}

export async function submitContactForm(formData: FormData) {
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const message = formData.get("message");

    // Optional fields
    const phone = formData.get("phone");
    const category = formData.get("category");

    if (!firstName || !lastName || !email || !message) {
        return { success: false, message: "Missing required fields" };
    }

    const submission: ContactSubmission = {
        id: crypto.randomUUID(),
        firstName: firstName as string,
        lastName: lastName as string,
        email: email as string,
        message: message as string,
        phone: typeof phone === "string" && phone.length > 0 ? phone : undefined,
        category: typeof category === "string" && category.length > 0 ? category : undefined,
        submittedAt: new Date().toISOString()
    };

    try {
        await saveContactSubmission(submission);
        revalidatePath("/admin/messages");
        return { success: true, message: "Message sent successfully!" };
    } catch (error) {
        console.error("Contact submission error details:", error);
        return { success: false, message: "Failed to send message" };
    }
}


export async function verifyPagePassword(pageId: string, password: string) {
    const { getPages } = await import("@/lib/data");
    const pages = await getPages();
    const page = pages.find(p => p.id === pageId);

    if (!page || !page.password) {
        return { success: false, message: "Page not found or not protected" };
    }

    if (page.password === password) {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        // Set a cookie to remember access to this specific page
        cookieStore.set(`access_granted_page_${pageId}`, "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/"
        });
        return { success: true };
    }

    return { success: false, message: "Incorrect password" };
}

export async function deleteMessagesAction(ids: string[]) {
    try {
        const { deleteContactSubmission } = await import("@/lib/data");
        await Promise.all(ids.map(id => deleteContactSubmission(id)));
        revalidatePath("/admin/messages");
        return { success: true, message: `Deleted ${ids.length} messages` };
    } catch (error) {
        console.error("Delete messages error", error);
        return { success: false, message: "Failed to delete messages" };
    }
}

export async function deleteSubscribersAction(ids: string[]) {
    try {
        const { deleteSubscriber } = await import("@/lib/data");
        await Promise.all(ids.map(id => deleteSubscriber(id)));
        revalidatePath("/admin/subscribers");
        return { success: true, message: `Deleted ${ids.length} subscribers` };
    } catch (error) {
        console.error("Delete subscribers error", error);
        return { success: false, message: "Failed to delete subscribers" };
    }
}
