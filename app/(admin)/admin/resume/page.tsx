import Link from "next/link";

const resumeData = {
    basics: {
        name: "Swarn Shauryam",
        label: "Full-Stack Developer & Digital Strategist",
        email: "swarnshauryam@gmail.com",
        url: "https://swarn.unitewings.com",
        summary: "Passionate full-stack developer with expertise in building modern web applications, digital strategies, and creative solutions. Focused on delivering premium user experiences through clean code and thoughtful design.",
        location: { city: "Dehradun", countryCode: "IN", region: "Uttarakhand" },
    },
    work: [
        {
            id: "1",
            company: "UNITEwings Technologies",
            position: "Full-Stack Developer",
            startDate: "2023-01-01",
            endDate: "Present",
            summary: "Leading full-stack development initiatives and digital product strategy.",
            highlights: [
                "Built and deployed multiple production web applications using Next.js and Firebase",
                "Implemented modern authentication, real-time databases, and push notifications",
                "Designed premium portfolio and admin dashboard systems"
            ],
        },
        {
            id: "2",
            company: "Freelance",
            position: "Web Developer & Digital Consultant",
            startDate: "2021-06-01",
            endDate: "2022-12-31",
            summary: "Delivered custom web solutions for various clients.",
            highlights: [
                "Created responsive, SEO-optimized websites for small businesses",
                "Implemented payment integrations and booking systems",
                "Provided technical consulting for digital transformation projects"
            ],
        },
    ],
    education: [
        {
            id: "1",
            institution: "Graphic Era University",
            area: "Computer Science & Engineering",
            studyType: "B.Tech",
            startDate: "2020",
            endDate: "2024",
            score: "",
        },
    ],
    skills: [
        { id: "1", name: "Frontend", keywords: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML/CSS"] },
        { id: "2", name: "Backend", keywords: ["Node.js", "Firebase", "REST APIs", "PostgreSQL", "MongoDB"] },
        { id: "3", name: "Tools & DevOps", keywords: ["Git", "Vercel", "Figma", "Docker", "CI/CD"] },
        { id: "4", name: "Skills", keywords: ["UI/UX Design", "SEO", "Performance Optimization", "Technical Writing"] },
    ],
};

export default function ResumeManagerPage() {
    return (
        <>
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Resume</h1>
                    <p className="text-muted-light dark:text-muted-dark">Your professional profile and work history.</p>
                </div>
                <Link href="/resume" target="_blank" className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-bold py-3 px-5 rounded-2xl transition-all border border-gray-100 dark:border-gray-700 text-sm">
                    <span className="material-symbols-outlined text-primary text-sm">open_in_new</span>
                    View Public Resume
                </Link>
            </header>

            <div className="space-y-8">
                {/* Profile Summary Tile */}
                <div className="tile bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-60 h-60 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-start gap-6 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                                SS
                            </div>
                            <div>
                                <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white">{resumeData.basics.name}</h2>
                                <p className="text-primary font-semibold">{resumeData.basics.label}</p>
                                <p className="text-sm text-muted-light dark:text-muted-dark mt-1">{resumeData.basics.location.city}, {resumeData.basics.location.region}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">{resumeData.basics.summary}</p>
                        <div className="flex items-center gap-6 mt-4 text-sm text-muted-light dark:text-muted-dark">
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">mail</span> {resumeData.basics.email}</span>
                            <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">link</span> {resumeData.basics.url}</span>
                        </div>
                    </div>
                </div>

                {/* Experience Section */}
                <div>
                    <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">work</span>
                        Experience
                    </h3>
                    <div className="space-y-4">
                        {resumeData.work.map((job) => (
                            <div key={job.id} className="tile bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">{job.position}</h4>
                                        <p className="text-primary font-semibold text-sm">{job.company}</p>
                                    </div>
                                    <span className="text-xs  bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-muted-light dark:text-muted-dark mt-2 md:mt-0 w-fit">
                                        {job.startDate.split('-')[0]} — {job.endDate === 'Present' ? 'Present' : job.endDate.split('-')[0]}
                                    </span>
                                </div>
                                {job.summary && <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{job.summary}</p>}
                                <ul className="space-y-2">
                                    {job.highlights.map((h, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <span className="text-primary mt-0.5">•</span>
                                            {h}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Education Section */}
                <div>
                    <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">school</span>
                        Education
                    </h3>
                    <div className="space-y-4">
                        {resumeData.education.map((edu) => (
                            <div key={edu.id} className="tile bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="flex flex-col md:flex-row md:items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">{edu.studyType} in {edu.area}</h4>
                                        <p className="text-primary font-semibold text-sm">{edu.institution}</p>
                                    </div>
                                    <span className="text-xs bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-muted-light dark:text-muted-dark mt-2 md:mt-0 w-fit">
                                        {edu.startDate} — {edu.endDate}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skills Section */}
                <div>
                    <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">code</span>
                        Skills
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {resumeData.skills.map((skill) => (
                            <div key={skill.id} className="tile bg-surface-light dark:bg-surface-dark p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-3">{skill.name}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {skill.keywords.map((keyword, i) => (
                                        <span key={i} className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">{keyword}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
