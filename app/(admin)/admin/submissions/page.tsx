import { getCommunitySubmissions } from "@/lib/data";
import { SubmissionsClient } from "./SubmissionsClient";

export const revalidate = 0; // Don't cache admin pages aggressively

export default async function AdminSubmissionsPage() {
    const submissions = await getCommunitySubmissions();

    return <SubmissionsClient initialSubmissions={submissions} />;
}
