import Link from "next/link";
import { BlogPost } from "@/types";
import { Calendar, Tag } from "lucide-react";

export function PostCard({ post }: { post: BlogPost }) {
    const date = new Date(post.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    return (
        <Link href={`/posts/${post.slug}`} className="group flex flex-col space-y-3 rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary/50 hover:shadow-md hover:-translate-y-1 overflow-hidden h-full">
            {post.thumbnailUrl && (
                <div className="w-full h-40 overflow-hidden relative">
                    <img alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={post.thumbnailUrl} />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
                </div>
            )}
            <div className="flex flex-col flex-1 p-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{date}</span>
                    </div>
                    {post.tags.length > 0 && (
                        <>
                            <span>•</span>
                            <div className="flex items-center gap-1 text-primary">
                                <Tag size={14} />
                                <span>{post.tags[0]}</span>
                            </div>
                        </>
                    )}
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-card-foreground group-hover:text-primary transition-colors">
                        {post.title}
                    </h2>
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                        {post.excerpt}
                    </p>
                </div>

                <div className="pt-2">
                    <span className="text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        Read more →
                    </span>
                </div>
            </div>
        </Link>
    );
}
