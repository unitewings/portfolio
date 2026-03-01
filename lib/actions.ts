"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { saveResume, savePost, deletePost as deletePostData, saveSiteSettings, subscribeToNewsletter, savePage, deletePage as deletePageData, saveContactSubmission, saveCommunitySubmission as saveDataCommunitySubmission, updateCommunitySubmission as updateDataCommunitySubmission } from "@/lib/data";
import { ResumeData, BlogPost, SiteSettings, Page, ContactSubmission, CommunitySubmission } from "@/types";
import { z } from "zod";

// --- Actions ---

export async function uploadFile(formData: FormData) {
    const file = formData.get("file") as File | Blob;
    if (!file || typeof file.arrayBuffer !== 'function') {
        return { success: false, message: "No valid file provided" };
    }

    try {
        const cloudinaryUrl = process.env.CLOUDINARY_URL;
        if (!cloudinaryUrl) {
            throw new Error("Missing Cloudinary configuration");
        }

        // Parse cloudinary://key:secret@cloud_name
        const match = cloudinaryUrl.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
        if (!match) {
            throw new Error("Invalid Cloudinary URL format");
        }

        const [, apiKey, apiSecret, cloudName] = match;

        // Convert the File to a Base64 string for the Cloudinary API
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Data = buffer.toString('base64');
        const fileDataUri = `data:${file.type};base64,${base64Data}`;

        const timestamp = Math.round(new Date().getTime() / 1000);

        // Required imports for creating the signature
        const crypto = await import("crypto");
        const signatureStr = `timestamp=${timestamp}${apiSecret}`;
        const signature = crypto.createHash("sha1").update(signatureStr).digest("hex");

        const submitData = new FormData();
        submitData.append("file", fileDataUri);
        submitData.append("api_key", apiKey);
        submitData.append("timestamp", timestamp.toString());
        submitData.append("signature", signature);
        // Optional: specify a folder
        // submitData.append("folder", "portfolio_uploads");

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
            method: "POST",
            body: submitData,
        });

        if (!uploadRes.ok) {
            const errorData = await uploadRes.json();
            console.error("Cloudinary upload failed:", errorData);
            throw new Error(errorData.error?.message || "Cloudinary upload failed");
        }

        const result = await uploadRes.json();
        return { success: true, url: result.secure_url };
    } catch (error) {
        console.error("File upload failed:", error);
        return { success: false, message: "Failed to upload file to Cloudinary" };
    }
}

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
    const thumbnailUrl = formData.get("thumbnailUrl") as string;

    const type = (formData.get("type") as BlogPost["type"]) || "article";

    const titleStr = title || "untitled";
    const slug = titleStr
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

        type,
        thumbnailUrl,
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
    const thumbnailUrl = formData.get("thumbnailUrl") as string;

    const type = (formData.get("type") as BlogPost["type"]) || "article";

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
    // savePost is already imported at top.

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
        type,
        thumbnailUrl,
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

export async function verifyPostEmailAccess(postId: string, name: string, email: string) {
    const { getPosts, getPages, subscribeToNewsletter } = await import("@/lib/data");
    const posts = await getPosts();
    const post = posts.find(p => p.id === postId);

    if (!post) {
        return { success: false, message: "Post not found" };
    }

    if (!name || !email) {
        return { success: false, message: "Name and Email are required" };
    }

    try {
        await subscribeToNewsletter(email, name);
    } catch (e) {
        console.error("Failed to subscribe user", e);
    }

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();

    // 1. Check direct Post Password
    if (post.isProtected) {
        cookieStore.set(`access_granted_${postId}`, "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: "/"
        });

        cookieStore.set(`access_granted_global`, "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: "/"
        });
        return { success: true };
    }

    // 2. Check Parent Page Password (Inheritance)
    const allPages = await getPages();
    const parentPage = allPages.find(page =>
        page.postIds?.includes(postId) && page.isProtected
    );

    if (parentPage) {
        // Unlock the PAGE, which in turn unlocks the post
        cookieStore.set(`access_granted_page_${parentPage.id}`, "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: "/"
        });

        cookieStore.set(`access_granted_global`, "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 365, // 1 year
            path: "/"
        });
        return { success: true };
    }

    return { success: true };
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


export async function verifyPageEmailAccess(pageId: string, name: string, email: string) {
    const { getPages, subscribeToNewsletter } = await import("@/lib/data");
    const pages = await getPages();
    const page = pages.find(p => p.id === pageId);

    if (!page || !page.isProtected) {
        return { success: false, message: "Page not found or not protected" };
    }

    if (!name || !email) {
        return { success: false, message: "Name and Email are required" };
    }

    try {
        await subscribeToNewsletter(email, name);
    } catch (e) {
        console.error("Failed to subscribe user", e);
    }

    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    // Set a cookie to remember access to this specific page
    cookieStore.set(`access_granted_page_${pageId}`, "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/"
    });

    // Set a global cookie to unlock globally
    cookieStore.set(`access_granted_global`, "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: "/"
    });
    return { success: true };
}

export async function deleteMessagesAction(ids: string[]) {
    try {
        const { deleteContactSubmission } = await import("@/lib/data");
        await Promise.all(ids.map(id => deleteContactSubmission(id)));
        revalidatePath("/admin/messages");
        return { success: true, message: `Deleted ${ids.length} messages` };
    } catch (error) {
        console.error("Delete messages error", error);
        if (error instanceof Error) {
            return { success: false, message: error.message };
        }
        return { success: false, message: "An unknown error occurred" };
    }
}

// --- Community Submissions Actions ---

export async function submitCommunityContent(formData: FormData) {
    try {
        const authorName = formData.get("authorName") as string;
        const email = formData.get("email") as string;
        const category = formData.get("category") as string;
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const attachmentsStr = formData.get("attachments") as string;
        const file = formData.get("file") as File | null;

        const attachments = attachmentsStr ? JSON.parse(attachmentsStr) : [];

        if (file && typeof file.arrayBuffer === 'function' && file.size > 0) {
            // Pass the original formData to uploadFile to avoid stripping Next.js File prototype
            const uploadResult = await uploadFile(formData);

            if (uploadResult.success && uploadResult.url) {
                attachments.push({
                    name: file.name,
                    url: uploadResult.url,
                    type: file.type || 'document'
                });
            } else {
                return { success: false, message: "Failed to upload document. " + (uploadResult.message || "") };
            }
        }

        if (!authorName || !email || !category || !title || !content) {
            return { success: false, message: "Missing required fields" };
        }

        const submission: CommunitySubmission = {
            id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            authorName,
            email,
            category,
            title,
            content,
            attachments,
            status: 'pending',
            submittedAt: new Date().toISOString(),
        };

        await saveDataCommunitySubmission(submission);

        // Optional: Send an email notification about the new submission
        // ...

        return { success: true, message: "Submission received successfully!" };
    } catch (error) {
        console.error("Content submission failed:", error);
        if (error instanceof Error) {
            return { success: false, message: error.message };
        }
        return { success: false, message: "An unknown error occurred" };
    }
}

export async function manageCommunitySubmission(id: string, action: 'approve' | 'reject', editorNotes?: string) {
    try {
        const updates: Partial<CommunitySubmission> = {
            status: action === 'approve' ? 'approved' : 'rejected',
        };

        if (editorNotes !== undefined) {
            updates.editorNotes = editorNotes;
        }

        await updateDataCommunitySubmission(id, updates);
        return { success: true, message: `Submission ${action}d successfully` };
    } catch (error) {
        console.error(`Failed to ${action} submission:`, error);
        return { success: false, message: "Failed to update submission" };
    }
}

export async function deleteCommunitySubmissionAction(id: string) {
    try {
        const { deleteCommunitySubmission } = await import("@/lib/data");
        await deleteCommunitySubmission(id);
        revalidatePath("/admin/submissions");
        return { success: true, message: "Submission deleted successfully" };
    } catch (error) {
        console.error("Failed to delete submission:", error);
        return { success: false, message: "Failed to delete submission" };
    }
}

export async function editCommunitySubmissionAction(id: string, title: string, category: string, content: string, editorNotes?: string) {
    try {
        const { updateCommunitySubmission } = await import("@/lib/data");
        await updateCommunitySubmission(id, { title, category, content, editorNotes });
        revalidatePath("/admin/submissions");
        return { success: true, message: "Submission updated successfully" };
    } catch (error) {
        console.error("Failed to edit submission:", error);
        return { success: false, message: "Failed to update submission" };
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

export async function updateMDXSettings(iframeAllowlist: string) {
    try {
        const { saveMDXSettings } = await import("@/lib/data");
        await saveMDXSettings({ iframeAllowlist });
        revalidatePath("/admin/mdx-components");
        return { success: true, message: "MDX settings saved successfully!" };
    } catch (error) {
        console.error("Update MDX settings error", error);
        return { success: false, message: "Failed to save MDX settings" };
    }
}

// --- Reaction Actions ---

export async function addReaction(type: 'claps' | 'highFives') {
    try {
        const { incrementReaction } = await import("@/lib/data");
        await incrementReaction(type);
        revalidatePath("/");
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error(`Failed to add reaction: ${type}`, error);
        return { success: false, message: "Failed to save reaction" };
    }
}

