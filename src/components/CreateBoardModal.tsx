"use client";

import { useState, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import * as Icons from "react-icons/fi";
import IconPicker from "./board/IconPicker";
import { useCreateBoard, useUserWorkspaces } from "@/hooks/useFirestore";
import { useAuth } from "@/hooks/useAuth";
import { FirestoreWorkspace } from "@/types/firestore";
import { useRouter, useParams } from "next/navigation";

interface CreateBoardModalProps {
    isOpen: boolean;
    onClose: () => void;
    workspaceId?: string; // Pre-select workspace if provided
}

export default function CreateBoardModal({
    isOpen,
    onClose,
    workspaceId
}: CreateBoardModalProps) {
    const [name, setName] = useState("");
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(workspaceId || "");
    const [selectedIcon, setSelectedIcon] = useState("FiBoard");
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [error, setError] = useState("");

    const modalRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { user } = useAuth();
    const { organizationId, workspaceId: paramWorkspaceId } = useParams();
    const { data: workspaces = [], isLoading: workspacesLoading } = useUserWorkspaces();
    const createBoardMutation = useCreateBoard();

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setName("");
            setSelectedWorkspaceId(workspaceId || "");
            setSelectedIcon("FiBoard");
            setError("");
        }
    }, [isOpen, workspaceId]);

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
            setError("Board name is required");
            return;
        }

        if (!selectedWorkspaceId) {
            setError("Please select a workspace");
            return;
        }

        if (!user?.id) {
            setError("User not authenticated");
            return;
        }

        setError("");

        try {
            const boardData = {
                name: name.trim(),
                icon: selectedIcon,
                workspaceId: selectedWorkspaceId,
                ownerId: user.id,
                members: [{
                    userId: user.id,
                    role: 'owner' as const
                }],
                columns: [
                    { id: '1', title: 'To Do', badgeColor: 'bg-gray-500', order: 1 },
                    { id: '2', title: 'In Progress', badgeColor: 'bg-blue-500', order: 2 },
                    { id: '3', title: 'Done', badgeColor: 'bg-green-500', order: 3 }
                ],
                availableLabels: [
                    { id: '1', name: 'High Priority', color: 'bg-red-500' },
                    { id: '2', name: 'Medium Priority', color: 'bg-yellow-500' },
                    { id: '3', name: 'Low Priority', color: 'bg-green-500' },
                    { id: '4', name: 'Bug', color: 'bg-red-600' },
                    { id: '5', name: 'Feature', color: 'bg-blue-500' },
                    { id: '6', name: 'Enhancement', color: 'bg-purple-500' }
                ]
            };

            const newBoardId = await createBoardMutation.mutateAsync(boardData);
            onClose();
            router.push(`/organization/${organizationId}/workspace/${paramWorkspaceId}/board/${newBoardId}`);
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "Failed to create board");
        }
    };

    const renderSelectedIcon = () => {
        const IconComponent = (Icons as Record<string, React.ComponentType<{ size?: number }>>)[selectedIcon];
        return IconComponent ? <IconComponent size={20} /> : null;
    };

    if (!isOpen) return null;

    return (
        <>
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
                                <div className="text-spotlight-purple">
                                    {renderSelectedIcon()}
                                </div>
                            </div>
                            <div>
                                <h2 className="text-text-primary font-display font-semibold text-lg">
                                    Create New Board
                                </h2>
                                <p className="text-text-secondary text-sm">
                                    Add a new board to your workspace
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

                            {/* Board Name */}
                            <div>
                                <label className="block text-text-primary font-medium mb-2 text-sm">
                                    Board Name *
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter board name..."
                                    className="w-full px-4 py-3 bg-background-secondary text-text-primary placeholder-text-secondary rounded-lg border border-background-tertiary focus:outline-none focus:border-spotlight-purple focus:ring-2 focus:ring-spotlight-purple/20 transition-all duration-200"
                                    autoFocus
                                />
                            </div>

                            {/* Workspace Selection */}
                            <div>
                                <label className="block text-text-primary font-medium mb-2 text-sm">
                                    Workspace *
                                </label>
                                {workspacesLoading ? (
                                    <div className="w-full px-4 py-3 bg-background-secondary rounded-lg border border-background-tertiary text-text-secondary">
                                        Loading workspaces...
                                    </div>
                                ) : workspaces.length === 0 ? (
                                    <div className="w-full px-4 py-3 bg-background-secondary rounded-lg border border-background-tertiary text-text-secondary">
                                        No workspaces available
                                    </div>
                                ) : (
                                    <select
                                        value={selectedWorkspaceId}
                                        onChange={(e) => setSelectedWorkspaceId(e.target.value)}
                                        className="w-full px-4 py-3 bg-background-secondary text-text-primary rounded-lg border border-background-tertiary focus:outline-none focus:border-spotlight-purple focus:ring-2 focus:ring-spotlight-purple/20 transition-all duration-200"
                                    >
                                        <option value="">Select a workspace</option>
                                        {workspaces.map((workspace: FirestoreWorkspace) => (
                                            <option key={workspace.id} value={workspace.id}>
                                                {workspace.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* Icon Selection */}
                            <div>
                                <label className="block text-text-primary font-medium mb-2 text-sm">
                                    Board Icon
                                </label>
                                <button
                                    onClick={() => setShowIconPicker(true)}
                                    className="w-full flex items-center gap-3 px-4 py-3 bg-background-secondary text-text-primary rounded-lg border border-background-tertiary hover:border-spotlight-purple transition-all duration-200"
                                >
                                    <div className="w-8 h-8 bg-spotlight-purple/10 rounded-md flex items-center justify-center text-spotlight-purple">
                                        {renderSelectedIcon()}
                                    </div>
                                    <span className="flex-1 text-left">Select Icon</span>
                                </button>
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
                                disabled={!name.trim() || !selectedWorkspaceId || createBoardMutation.isPending}
                                className="flex-1 px-4 py-3 bg-spotlight-purple text-text-primary rounded-lg hover:bg-spotlight-purple/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                            >
                                {createBoardMutation.isPending ? "Creating..." : "Create Board"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Icon Picker Sub-Modal */}
            {showIconPicker && (
                <IconPicker
                    selectedIcon={selectedIcon}
                    onIconSelect={(iconName) => {
                        setSelectedIcon(iconName);
                        setShowIconPicker(false);
                    }}
                    onClose={() => setShowIconPicker(false)}
                />
            )}
        </>
    );
}