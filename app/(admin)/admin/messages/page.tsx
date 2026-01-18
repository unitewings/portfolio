import { getContactSubmissions } from "@/lib/data";
import { Mail } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
    const messages = await getContactSubmissions();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                    <p className="text-muted-foreground">Recent messages from the contact form.</p>
                </div>
            </div>

            <div className="rounded-md border bg-card">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Name</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Email</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Category</th>
                                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Message</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {messages.length > 0 ? (
                                messages.map((msg) => (
                                    <tr key={msg.id} className="border-b transition-colors hover:bg-muted/50 group">
                                        <td className="p-4 align-middle text-muted-foreground whitespace-nowrap">
                                            {new Date(msg.submittedAt).toLocaleDateString()}
                                            <div className="text-xs">{new Date(msg.submittedAt).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="p-4 align-middle font-medium">
                                            {msg.firstName} {msg.lastName}
                                            {msg.phone && (
                                                <div className="text-xs text-muted-foreground">{msg.phone}</div>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle">
                                            <a href={`mailto:${msg.email}`} className="hover:underline flex items-center gap-1">
                                                <Mail size={12} />
                                                {msg.email}
                                            </a>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {msg.category ? (
                                                <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                                    {msg.category}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle max-w-md">
                                            <p className="line-clamp-2 group-hover:line-clamp-none transition-all duration-200">
                                                {msg.message}
                                            </p>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                        No messages yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
