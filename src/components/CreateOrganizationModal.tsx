"use client";

import { useState, useEffect, useRef } from "react";
import { FiX, FiUsers } from "react-icons/fi";
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { FirestoreService } from '@/lib/firestore';
import { useAuth } from "@/hooks/useAuth";

interface CreateOrganizationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateOrganizationModal({
    isOpen,
    onClose
}: CreateOrganizationModalProps) {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();

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
            setError("Organization name is required");
            return;
        }
        if (!user?.id) {
            setError("User not authenticated");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const orgData = {
                name: name.trim(),
                ownerId: user.id,
                members: [{
                    userId: user.id,
                    role: 'owner' as const,
                    joinedAt: new Date()
                }],
                memberUserIds: [user.id],
                workspaces: [],
                settings: {
                    allowMemberInvites: true,
                    allowWorkspaceCreation: true
                }
            };
            const newOrgId = await FirestoreService.createOrganization(orgData);
            
            // Invalidate organizations query to fetch the new organization
            await queryClient.invalidateQueries({ queryKey: ['user-organizations', user.id] });
            
            setLoading(false);
            onClose();
            router.push(`/organization/${newOrgId}`);
        } catch (error: any) {
            setLoading(false);
            setError(error.message || "Failed to create organization");
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
                                Create New Organization
                            </h2>
                            <p className="text-text-secondary text-sm">
                                Create a new organization for your company or group
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

                        {/* Organization Name */}
                        <div>
                            <label className="block text-text-primary font-medium mb-2 text-sm">
                                Organization Name *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter organization name..."
                                className="w-full px-4 py-3 bg-background-secondary text-text-primary placeholder-text-secondary rounded-lg border border-background-tertiary focus:outline-none focus:border-spotlight-purple focus:ring-2 focus:ring-spotlight-purple/20 transition-all duration-200"
                                autoFocus
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && name.trim()) {
                                        handleCreate();
                                    }
                                }}
                            />
                            <p className="text-text-secondary text-xs mt-2">
                                This will be the main organization for your company or group.
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
                            disabled={!name.trim() || loading}
                            className="flex-1 px-4 py-3 bg-spotlight-purple text-text-primary rounded-lg hover:bg-spotlight-purple/90 hover:shadow-glow-purple disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                        >
                            {loading ? "Creating..." : "Create Organization"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 