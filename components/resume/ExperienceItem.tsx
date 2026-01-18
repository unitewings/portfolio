import { MarkdownRenderer } from "@/components/shared/MarkdownRenderer";
import { WorkExperience } from "@/types";

export function ExperienceItem({ job }: { job: WorkExperience }) {
    // Format date: "2021 - 2023" or "2021 - Present"
    const startYear = new Date(job.startDate).getFullYear();
    const endYear = job.endDate === "Present" ? "Present" : new Date(job.endDate).getFullYear();

    return (
        <div className="relative pl-8 md:pl-0">
            {/* Mobile: Line is handled by parent or different structure, but here we assume a flex row on desktop */}
            <div className="flex flex-col md:flex-row md:gap-8 group">

                {/* Date Column (Left) */}
                <div className="mb-2 md:mb-0 md:w-32 md:flex-shrink-0 md:text-right">
                    <span className="font-mono text-xs text-muted-foreground">
                        {startYear} — {endYear}
                    </span>
                </div>

                {/* Content Column (Right) */}
                <div className="relative flex-1 pb-12">
                    {/* Timeline Dot (Desktop only typically, but let's place it absolutely) */}
                    <div className="absolute -left-[41px] top-1.5 h-3 w-3 rounded-full border border-border bg-background group-hover:border-primary group-hover:bg-primary transition-colors hidden md:block"></div>

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
