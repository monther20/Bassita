import Image from "next/image";
import { useState, useCallback } from "react";
import { UserMenu } from "../userMenu";
import SearchInputWithDropdown from "../SearchInputWithDropdown";
import SearchModal from "../searchModal";
import CreateDropdown from "../CreateDropdown";
import ThemeToggle from "../ThemeToggle";
import { SearchResult } from "../SearchDropdown";
import { useModal } from "@/contexts/ModalContext";
import { useTheme } from "@/contexts/ThemeContext";
import { themeMetadata } from "@/stores/theme";
import { FiMenu, FiSearch } from "react-icons/fi";
import Link from "next/link";

interface HeaderProps {
    height?: string;
    onToggleSidebar?: () => void;
    showSidebarToggle?: boolean;
    workspaceId?: string; // For pre-selecting workspace when creating boards
    onCreateBoardRef?: React.MutableRefObject<(() => void) | null>;
    onCreateWorkspaceRef?: React.MutableRefObject<(() => void) | null>;
}

export default function Header({
    height,
    onToggleSidebar,
    showSidebarToggle = false,
    workspaceId,
    onCreateBoardRef,
    onCreateWorkspaceRef
}: HeaderProps) {
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const { openCreateBoardModal, openCreateWorkspaceModal, openCreateOrganizationModal } = useModal();
    const { theme } = useTheme();
    
    // Dynamic logo selection based on theme category
    const isLightTheme = themeMetadata[theme].category === 'light';
    const logoSrc = isLightTheme ? '/logo-light.png' : '/logo.png';

    // Search functionality
    const handleSearchItemSelect = useCallback((item: SearchResult) => {
        console.log('Selected search item:', item);
        // Navigation will be handled by SearchDropdown component
    }, []);

    const handleCreateBoard = () => {
        openCreateBoardModal(workspaceId);
    };

    const handleCreateOrganization = () => {
        openCreateOrganizationModal();
    };

    const handleCreateWorkspace = () => {
        openCreateWorkspaceModal();
    };

    // Expose functions to parent components via refs
    if (onCreateBoardRef) {
        onCreateBoardRef.current = handleCreateBoard;
    }
    if (onCreateWorkspaceRef) {
        onCreateWorkspaceRef.current = handleCreateWorkspace;
    }

    return (
        <>
            <header className={`bg-background-primary w-full ${height} p-2`}>
                <div className="flex items-center justify-between h-full responsive-px-sm">
                    {/* Left section */}
                    <div className="flex items-center responsive-gap-sm">
                        {/* Mobile sidebar toggle */}
                        {showSidebarToggle && (
                            <button
                                onClick={onToggleSidebar}
                                className="lg:hidden touch-target p-2 rounded-lg hover:bg-background-secondary transition-colors cursor-pointer"
                                aria-label="Toggle sidebar"
                            >
                                <FiMenu className="icon-md text-text-primary" />
                            </button>
                        )}

                        {/* Logo */}
                        <Link href="/organization" className="flex-shrink-0">
                            <Image
                                src={logoSrc}
                                alt="Bassita Logo"
                                width={170}
                                height={50}
                                className="w-auto md:h-12"
                                priority
                            />
                        </Link>
                    </div>

                    {/* Center section - Search (hidden on mobile) */}
                    <div className="hidden md:flex items-center gap-4 flex-1 max-w-lg mx-6 lg:mx-8">
                        <SearchInputWithDropdown
                            placeholder="Search boards, workspaces, and organizations..."
                            width="w-full"
                            height="h-8 md:h-10"
                            className="border border-spotlight-purple"
                            onItemSelect={handleSearchItemSelect}
                        />
                        <div className="hidden sm:block">
                            <CreateDropdown
                                onCreateBoard={handleCreateBoard}
                                onCreateWorkspace={handleCreateWorkspace}
                                onCreateOrganization={handleCreateOrganization}
                                size="sm"
                                variant="button"
                            />
                        </div>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center responsive-gap-xs">
                        {/* Mobile search button */}
                        <button
                            onClick={() => setIsSearchModalOpen(true)}
                            className="md:hidden touch-target p-2 rounded-lg hover:bg-background-secondary transition-colors cursor-pointer"
                            aria-label="Open search"
                        >
                            <FiSearch className="icon-md text-text-primary" />
                        </button>

                        {/* Create button - mobile (icon only) */}
                        <div className="sm:hidden">
                            <CreateDropdown
                                onCreateBoard={handleCreateBoard}
                                onCreateWorkspace={handleCreateWorkspace}
                                onCreateOrganization={handleCreateOrganization}
                                size="sm"
                                variant="icon"
                            />
                        </div>

                        {/* Theme toggle */}
                        <ThemeToggle size="sm" />

                        {/* User menu */}
                        <UserMenu />
                    </div>
                </div>
            </header>

            {/* Search Modal */}
            <SearchModal
                isOpen={isSearchModalOpen}
                onClose={() => setIsSearchModalOpen(false)}
                onCreateBoard={handleCreateBoard}
                onCreateWorkspace={handleCreateWorkspace}
            />

        </>
    )
}