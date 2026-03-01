"use client";

import { useState } from "react";
import { CommunitySubmission } from "@/types";
import { manageCommunitySubmission, deleteCommunitySubmissionAction, editCommunitySubmissionAction } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Search, Filter, Loader2, CheckCircle2, XCircle, FileText, ChevronLeft, ChevronRight, X, Trash2, Edit, Save, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const CategoryBadge = ({ category }: { category: string }) => {
    return <span className="inline-block px-2 py-1 text-xs font-bold text-black bg-primary rounded uppercase">{category.replace('-', ' ')}</span>;
};

export function SubmissionsClient({ initialSubmissions }: { initialSubmissions: CommunitySubmission[] }) {
    const [submissions, setSubmissions] = useState<CommunitySubmission[]>(initialSubmissions);
    const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(initialSubmissions.length > 0 ? initialSubmissions[0].id : null);
    const [editorNotes, setEditorNotes] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [editForm, setEditForm] = useState({
        title: initialSubmissions[0]?.title || "",
        category: initialSubmissions[0]?.category || "",
        content: initialSubmissions[0]?.content || ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const activeSubmission = submissions.find(s => s.id === activeSubmissionId) || null;

    const handleAction = async (action: 'approve' | 'reject') => {
        if (!activeSubmission) return;
        setIsUpdating(true);

        const result = await manageCommunitySubmission(activeSubmission.id, action, editorNotes);

        if (result.success) {
            toast.success(result.message);
            // Update local state
            setSubmissions(prev => prev.map(sub => sub.id === activeSubmission.id ? { ...sub, status: action === 'approve' ? 'approved' : 'rejected', editorNotes } : sub));
            setEditorNotes("");
            router.refresh(); // Refresh server data if needed
        } else {
            toast.error(result.message);
        }
        setIsUpdating(false);
    };

    const handleDelete = async () => {
        if (!activeSubmission) return;
        setIsUpdating(true);
        const result = await deleteCommunitySubmissionAction(activeSubmission.id);
        if (result.success) {
            toast.success(result.message);
            setSubmissions(prev => prev.filter(s => s.id !== activeSubmission.id));
            const newActive = submissions.find(s => s.id !== activeSubmission.id);
            setActiveSubmissionId(newActive ? newActive.id : null);
            setIsDeleting(false);
        } else {
            toast.error(result.message);
        }
        setIsUpdating(false);
    };

    const handleEditSave = async () => {
        if (!activeSubmission) return;
        setIsUpdating(true);
        const result = await editCommunitySubmissionAction(
            activeSubmission.id,
            editForm.title,
            editForm.category,
            editForm.content,
            editorNotes
        );
        if (result.success) {
            toast.success(result.message);
            setSubmissions(prev => prev.map(s => s.id === activeSubmission.id ? { ...s, title: editForm.title, category: editForm.category, content: editForm.content, editorNotes } : s));
            setIsEditing(false);
        } else {
            toast.error(result.message);
        }
        setIsUpdating(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'pending':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">Pending</span>;
            case 'approved':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20">Approved</span>;
            case 'rejected':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">Rejected</span>;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Community Submissions</h2>
                    <p className="text-gray-400">Review and manage content submitted by the community.</p>
                </div>
                {/* Analytics Widget */}
                <div className="bg-[#171515] border border-gray-800 rounded-xl p-4 flex items-center gap-4 min-w-[240px]">
                    <div className="bg-primary/20 p-3 rounded-lg text-primary">
                        <span className="material-icons-round">analytics</span>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Contributions</p>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-white">{submissions.length}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Submissions List */}
                <div className="lg:col-span-7 xl:col-span-8 bg-[#171515] border border-gray-800 rounded-xl overflow-hidden flex flex-col h-[600px]">
                    <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-white/5">
                        <h3 className="font-semibold text-white">All Submissions</h3>
                    </div>
                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-[#171515] z-10 text-xs uppercase tracking-wider text-gray-500 font-semibold border-b border-gray-800">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Author</th>
                                    <th className="px-6 py-4 font-semibold">Title</th>
                                    <th className="px-6 py-4 font-semibold">Date</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {submissions.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500 text-sm">
                                            No submissions yet.
                                        </td>
                                    </tr>
                                )}
                                {submissions.map((sub) => (
                                    <tr
                                        key={sub.id}
                                        onClick={() => {
                                            if (activeSubmissionId !== sub.id) {
                                                setActiveSubmissionId(sub.id);
                                                setEditorNotes(sub.editorNotes || "");
                                                setEditForm({
                                                    title: sub.title,
                                                    category: sub.category,
                                                    content: sub.content
                                                });
                                                setIsEditing(false);
                                                setIsDeleting(false);
                                            }
                                        }}
                                        className={`transition-colors cursor-pointer group ${activeSubmissionId === sub.id ? 'bg-primary/10' : 'hover:bg-white/5'}`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white">
                                                    {sub.authorName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-white">{sub.authorName}</span>
                                                    <span className="text-xs text-gray-500">{sub.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300 group-hover:text-white truncate max-w-[200px]">{sub.title}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{formatDate(sub.submittedAt)}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={sub.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Review Panel */}
                <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
                    {activeSubmission ? (
                        <div className="bg-[#171515] border border-gray-800 rounded-xl overflow-hidden flex flex-col h-[600px]">

                            {isEditing ? (
                                <div className="p-6 pb-2 border-b border-gray-800 flex flex-col gap-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-lg font-bold text-white">Edit Submission</h3>
                                        <div className="flex gap-2 shrink-0 ml-4">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="p-2 rounded-lg transition-colors bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700"
                                                title="Cancel Edit"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
                                        <input
                                            value={editForm.title}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full bg-[#201c18] border border-gray-700 rounded-lg p-3 text-sm text-gray-200 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Category (e.g., ai-ml)</label>
                                        <input
                                            value={editForm.category}
                                            onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                                            className="w-full bg-[#201c18] border border-gray-700 rounded-lg p-3 text-sm text-gray-200 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 pb-2 border-b border-gray-800">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <CategoryBadge category={activeSubmission.category} />
                                            <h3 className="text-xl font-bold text-white leading-tight mt-3 mb-2">{activeSubmission.title}</h3>

                                            <div className="flex items-center gap-3 mt-4">
                                                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold text-white">
                                                    {activeSubmission.authorName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{activeSubmission.authorName}</p>
                                                    <p className="text-xs text-gray-500">{activeSubmission.email} • {formatDate(activeSubmission.submittedAt)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 shrink-0 ml-4">
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="p-2 rounded-lg transition-colors bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700"
                                                title="Edit Submission"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setIsDeleting(true)}
                                                className="p-2 rounded-lg transition-colors bg-gray-800/50 text-gray-400 hover:text-red-400 hover:bg-red-400/10"
                                                title="Delete Submission"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="p-6 flex flex-col gap-4 flex-1 overflow-hidden">
                                {isDeleting ? (
                                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center border border-red-500/30 bg-red-500/5 rounded-xl">
                                        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
                                        <h4 className="text-lg font-bold text-white mb-2">Delete Submission?</h4>
                                        <p className="text-sm text-gray-400 mb-6 max-w-sm">Are you sure you want to permanently delete this submission? This action cannot be undone.</p>
                                        <div className="flex items-center justify-center gap-3 w-full">
                                            <button
                                                onClick={() => setIsDeleting(false)}
                                                disabled={isUpdating}
                                                className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleDelete}
                                                disabled={isUpdating}
                                                className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 shadow-lg shadow-red-500/20 transition-colors disabled:opacity-50"
                                            >
                                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Yes, Delete"}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                            {isEditing ? (
                                                <div className="flex flex-col h-full">
                                                    <label className="block text-xs font-medium text-gray-500 mb-1">Content</label>
                                                    <textarea
                                                        value={editForm.content}
                                                        onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                                                        className="w-full flex-1 bg-[#201c18] border border-gray-700 rounded-lg p-3 text-sm text-gray-200 focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none min-h-[200px]"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="prose prose-invert prose-sm max-w-none">
                                                    {/* In a real app we'd parse markdown here, for now display text with line breaks */}
                                                    {activeSubmission.content.split('\n').map((paragraph, idx) => (
                                                        <p key={idx} className="text-sm text-gray-400 leading-relaxed mb-3">
                                                            {paragraph}
                                                        </p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Editor Notes Input */}
                                        <div className="mt-4 pt-4 border-t border-gray-800 shrink-0">
                                            <label className="block text-xs font-medium text-gray-500 mb-2">Editor Notes (Internal)</label>
                                            <textarea
                                                value={editorNotes}
                                                onChange={(e) => setEditorNotes(e.target.value)}
                                                className="w-full bg-[#201c18] border border-gray-700 rounded-lg p-3 text-sm text-gray-200 focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none h-24"
                                                placeholder="Add notes for the team or for the author revisions..."
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                            {isEditing ? (
                                <div className="p-4 bg-[#201c18] border-t border-gray-800 flex justify-end gap-3 shrink-0">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        disabled={isUpdating}
                                        className="py-2 px-4 rounded-lg bg-transparent border border-gray-700 text-gray-300 font-medium text-sm hover:bg-white/5 transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleEditSave}
                                        disabled={isUpdating}
                                        className="flex items-center justify-center gap-2 py-2 px-6 rounded-lg bg-primary text-white font-bold text-sm hover:bg-orange-600 shadow-lg shadow-primary/20 transition-colors disabled:opacity-50"
                                    >
                                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {activeSubmission.status === 'pending' && (
                                        <div className="p-4 bg-[#201c18] border-t border-gray-800 grid grid-cols-2 gap-3 shrink-0">
                                            <button
                                                onClick={() => handleAction('reject')}
                                                disabled={isUpdating}
                                                className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-transparent border border-red-500/30 text-red-500 font-bold text-sm hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                            >
                                                <span className="material-icons-round text-[18px]">edit_note</span>
                                                Request Revisions
                                            </button>
                                            <button
                                                onClick={() => handleAction('approve')}
                                                disabled={isUpdating}
                                                className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-primary text-white font-bold text-sm hover:bg-orange-600 shadow-lg shadow-primary/20 transition-colors disabled:opacity-50"
                                            >
                                                <span className="material-icons-round text-[18px]">check_circle</span>
                                                Approve &amp; Publish
                                            </button>
                                        </div>
                                    )}
                                    {activeSubmission.status !== 'pending' && (
                                        <div className="p-4 bg-[#201c18] border-t border-gray-800 shrink-0 flex items-center justify-center text-sm text-gray-500">
                                            This submission has already been <strong className="ml-1 uppercase">{activeSubmission.status}</strong>.
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="bg-[#171515] border border-gray-800 rounded-xl flex flex-col items-center justify-center h-[600px] text-gray-500 p-8 text-center">
                            <span className="material-icons-round text-6xl mb-4 text-gray-700">chat</span>
                            <p>Select a submission from the list to view its details and take action.</p>
                        </div>
                    )}
                </div>
            </div>
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #3e2f23;
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #f27f0d;
                }
            `}</style>
        </div>
    );
}
