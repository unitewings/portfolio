import { getResume } from "@/lib/data";
import { ExperienceItem } from "@/components/resume/ExperienceItem";
import { Mail, Github, Linkedin, Globe, Twitter, Youtube, Facebook, Instagram } from "lucide-react";
import { MDXRenderer } from "@/components/shared/MDXRenderer";

// Simple icon helper (duplicated for now to avoid large refactor, or we could export from NavComponents)
const getSocialIcon = (network: string) => {
    const n = network.toLowerCase();
    if (n.includes("github")) return Github;
    if (n.includes("linkedin")) return Linkedin;
    if (n.includes("twitter") || n.includes("x")) return Twitter;
    if (n.includes("youtube")) return Youtube;
    if (n.includes("facebook")) return Facebook;
    if (n.includes("instagram")) return Instagram;
    return Globe;
};

export const dynamic = "force-dynamic";

export default async function ResumePage() {
    const resume = await getResume();
    const { basics, work, education, skills } = resume;

    return (
        <div className="space-y-12 animate-in fade-in duration-500">

            {/* Header / Basics */}
            <section className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">{basics.name}</h1>
                <div className="text-xl text-muted-foreground max-w-2xl">
                    <MDXRenderer content={basics.summary} />
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                    {basics.email && (
                        <a href={`mailto:${basics.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                            <Mail size={16} />
                            <span>{basics.email}</span>
                        </a>
                    )}
                    {basics.url && (
                        <a href={basics.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                            <Globe size={16} />
                            <span>Website</span>
                        </a>
                    )}
                    {basics.profiles.map((profile, idx) => {
                        const Icon = getSocialIcon(profile.network);
                        return (
                            <a
                                key={idx}
                                href={profile.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Icon size={16} />
                                <span>{profile.network}</span>
                            </a>
                        );
                    })}
                </div>
            </section>

            <hr className="border-border" />

            {/* Experience */}
            <section className="space-y-8">
                <h2 className="text-2xl font-bold tracking-tight">Experience</h2>
                <div className="relative border-l border-border md:border-l-0 md:ml-0 ml-3 space-y-0">
                    {/* The vertical line for desktop is handled by the left border of the container or passing through items 
                 Actually, simpler to rely on the individual item structure or a global border line.
                 Let's add a continuous line for desktop manually if we want it perfect, 
                 or just use the component's relative positioning.
                 For this implementation, let's put a border on the left side of a wrapper div for mobile,
                 and for desktop we usually use a central or offset line. 
                 The ExperienceItem has a 'hidden md:block' dot at -left-[41px].
                 So we need a line at that position.
             */}
                    <div className="hidden md:block absolute left-[85px] top-2 bottom-0 w-px bg-border"></div>

                    {work.map((job) => (
                        <ExperienceItem key={job.id} job={job} />
                    ))}
                </div>
            </section>

            {/* Education */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Education</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                    {education.map((edu) => (
                        <div key={edu.id} className="rounded-lg border bg-card p-4">
                            <h3 className="font-semibold">{edu.institution}</h3>
                            <p className="text-sm text-muted-foreground">{edu.area}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                                {new Date(edu.startDate).getFullYear()} - {new Date(edu.endDate).getFullYear()}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Skills */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Skills</h2>
                <div className="space-y-6">
                    {skills.map((skillGroup) => (
                        <div key={skillGroup.id} className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                                {skillGroup.name}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {skillGroup.keywords.map((keyword) => (
                                    <span key={keyword} className="inline-flex items-center rounded-md border border-transparent bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/20">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    );
}
