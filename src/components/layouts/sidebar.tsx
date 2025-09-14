import { FiFolder, FiSettings, FiChevronDown, FiArrowUp, FiX } from "react-icons/fi";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import SidebarButton from "../sidebarButton";
import OrganizationSwitcher from "../OrganizationSwitcher";
import { useTemplates, useCurrentWorkspace } from "@/hooks";
import { useRecentSidebarBoards, useAllBoardsCount } from "@/hooks/useRecentSidebarBoards";
import { FirestoreTemplate } from "@/types/firestore";
import { useModal } from "@/contexts/ModalContext";
import * as Icons from "react-icons/fi";
import Link from "next/link";

interface SidebarProps {
    height?: string;
    onClose?: () => void;
}

export default function Sidebar({ height = "h-screen", onClose }: SidebarProps) {
    const [showAllBoards, setShowAllBoards] = useState(false);

    // Hooks
    const pathname = usePathname();
    const { openTemplatePreviewModal } = useModal();
    const currentWorkspaceId = useCurrentWorkspace();
    const { templates, loading: templatesLoading } = useTemplates();
    const { boards: recentBoards, loading: boardsLoading } = useRecentSidebarBoards();
    const totalBoardsCount = useAllBoardsCount();

    // Check if user is on organization pages
    const isOnOrganizationPage = pathname.startsWith('/organization/');




    // Template selection handler
    const handleTemplateSelect = (template: FirestoreTemplate) => {
        openTemplatePreviewModal(template);
    };

    // Recent boards are already sorted by the hook, no need to re-sort
    const sortedBoards = recentBoards;

    return (
        <aside
            className={`bg-background-primary ${height} flex flex-col relative transition-all duration-200 w-64 border-r border-background-tertiary`}
        >
            {/* Mobile close button */}
            {onClose && (
                <div className="lg:hidden flex justify-end p-3 border-b border-background-tertiary">
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-background-tertiary transition-colors"
                    >
                        <FiX className="text-text-primary text-xl" />
                    </button>
                </div>
            )}

            <div className="flex-1 space-y-6 overflow-y-auto p-4">
                {/* Boards Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 px-2">
                        <FiFolder className="text-text-primary text-base" />
                        <span className="text-text-primary font-display font-medium">Boards</span>
                    </div>
                    <div className="space-y-1 ml-2">
                        {boardsLoading ? (
                            // Loading skeleton
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-8 bg-background-tertiary rounded-lg"></div>
                                </div>
                            ))
                        ) : sortedBoards.length > 0 ? (
                            <>
                                {sortedBoards.slice(0, 5).map((board) => (
                                    <div key={board.id} className="group">
                                        <Link
                                            href={board.href}
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-background-secondary"
                                        >
                                            <span className="text-lg flex-shrink-0">
                                                {Icons[board.icon as keyof typeof Icons] && React.createElement(Icons[board.icon as keyof typeof Icons])}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-text-primary font-display text-sm font-medium truncate">
                                                    {board.name}
                                                </div>

                                            </div>

                                        </Link>
                                    </div>
                                ))}
                                {totalBoardsCount > 5 && (
                                    <button
                                        onClick={() => setShowAllBoards(true)}
                                        className="w-full text-text-secondary text-sm font-display px-3 py-1 hover:text-text-primary transition-colors bg-background-tertiary/50 rounded-lg border-2 border-dashed border-spotlight-purple/50 hover:bg-background-tertiary hover:border-spotlight-purple cursor-pointer"
                                    >
                                        View all boards ({totalBoardsCount})
                                    </button>
                                )}
                            </>
                        ) : (
                            // Empty state
                            <div className="text-text-secondary text-xs px-3 py-2 text-center">
                                No boards available
                            </div>
                        )}
                    </div>
                </div>

                {/* Templates Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 px-2">
                        <FiFolder className="text-spotlight-yellow text-base" />
                        <span className="text-text-primary font-display font-medium">Templates</span>
                    </div>
                    <div className="space-y-1 ml-2">
                        {templatesLoading ? (
                            // Loading skeleton
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-8 bg-background-tertiary rounded-lg"></div>
                                </div>
                            ))
                        ) : templates.length > 0 ? (
                            templates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={() => handleTemplateSelect(template)}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left hover:bg-background-secondary"
                                >
                                    <span className="text-lg flex-shrink-0">
                                        {template.icon}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-text-primary font-display text-sm font-medium truncate">
                                            {template.name}
                                        </div>
                                        <div className="text-text-secondary text-xs truncate">
                                            {template.category}
                                        </div>
                                    </div>
                                </button>
                            ))
                        ) : (
                            // Empty state
                            <div className="text-text-secondary text-xs px-3 py-2 text-center">
                                No templates available
                            </div>
                        )}
                    </div>
                </div>

                {/* Organizations Section - Hidden when on organization pages */}
                {isOnOrganizationPage && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 px-2">
                            <FiFolder className="text-spotlight-blue text-base" />
                            <span className="text-text-primary font-display font-medium">Organizations</span>
                        </div>
                        <div className="ml-2">
                            <OrganizationSwitcher isCollapsed={false} />
                        </div>
                    </div>
                )}
            </div>



        </aside>
    );
}