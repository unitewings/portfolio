export interface SocialProfile {
    network: string;
    username: string;
    url: string;
}

export interface WorkExperience {
    id: string; // UUID
    company: string;
    position: string;
    startDate: string; // YYYY-MM-DD
    endDate: string | "Present";
    summary?: string;
    highlights: string[]; // Array of bullet points
    url?: string;
}

export interface Education {
    id: string;
    institution: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate: string;
    score?: string;
}

export interface SkillCategory {
    id: string;
    name: string;
    keywords: string[];
}

export interface Publication {
    id: string;
    name: string;
    publisher: string;
    releaseDate: string;
    url?: string;
    summary: string;
}

export interface Certification {
    id: string;
    name: string;
    date: string;
    issuer: string;
    url?: string;
}

export interface ResumeData {
    basics: {
        name: string;
        label: string;
        image: string;
        email: string;
        phone?: string;
        url?: string;
        summary: string;
        location: {
            city: string;
            countryCode: string;
            region: string;
        };
        profiles: SocialProfile[];
    };
    work: WorkExperience[];
    education: Education[];
    skills: SkillCategory[];
    publications: Publication[];
    certifications: Certification[];
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    date: string; // ISO 8601
    excerpt: string;
    content: string; // Markdown/HTML
    tags: string[];
    thumbnailUrl?: string;
    pinned?: boolean;
    status: 'draft' | 'published';
    type: 'article' | 'video' | 'newsletter';

    // SEO Fields
    seoTitle?: string;
    seoDescription?: string;
    canonicalUrl?: string;

    // Visibility & Protection
    isListed?: boolean;
    isProtected?: boolean;
    password?: string;
    passwordHintLink?: string;
}

export interface SiteSettings {
    globalTitle: string;
    globalDescription: string;
    homeIntroContent: string; // Markdown
    socialLinks: SocialProfile[];
    headScripts?: string; // Raw HTML/JS for <head>
    profileName?: string;
    profileLabel?: string;
    newsletterTitle?: string;
    newsletterDescription?: string;
    contactIntro?: string;
    contactEmail?: string;
}

export interface Subscriber {
    id: string;
    email: string;
    subscribedAt: string;
    name: string;
    phone?: string;
}

export interface ContactSubmission {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    category?: string;
    message: string;
    submittedAt: string;
}

export interface Page {
    id: string;
    title: string;
    slug: string; // url-friendly
    content: string; // markdown
    inSidebar: boolean;
    order: number;

    // SEO
    seoTitle?: string;
    seoDescription?: string;

    // System pages (Home, Resume, Contact)
    isSystem?: boolean;
    path?: string; // Override default /slug

    // Navigation Features
    type?: 'page' | 'heading' | 'link';
    externalUrl?: string; // For type === 'link'

    // Custom Page Features (Unified)
    postIds?: string[];
    isProtected?: boolean;
    password?: string;
    passwordHintLink?: string;
    lastUpdated?: string;
}

export interface CustomPage {
    id: string;
    title: string;
    slug: string; // -> /p/slug
    content: string; // Markdown intro
    postIds: string[]; // List of curated blog IDs in order

    // Protection
    isProtected: boolean;
    password?: string;
    passwordHintLink?: string;

    lastUpdated: string;
}
