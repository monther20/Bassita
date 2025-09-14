"use client";

import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck, FiUsers, FiHome, } from "react-icons/fi";
import { BsBuilding } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useUserOrganizations } from "@/hooks/useUserOrganizations";

interface OrganizationSwitcherProps {
    isCollapsed?: boolean;
}

export default function OrganizationSwitcher({ isCollapsed = false }: OrganizationSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const { organizations, currentOrganization, switchOrganization, loading } = useUserOrganizations();

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

    const handleOrganizationSelect = (organizationId: string) => {
        switchOrganization(organizationId);
        setIsOpen(false);
        // Navigate to the selected organization
        router.push(`/organization/${organizationId}`);
    };

    if (loading || !currentOrganization) {
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
                    title={currentOrganization.name}
                >
                    <FiHome className="text-spotlight-purple text-xl mx-auto" />
                </button>

                {/* Collapsed Dropdown */}
                {isOpen && (
                    <div className="absolute left-full top-0 ml-2 w-64 bg-background-primary border border-background-tertiary rounded-lg shadow-xl z-50">
                        <div className="p-2">
                            <div className="text-text-secondary text-xs font-medium px-3 py-2 uppercase tracking-wide">
                                Switch Organization
                            </div>
                            {organizations.map((organization) => (
                                <button
                                    key={organization.id}
                                    onClick={() => handleOrganizationSelect(organization.id)}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-background-secondary rounded-lg transition-colors"
                                >
                                    <BsBuilding className="text-spotlight-purple flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-text-primary font-medium text-sm truncate">
                                            {organization.name}
                                        </div>
                                        <div className="text-text-secondary text-xs">
                                            {organization.memberCount} members
                                        </div>
                                    </div>
                                    {organization.id === currentOrganization.id && (
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
            {/* Current Organization Display */}
            <div className="bg-spotlight-purple rounded-lg p-3 relative">
                <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="text-text-primary font-display font-medium text-sm truncate">
                            {currentOrganization.name}
                        </div>
                        <div className="text-text-secondary text-xs font-display flex items-center gap-1">
                            <FiUsers size={12} />
                            {currentOrganization.memberCount}
                            <span className="mx-1">•</span>
                            <BsBuilding size={12} />
                            {currentOrganization.workspaceCount}
                        </div>
                    </div>
                    {currentOrganization.isOwner && (
                        <div className="text-text-primary/70 text-xs bg-white/10 px-2 py-1 rounded-full">
                            Owner
                        </div>
                    )}
                </div>
            </div>

            {/* Organization Switcher Button */}
            {organizations.length > 1 && (
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center bg-background-tertiary/50 rounded-lg justify-between w-full px-3 py-2 text-text-secondary text-sm font-display hover:text-text-primary hover:bg-background-tertiary transition-colors cursor-pointer"
                    >
                        <span>Switch organization</span>
                        <FiChevronDown
                            className={`text-base transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-background-primary border border-background-tertiary rounded-lg shadow-xl z-50 overflow-hidden">
                            <div className="py-1">
                                {organizations
                                    .filter(organization => organization.id !== currentOrganization.id)
                                    .map((organization) => (
                                        <button
                                            key={organization.id}
                                            onClick={() => handleOrganizationSelect(organization.id)}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-background-secondary transition-colors"
                                        >
                                            <BsBuilding className="text-spotlight-purple flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-text-primary font-medium text-sm truncate">
                                                    {organization.name}
                                                </div>
                                                <div className="text-text-secondary text-xs flex items-center gap-2">
                                                    <span className="flex items-center gap-1">
                                                        <FiUsers size={10} />
                                                        {organization.memberCount}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <BsBuilding size={10} />
                                                        {organization.workspaceCount}
                                                    </span>
                                                    {organization.isOwner && (
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