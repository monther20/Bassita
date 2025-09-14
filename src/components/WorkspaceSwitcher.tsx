"use client";

import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck, FiUsers, FiFolder } from "react-icons/fi";
import { useSidebarWorkspaces } from "@/hooks/useSidebarWorkspaces";

interface WorkspaceSwitcherProps {
    isCollapsed?: boolean;
}

export default function WorkspaceSwitcher({ isCollapsed = false }: WorkspaceSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { workspaces, currentWorkspace, switchWorkspace, loading } = useSidebarWorkspaces();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleWorkspaceSelect = (workspaceId: string) => {
        switchWorkspace(workspaceId);
        setIsOpen(false);
    };

    if (loading || !currentWorkspace) {
        return (
            <div className={`animate-pulse ${isCollapsed ? 'p-2' : 'space-y-2'}`}>
                {isCollapsed ? (
                    <div className="w-8 h-8 bg-background-tertiary rounded-lg"></div>
                ) : (
                    <>
                        <div className="bg-background-tertiary rounded-lg p-3 h-16"></div>
                        <div className="bg-background-tertiary rounded-lg h-10"></div>
                    </>
                )}
            </div>
        );
    }

    if (isCollapsed) {
        return (
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full p-2 rounded-lg hover:bg-background-tertiary transition-colors"
                    title={currentWorkspace.name}
                >
                    <FiFolder className="text-spotlight-purple text-xl mx-auto" />
                </button>

                {/* Collapsed Dropdown */}
                {isOpen && (
                    <div className="absolute left-full top-0 ml-2 w-64 bg-background-primary border border-background-tertiary rounded-lg shadow-xl z-50">
                        <div className="p-2">
                            <div className="text-text-secondary text-xs font-medium px-3 py-2 uppercase tracking-wide">
                                Switch Workspace
                            </div>
                            {workspaces.map((workspace) => (
                                <button
                                    key={workspace.id}
                                    onClick={() => handleWorkspaceSelect(workspace.id)}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-background-secondary rounded-lg transition-colors"
                                >
                                    <FiFolder className="text-spotlight-purple flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-text-primary font-medium text-sm truncate">
                                            {workspace.name}
                                        </div>
                                        <div className="text-text-secondary text-xs">
                                            {workspace.memberCount} members
                                        </div>
                                    </div>
                                    {workspace.id === currentWorkspace.id && (
                                        <FiCheck className="text-spotlight-purple flex-shrink-0" size={16} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-2" ref={dropdownRef}>
            {/* Current Workspace Display */}
            <div className="bg-spotlight-purple rounded-lg p-3 relative">
                <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="text-text-primary font-display font-medium text-sm truncate">
                            {currentWorkspace.name}
                        </div>
                        <div className="text-text-secondary text-xs font-display flex items-center gap-1">
                            <FiUsers size={12} />
                            {currentWorkspace.memberCount}
                            <span className="mx-1">•</span>
                            <FiFolder size={12} />
                            {currentWorkspace.boardCount}
                        </div>
                    </div>
                    {currentWorkspace.isOwner && (
                        <div className="text-text-primary/70 text-xs bg-white/10 px-2 py-1 rounded-full">
                            Owner
                        </div>
                    )}
                </div>
            </div>

            {/* Workspace Switcher Button */}
            {workspaces.length > 1 && (
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center bg-background-tertiary/50 rounded-lg justify-between w-full px-3 py-2 text-text-secondary text-sm font-display hover:text-text-primary hover:bg-background-tertiary transition-colors cursor-pointer"
                    >
                        <span>Switch workspace</span>
                        <FiChevronDown
                            className={`text-base transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-background-primary border border-background-tertiary rounded-lg shadow-xl z-50 overflow-hidden">
                            <div className="py-1">
                                {workspaces
                                    .filter(workspace => workspace.id !== currentWorkspace.id)
                                    .map((workspace) => (
                                        <button
                                            key={workspace.id}
                                            onClick={() => handleWorkspaceSelect(workspace.id)}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-background-secondary transition-colors"
                                        >
                                            <FiFolder className="text-spotlight-purple flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-text-primary font-medium text-sm truncate">
                                                    {workspace.name}
                                                </div>
                                                <div className="text-text-secondary text-xs flex items-center gap-2">
                                                    <span className="flex items-center gap-1">
                                                        <FiUsers size={10} />
                                                        {workspace.memberCount}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <FiFolder size={10} />
                                                        {workspace.boardCount}
                                                    </span>
                                                    {workspace.isOwner && (
                                                        <span className="text-spotlight-purple text-xs">Owner</span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}