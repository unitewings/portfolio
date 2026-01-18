import { getResume } from "@/lib/data";
import ResumeForm from "@/components/admin/ResumeForm";

export default async function ResumeManagerPage() {
    const resume = await getResume();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Edit Resume</h1>
            </div>
            <ResumeForm initialData={resume} />
        </div>
    );
}
