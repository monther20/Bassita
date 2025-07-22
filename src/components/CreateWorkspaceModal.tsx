"use client";

import { useState, useEffect, useRef } from "react";
import { FiX, FiUsers } from "react-icons/fi";
import { useCreateWorkspace } from "@/hooks/useFirestore";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface CreateWorkspaceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateWorkspaceModal({
    isOpen,
    onClose
}: CreateWorkspaceModalProps) {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    
    const modalRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { user } = useAuth();
    const createWorkspaceMutation = useCreateWorkspace();

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setName("");
            setError("");
        }
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleCreate = async () => {
        if (!name.trim()) {
            setError("Workspace name is required");
            return;
        }

        if (!user?.id) {
            setError("User not authenticated");
            return;
        }

        setError("");

        try {
            const workspaceData = {
                name: name.trim(),
                ownerId: user.id,
                members: [{
                    userId: user.id,
                    role: 'owner' as const,
                    joinedAt: new Date()
                }]
            };

            const newWorkspaceId = await createWorkspaceMutation.mutateAsync(workspaceData);
            onClose();
            router.push(`/workspace/${newWorkspaceId}`);
        } catch (error: any) {
            setError(error.message || "Failed to create workspace");
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 modal-backdrop-dark flex items-center justify-center z-40 p-4"
            onClick={handleBackdropClick}
        >
            <div 
                ref={modalRef}
                className="bg-background-primary rounded-2xl w-full max-w-md overflow-hidden modal-enter shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-background-tertiary">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-spotlight-purple/20 rounded-lg flex items-center justify-center">
                            <FiUsers className="text-spotlight-purple" size={18} />
                        </div>
                        <div>
                            <h2 className="text-text-primary font-display font-semibold text-lg">
                                Create New Workspace
                            </h2>
                            <p className="text-text-secondary text-sm">
                                Create a new workspace for your team
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 text-text-secondary hover:text-text-primary hover:bg-background-secondary rounded-lg transition-all duration-200 flex items-center justify-center"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    <div className="space-y-4">
                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Workspace Name */}
                        <div>
                            <label className="block text-text-primary font-medium mb-2 text-sm">
                                Workspace Name *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter workspace name..."
                                className="w-full px-4 py-3 bg-background-secondary text-text-primary placeholder-text-secondary rounded-lg border border-background-tertiary focus:outline-none focus:border-spotlight-purple focus:ring-2 focus:ring-spotlight-purple/20 transition-all duration-200"
                                autoFocus
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && name.trim()) {
                                        handleCreate();
                                    }
                                }}
                            />
                            <p className="text-text-secondary text-xs mt-2">
                                This will be the main workspace where you can organize your boards and collaborate with your team.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6 pt-4 border-t border-background-tertiary">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 text-text-secondary hover:text-text-primary border border-background-tertiary hover:border-text-tertiary rounded-lg transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={!name.trim() || createWorkspaceMutation.isPending}
                            className="flex-1 px-4 py-3 bg-spotlight-purple text-text-primary rounded-lg hover:bg-spotlight-purple/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                        >
                            {createWorkspaceMutation.isPending ? "Creating..." : "Create Workspace"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}