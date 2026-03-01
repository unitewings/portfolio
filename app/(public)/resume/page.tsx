import { Metadata } from 'next';
import { Mail, Github, Linkedin, Globe, Twitter, Youtube, Facebook, Instagram } from "lucide-react";
import { MDXRenderer } from "@/components/shared/MDXRenderer";

export const metadata: Metadata = {
    title: "Resume",
    description: "My professional experience and skills."
};

export default function ResumePage() {
    return (
        <main className="bento-grid">
            {/* Header Tile */}
            <div className="header-tile tile bg-surface-light dark:bg-surface-dark p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center relative overflow-hidden">
                <div className="relative z-10 w-full md:w-2/3">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 uppercase tracking-widest">
                        My Journey
                    </div>
                    <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-gray-900 dark:text-white">
                        Swarn Shauryam Swarnkar
                    </h1>
                    <p className="text-xl md:text-2xl text-primary font-medium mb-6">
                        AI &amp; HR Expert • Entrepreneur
                    </p>
                    <div className="text-lg text-muted-light dark:text-muted-dark max-w-2xl leading-relaxed mb-8">
                        Dehradun, India <br />
                        Building seamless organizational experiences with data and empathy. Revolutionizing human resources with artificial intelligence strategies that scale.
                    </div>
                    <div className="flex flex-wrap gap-4 items-center">
                        <a href="https://drive.google.com/file/d/1o-BiVT0ZBfkWIW-nctdAYTrpDdygy86k/view" target="_blank" rel="noopener noreferrer" className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 px-8 rounded-full transition-all hover:bg-primary dark:hover:bg-primary dark:hover:text-white flex items-center shadow-lg group">
                            <span className="material-icons-round mr-2 group-hover:animate-bounce">download</span>
                            Download PDF Resume
                        </a>

                        <div className="flex gap-2 ml-2">
                            <a href="https://linkedin.com/in/ajaiswarn" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center justify-center" title="LinkedIn">
                                <Linkedin size={18} />
                            </a>
                            <a href="https://bit.ly/m/swarn" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center justify-center" title="Portfolio/Socials">
                                <Globe size={18} />
                            </a>
                            <a href="mailto:swarnshauryam@gmail.com" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center justify-center" title="Email">
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="relative mt-8 md:mt-0 w-full md:w-1/3 flex justify-center md:justify-end">
                    <div className="relative w-48 h-48 md:w-64 md:h-64">
                        <img alt="Swarn Shauryam Swarnkar Portrait" className="w-full h-full object-cover rounded-full shadow-2xl relative z-10 border-4 border-white dark:border-surface-dark" src="https://res.cloudinary.com/dq8rnfy2w/image/upload/v1772210106/zbsd2v0vrp4n34aeojwg.jpg" />
                        <div className="absolute -top-4 -right-4 bg-primary/20 w-full h-full rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>

            {/* Experience Tile */}
            <div className="resume-experience-tile tile bg-surface-light dark:bg-surface-dark p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-gray-700 pb-6">
                    <div>
                        <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Experience</h2>
                        <p className="text-muted-light dark:text-muted-dark mt-1">A timeline of impact</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-primary">
                        <span className="material-icons-round text-2xl">history_edu</span>
                    </div>
                </div>

                <div className="space-y-8 pl-4 border-l-2 border-gray-100 dark:border-gray-700 ml-4 relative">

                    {/* Job 1 */}
                    <div className="relative pl-8">
                        <div className="absolute -left-[37px] top-0 w-6 h-6 rounded-full border-4 border-white dark:border-surface-dark bg-primary"></div>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Program Coordinator</h3>
                                <p className="text-primary font-medium">Technology Business Incubator - Graphic Era University</p>
                            </div>
                            <span className="text-sm font-semibold text-muted-light dark:text-muted-dark bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full mt-2 sm:mt-0 w-fit">
                                Oct 2025 - Present
                            </span>
                        </div>
                        <div className="text-muted-light dark:text-muted-dark space-y-2 prose dark:prose-invert prose-sm">
                            <ul className="list-disc ml-5 mt-2">
                                <li>Planning of events to promote entrepreneurial spirit amongst students.</li>
                                <li>Curate annual plan with 20+ events to engage 15000+ students.</li>
                                <li>Handeling a team of 20+ interns.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Job 2 */}
                    <div className="relative pl-8">
                        <div className="absolute -left-[37px] top-0 w-6 h-6 rounded-full border-4 border-white dark:border-surface-dark bg-gray-300 dark:bg-gray-600"></div>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">RPO - Analyst</h3>
                                <p className="text-primary font-medium">KPMG Global Services India Pvt. Ltd., Gurugram</p>
                            </div>
                            <span className="text-sm font-semibold text-muted-light dark:text-muted-dark bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full mt-2 sm:mt-0 w-fit">
                                Nov 2024 - Oct 2025
                            </span>
                        </div>
                        <div className="text-muted-light dark:text-muted-dark space-y-2 prose dark:prose-invert prose-sm">
                            <ul className="list-disc ml-5 mt-2">
                                <li>Sourcing and screening of profiles for Senior Talent Acquisition for US-based clients.</li>
                                <li>Supported 4 different verticals in span of 6 months.</li>
                                <li>Developed Reporting tracker using advanced excel that saved 70% of reporting time for the team.</li>
                                <li>Received SPOT Award for <strong>Reporting Transformation</strong> and exceptional structured approach towards data presentation.</li>
                                <li>Consolidated and visualized sourcing metrics to support onshore with data driven insights.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Job 3 */}
                    <div className="relative pl-8">
                        <div className="absolute -left-[37px] top-0 w-6 h-6 rounded-full border-4 border-white dark:border-surface-dark bg-gray-300 dark:bg-gray-600"></div>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Human Resource Intern</h3>
                                <p className="text-primary font-medium">Suvidha Shiksha</p>
                            </div>
                            <span className="text-sm font-semibold text-muted-light dark:text-muted-dark bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full mt-2 sm:mt-0 w-fit">
                                Dec 2022 - Jan 2023
                            </span>
                        </div>
                        <div className="text-muted-light dark:text-muted-dark space-y-2 prose dark:prose-invert prose-sm">
                            <ul className="list-disc ml-5 mt-2">
                                <li>Onboarded and trained 19 interns for Graphic Designing.</li>
                                <li>Managed intern data and created weekly performance tracking reports while handling confidential data.</li>
                                <li>Received Certificate of Appreciation for my work towards training of Interns.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Job 4 */}
                    <div className="relative pl-8">
                        <div className="absolute -left-[37px] top-0 w-6 h-6 rounded-full border-4 border-white dark:border-surface-dark bg-gray-300 dark:bg-gray-600"></div>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Marketing Intern</h3>
                                <p className="text-primary font-medium">Sasefied Limited, London</p>
                            </div>
                            <span className="text-sm font-semibold text-muted-light dark:text-muted-dark bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full mt-2 sm:mt-0 w-fit">
                                July 2023 - Sept 2023
                            </span>
                        </div>
                        <div className="text-muted-light dark:text-muted-dark space-y-2 prose dark:prose-invert prose-sm">
                            <ul className="list-disc ml-5 mt-2">
                                <li>Conducted market research and identified 63 potential clients</li>
                                <li>Interacted with Schools and Corporate clients for informing about various services.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Job 5 */}
                    <div className="relative pl-8">
                        <div className="absolute -left-[37px] top-0 w-6 h-6 rounded-full border-4 border-white dark:border-surface-dark bg-gray-300 dark:bg-gray-600"></div>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-2">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Social Media Intern</h3>
                                <p className="text-primary font-medium">Rewire with Nidhi</p>
                            </div>
                            <span className="text-sm font-semibold text-muted-light dark:text-muted-dark bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full mt-2 sm:mt-0 w-fit">
                                July 2023 - August 2023
                            </span>
                        </div>
                        <div className="text-muted-light dark:text-muted-dark space-y-2 prose dark:prose-invert prose-sm">
                            <ul className="list-disc ml-5 mt-2">
                                <li>Conducted business analysis and identified 7 key scope of improvements using analytical tools.</li>
                                <li>Developed a Social Media Strategy for a month and curated 25+ audio-visual content</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>

            {/* Sidebar Stack */}
            <div className="sidebar-stack">
                <div className="tile bg-surface-light dark:bg-surface-dark p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex-1">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                            <span className="material-icons-round">school</span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">Education</h3>
                    </div>
                    <div className="space-y-6">

                        {/* Edu 1 */}
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">BBA</h4>
                            <p className="text-sm text-muted-light dark:text-muted-dark">Graphic Era Hill University, Bhimtal</p>
                            <p className="text-xs text-gray-400 mt-1">
                                2021 - 2024
                            </p>
                        </div>

                        <div className="h-px bg-gray-100 dark:bg-gray-700 my-4"></div>

                        {/* Edu 2 */}
                        <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">Intermediate and Matriculation</h4>
                            <p className="text-sm text-muted-light dark:text-muted-dark">HarGovind Suyal Saraswati Vidya Mandir</p>
                            <p className="text-xs text-gray-400 mt-1">
                                2019 - 2021
                            </p>
                        </div>

                    </div>
                </div>

                <div className="tile bg-surface-light dark:bg-surface-dark p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex-1">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600">
                            <span className="material-icons-round">verified</span>
                        </div>
                        <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">Certifications</h3>
                    </div>
                    <ul className="space-y-4 text-sm text-muted-light dark:text-muted-dark">

                        <li className="flex items-start">
                            <span className="material-icons-round text-green-500 text-sm mr-2 mt-0.5">check_circle</span>
                            <div>
                                <span className="block font-medium">Microsoft Power BI Data Analyst Associate</span>
                                <span className="block text-xs text-gray-500">Koenig (PL-300, May, 2025)</span>
                            </div>
                        </li>

                        <li className="flex items-start">
                            <span className="material-icons-round text-green-500 text-sm mr-2 mt-0.5">check_circle</span>
                            <div>
                                <span className="block font-medium">Microsoft Azure AI Solution</span>
                                <span className="block text-xs text-gray-500">Koenig (AI-102, May, 2025)</span>
                            </div>
                        </li>

                        <li className="flex items-start">
                            <span className="material-icons-round text-green-500 text-sm mr-2 mt-0.5">check_circle</span>
                            <div>
                                <span className="block font-medium">CDP on Sharepoint Basics</span>
                                <span className="block text-xs text-gray-500">KPMG</span>
                            </div>
                        </li>

                        <li className="flex items-start">
                            <span className="material-icons-round text-green-500 text-sm mr-2 mt-0.5">check_circle</span>
                            <div>
                                <span className="block font-medium">Certified NLP Practitioner</span>
                                <span className="block text-xs text-gray-500">Academy of Modern Applied Psychology</span>
                            </div>
                        </li>

                        <li className="flex items-start">
                            <span className="material-icons-round text-green-500 text-sm mr-2 mt-0.5">check_circle</span>
                            <div>
                                <span className="block font-medium">Google Analytics</span>
                                <span className="block text-xs text-gray-500">Google</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Skills Tile */}
            <div className="skills-tile tile bg-surface-light dark:bg-surface-dark p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-display text-2xl font-bold mb-8 text-gray-900 dark:text-white flex items-center">
                    <span className="material-icons-round mr-3 text-primary">psychology</span>
                    Technical Strengths &amp; Skills
                </h3>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                    {/* Skill Group */}
                    <div className="space-y-3">
                        <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-2">Analytical Tools</h4>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between items-center group transition hover:border-primary/50">
                            <span className="font-medium text-gray-700 dark:text-gray-200">MS-Office (Advanced), IBM SPSS, Power BI, Google Suite</span>
                            <span className={`w-2 h-2 rounded-full bg-blue-500 transition-transform group-hover:scale-150`}></span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-2">HR Systems</h4>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between items-center group transition hover:border-primary/50">
                            <span className="font-medium text-gray-700 dark:text-gray-200">Internal ATS & CRM, Resume Screening, NABA Portal</span>
                            <span className={`w-2 h-2 rounded-full bg-green-500 transition-transform group-hover:scale-150`}></span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-2">AI & Data</h4>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between items-center group transition hover:border-primary/50">
                            <span className="font-medium text-gray-700 dark:text-gray-200">Azure AI Studio, Prompt Engineering, Data Cleaning, Dashboards</span>
                            <span className={`w-2 h-2 rounded-full bg-yellow-500 transition-transform group-hover:scale-150`}></span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-2">Soft Skills</h4>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between items-center group transition hover:border-primary/50">
                            <span className="font-medium text-gray-700 dark:text-gray-200">Dedication, Adaptability, Problem Solving, Quick Learning</span>
                            <span className={`w-2 h-2 rounded-full bg-purple-500 transition-transform group-hover:scale-150`}></span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-2">Additional Skills</h4>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between items-center group transition hover:border-primary/50">
                            <span className="font-medium text-gray-700 dark:text-gray-200">Content Curation, SEO, Graphic Design</span>
                            <span className={`w-2 h-2 rounded-full bg-orange-500 transition-transform group-hover:scale-150`}></span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-2">Hobbies</h4>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700 flex justify-between items-center group transition hover:border-primary/50">
                            <span className="font-medium text-gray-700 dark:text-gray-200">Chess, Cooking, Hiking, Reading & Writing</span>
                            <span className={`w-2 h-2 rounded-full bg-red-500 transition-transform group-hover:scale-150`}></span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Academic Publications */}
            <div className="skills-tile tile bg-surface-light dark:bg-surface-dark p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-gray-700 pb-6">
                    <div>
                        <h2 className="font-display text-3xl font-bold text-gray-900 dark:text-white">Academic Publications</h2>
                        <p className="text-muted-light dark:text-muted-dark mt-1">Research & Selected Publishing</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                        <span className="material-icons-round text-2xl">menu_book</span>
                    </div>
                </div>

                <div className="space-y-5 text-muted-light dark:text-muted-dark px-4 prose dark:prose-invert max-w-none">
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-disc leading-relaxed">
                        <li>Exploring The Sentiment Landscape Of Delta Waves (Binaural Beats) For Deep Sleep: A YouTube Comment Analysis (SSRN Electronic Journal, Published on Jan 2025)</li>
                        <li>Ethical Investment and Sustainable Finance in India: Exploring ESG Integration and Impact on Financial Performance. [ICTF 2023]</li>
                        <li>Complexity Leadership Development in the Era of e-Finance: A Conceptual Model for Emerging Market (IRPSS Conference, Scopus Indexed)</li>
                        <li>Assessing the impact of corporate wellness initiatives for fostering a healthy work environment. (MRTM-23 Conference , IEEE, Scopus Indexed)</li>
                        <li>Role of Fintech in MSME: An Indian Perspective (ICMCM-23 Conference, Scopus Indexed)</li>
                    </ul>
                </div>
            </div>

            {/* Achievements */}
            <div className="projects-summary-tile tile bg-surface-light dark:bg-surface-dark p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600">
                        <span className="material-icons-round">emoji_events</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">Achievements</h3>
                </div>
                <ul className="space-y-4 text-sm text-muted-light dark:text-muted-dark leading-relaxed">
                    <li className="flex items-start">
                        <span className="material-icons-round text-primary text-sm mr-2 mt-0.5">star</span>
                        <span>Ranked 1st &amp; 2nd in Corporate Roadies (B-Plan) Competition at Amrapali Institute</span>
                    </li>
                    <li className="flex items-start">
                        <span className="material-icons-round text-primary text-sm mr-2 mt-0.5">star</span>
                        <span>Ranked 1st at Business-Plan Competition at Esperanza – GEHU Bhimtal.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="material-icons-round text-primary text-sm mr-2 mt-0.5">star</span>
                        <span>Ranked 1st in Research Poster Competition at Int. Conference on Transcending the Frontiers of Management Science &amp; Technology, Nov 2023.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="material-icons-round text-primary text-sm mr-2 mt-0.5">star</span>
                        <span>Ranked in Top 10 in the city at the International Mathematic Olympiad by the Science Olympiad Foundation – 2013.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="material-icons-round text-primary text-sm mr-2 mt-0.5">star</span>
                        <span>Represented batch (BBA-2nd Year) twice in Achievers and Toppers Meet of College, May 15, 2023 and 2024.</span>
                    </li>
                </ul>
            </div>

            {/* Leadership */}
            <div className="projects-summary-tile tile bg-surface-light dark:bg-surface-dark p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg text-teal-600">
                        <span className="material-icons-round">group</span>
                    </div>
                    <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white">Leadership</h3>
                </div>
                <ul className="space-y-4 text-sm text-muted-light dark:text-muted-dark leading-relaxed">
                    <li className="flex items-start">
                        <span className="material-icons-round text-primary text-sm mr-2 mt-0.5">arrow_right</span>
                        <span>President Finopolis - The Finance Club</span>
                    </li>
                    <li className="flex items-start">
                        <span className="material-icons-round text-primary text-sm mr-2 mt-0.5">arrow_right</span>
                        <span>Speaker - Business Plan Seminar (with AI) at GEHU Bhimtal</span>
                    </li>
                    <li className="flex items-start">
                        <span className="material-icons-round text-primary text-sm mr-2 mt-0.5">arrow_right</span>
                        <span>Head of Social Media and Graphics at - E-Cell SOM</span>
                    </li>
                    <li className="flex items-start">
                        <span className="material-icons-round text-primary text-sm mr-2 mt-0.5">arrow_right</span>
                        <span>Core Advisor of Crescendo Cultural Club</span>
                    </li>
                    <li className="flex items-start">
                        <span className="material-icons-round text-primary text-sm mr-2 mt-0.5">arrow_right</span>
                        <span>Scholarly Digest Newsletter - AI Driven career newsletter with 1K+ subscribers.</span>
                    </li>
                    <li className="flex items-start">
                        <span className="material-icons-round text-primary text-sm mr-2 mt-0.5">arrow_right</span>
                        <span>Judge - Dilemma Debate (AI &amp; HR related topics) at Lady Shri Ram College, Delhi.</span>
                    </li>
                </ul>
            </div>

        </main>
    );
}
