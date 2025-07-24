"use client";

import { useState, useEffect, useRef } from "react";
import { FiX, FiPlus, FiArrowRight, FiCheck } from "react-icons/fi";
import { FirestoreTemplate } from "@/types/firestore";
import { FirestoreService } from "@/lib/firestore";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentWorkspace } from "@/hooks/useSidebarWorkspaces";
import { useRouter } from "next/navigation";

interface TemplatePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    template: FirestoreTemplate | null;
}

export default function TemplatePreviewModal({
    isOpen,
    onClose,
    template

}: TemplatePreviewModalProps) {
    const [boardName, setBoardName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState("");

    const modalRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { user } = useAuth();
    const currentWorkspaceId = useCurrentWorkspace();

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setBoardName("");
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

    const handleCreateBoard = async () => {
        if (!boardName.trim()) {
            setError("Board name is required");
            return;
        }

        if (!template || !user?.id || !currentWorkspaceId) {
            setError("Missing required information");
            return;
        }

        setError("");
        setIsCreating(true);

        try {
            const newBoardId = await FirestoreService.createBoardFromTemplate(
                template.id,
                boardName.trim(),
                currentWorkspaceId,
                user.id
            );

            onClose();
            router.push(`/board/${newBoardId}`);
        } catch (error: any) {
            setError(error.message || "Failed to create board from template");
        } finally {
            setIsCreating(false);
        }
    };

    if (!isOpen || !template) return null;

    return (
        <div
            className="fixed inset-0 modal-backdrop-dark flex items-center justify-center z-[60] p-4"
            onClick={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="bg-background-primary rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden modal-enter shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-background-tertiary">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-spotlight-yellow/20 rounded-lg flex items-center justify-center text-2xl">
                            {template.icon}
                        </div>
                        <div>
                            <h2 className="text-text-primary font-display font-semibold text-lg">
                                {template.name}
                            </h2>
                            <p className="text-text-secondary text-sm">
                                {template.category} Template
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-background-secondary rounded-lg transition-colors"
                    >
                        <FiX className="text-text-secondary" size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[calc(90vh-200px)] overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {/* Template Description */}
                        <div>
                            <p className="text-text-primary text-sm leading-relaxed">
                                {template.description}
                            </p>
                        </div>

                        {/* Board Name Input */}
                        <div>
                            <label className="block text-text-primary font-display font-medium text-sm mb-2">
                                Board Name
                            </label>
                            <input
                                type="text"
                                value={boardName}
                                onChange={(e) => setBoardName(e.target.value)}
                                placeholder={`My ${template.name}`}
                                className="w-full px-4 py-3 bg-background-secondary border border-background-tertiary rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-spotlight-purple focus:border-transparent transition-all"
                                disabled={isCreating}
                            />
                        </div>

                        {/* Columns Preview */}
                        <div>
                            <h3 className="text-text-primary font-display font-medium text-sm mb-3">
                                Board Structure ({template.columns.length} columns)
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {template.columns
                                    .sort((a, b) => a.order - b.order)
                                    .map((column, index) => (
                                        <div
                                            key={column.id}
                                            className="flex items-center gap-2 px-3 py-2 bg-background-secondary rounded-lg"
                                        >
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: column.badgeColor }}
                                            />
                                            <span className="text-text-primary text-sm font-medium">
                                                {column.title}
                                            </span>
                                            {index < template.columns.length - 1 && (
                                                <FiArrowRight className="text-text-secondary ml-1" size={12} />
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>

                        {/* Labels Preview */}
                        {template.availableLabels.length > 0 && (
                            <div>
                                <h3 className="text-text-primary font-display font-medium text-sm mb-3">
                                    Available Labels ({template.availableLabels.length} labels)
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {template.availableLabels.map((label) => (
                                        <div
                                            key={label.id}
                                            className="flex items-center gap-2 px-3 py-1 rounded-full text-xs"
                                            style={{
                                                backgroundColor: `${label.color}20`,
                                                color: label.color,
                                                border: `1px solid ${label.color}40`
                                            }}
                                        >
                                            {label.name}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sample Tasks Preview */}
                        {template.sampleTasks && template.sampleTasks.length > 0 && (
                            <div>
                                <h3 className="text-text-primary font-display font-medium text-sm mb-3">
                                    Sample Tasks ({template.sampleTasks.length} tasks included)
                                </h3>
                                <div className="space-y-2">
                                    {template.sampleTasks
                                        .sort((a, b) => a.position - b.position)
                                        .slice(0, 3) // Show only first 3 tasks
                                        .map((task) => {
                                            const column = template.columns.find(c => c.id === task.columnId);
                                            return (
                                                <div
                                                    key={task.id}
                                                    className="flex items-start gap-3 p-3 bg-background-secondary rounded-lg"
                                                >
                                                    <div className="flex-shrink-0 mt-1">
                                                        {task.icon && (
                                                            <span className="text-lg">{task.icon}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="text-text-primary text-sm font-medium truncate">
                                                                {task.title}
                                                            </h4>
                                                            {column && (
                                                                <span
                                                                    className="px-2 py-0.5 text-xs rounded-full text-white"
                                                                    style={{ backgroundColor: column.badgeColor }}
                                                                >
                                                                    {column.title}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-text-secondary text-xs leading-relaxed">
                                                            {task.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    {template.sampleTasks.length > 3 && (
                                        <p className="text-text-secondary text-xs text-center py-2">
                                            +{template.sampleTasks.length - 3} more sample tasks will be included
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                <p className="text-red-400 text-sm">{error}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-background-tertiary bg-background-secondary/50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
                        disabled={isCreating}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateBoard}
                        disabled={isCreating || !boardName.trim()}
                        className="flex items-center gap-2 px-6 py-2 bg-spotlight-purple hover:bg-spotlight-purple/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all font-medium"
                    >
                        {isCreating ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <FiCheck size={16} />
                                Create Board
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}