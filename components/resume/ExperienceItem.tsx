import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
import { WorkExperience } from "@/types";

export function ExperienceItem({ job }: { job: WorkExperience }) {
    // Format date: "Jan 2021 - Present"
    const formatDate = (dateString: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };

    const startDateStr = formatDate(job.startDate);
    const endDateStr = job.endDate === "Present" ? "Present" : formatDate(job.endDate);

    return (
        <div className="relative pl-8 md:pl-0 hover-lift rounded-lg p-4 hover:bg-muted/40 transition-all border border-transparent hover:border-border/50">
            {/* Mobile: Line is handled by parent or different structure, but here we assume a flex row on desktop */}
            <div className="flex flex-col md:flex-row md:gap-8 group">

                {/* Date Column (Left) */}
                <div className="mb-2 md:mb-0 md:w-32 md:flex-shrink-0 md:text-right">
                    <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                        {startDateStr} – {endDateStr}
                    </span>
                </div>

                {/* Content Column (Right) */}
                <div className="relative flex-1 pb-12">
                    {/* Timeline Dot removed as per request */}

                    <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <h3 className="font-bold text-foreground">{job.company}</h3>
                            <span className="text-sm font-medium text-muted-foreground italic">
                                {job.position}
                            </span>
                        </div>

                        {job.summary && (
                            <div className="text-sm text-muted-foreground">
                                <MarkdownRenderer content={job.summary} />
                            </div>
                        )}

                        {job.highlights && job.highlights.length > 0 && (
                            <ul className="list-disc pl-4 space-y-1">
                                {job.highlights.map((highlight, index) => (
                                    <li key={index} className="text-sm text-muted-foreground/90 leading-relaxed">
                                        {highlight}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
