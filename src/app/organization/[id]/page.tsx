"use client";

import { useRouter, useParams } from 'next/navigation';
import { useEffect } from 'react';
import { FiPlus, FiUsers, FiFolder, FiActivity } from 'react-icons/fi';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import { useUserOrganizations } from '@/hooks/useUserOrganizations';
import { useDashboardData } from '@/hooks/useDashboard';
import DashboardSection from '@/components/dashboard/dashboardSection';
import DashboardSectionSkeleton from '@/components/skeletons/DashboardSectionSkeleton';
import { useModal } from '@/contexts/ModalContext';

export default function OrganizationPage() {
    const router = useRouter();
    const params = useParams();
    const organizationId = params.id as string;
    
    const { currentOrganization, switchOrganization, loading: orgLoading } = useUserOrganizations();
    const { myWorkspaces, isLoading: dashboardLoading, error } = useDashboardData();
    const { openCreateWorkspaceModal } = useModal();
    
    // Switch to the organization from URL if different from current
    useEffect(() => {
        if (organizationId && currentOrganization && organizationId !== currentOrganization.id) {
            switchOrganization(organizationId);
        }
    }, [organizationId, currentOrganization, switchOrganization]);

    // Redirect to current organization if no ID provided or organization not found
    useEffect(() => {
        if (!orgLoading && currentOrganization && organizationId !== currentOrganization.id) {
            router.replace(`/organization/${currentOrganization.id}`);
        }
    }, [organizationId, currentOrganization, orgLoading, router]);

    const handleWorkspaceClick = (workspace: { id: string; name: string }) => {
        router.push(`/workspace/${workspace.id}`);
    };

    const handleBoardClick = (board: { id: string; name: string; workspaceId?: string; workspaceName?: string }) => {
        router.push(`/board/${board.id}`);
    };

    if (orgLoading || !currentOrganization) {
        return (
            <ProtectedLayout>
                <div className="flex items-center justify-center h-full p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-background-tertiary rounded w-64"></div>
                        <div className="h-4 bg-background-tertiary rounded w-48"></div>
                    </div>
                </div>
            </ProtectedLayout>
        );
    }

    if (error) {
        return (
            <ProtectedLayout>
                <div className="flex items-center justify-center h-full p-6">
                    <div className="text-center">
                        <div className="text-text-primary text-lg font-medium mb-2">
                            Failed to load organization
                        </div>
                        <div className="text-text-secondary mb-4">
                            {error.message}
                        </div>
                    </div>
                </div>
            </ProtectedLayout>
        );
    }

    // Calculate organization stats
    const totalWorkspaces = myWorkspaces.length;
    const totalBoards = myWorkspaces.reduce((acc, workspace) => acc + workspace.boards.length, 0);
    const totalMembers = currentOrganization.memberCount;

    return (
        <ProtectedLayout>
            <div className="space-y-6 responsive-px-sm max-w-screen-2xl mx-auto p-6">
                {/* Organization Header */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-text-primary text-3xl font-display font-bold">
                                {currentOrganization.name}
                            </h1>
                            <p className="text-text-secondary text-base font-body mt-1">
                                Organization overview and workspace management
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => openCreateWorkspaceModal()}
                                className="flex items-center gap-2 bg-spotlight-purple hover:bg-spotlight-purple/80 text-text-primary px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                <FiPlus size={18} />
                                New Workspace
                            </button>
                        </div>
                    </div>

                    {/* Organization Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-background-secondary rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-spotlight-blue rounded-lg p-2">
                                    <FiFolder className="text-text-primary text-lg" />
                                </div>
                                <div>
                                    <div className="text-text-primary text-2xl font-display font-bold">
                                        {totalWorkspaces}
                                    </div>
                                    <div className="text-text-secondary text-sm">
                                        Workspaces
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-background-secondary rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-spotlight-green rounded-lg p-2">
                                    <FiActivity className="text-text-primary text-lg" />
                                </div>
                                <div>
                                    <div className="text-text-primary text-2xl font-display font-bold">
                                        {totalBoards}
                                    </div>
                                    <div className="text-text-secondary text-sm">
                                        Total Boards
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-background-secondary rounded-lg p-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-spotlight-purple rounded-lg p-2">
                                    <FiUsers className="text-text-primary text-lg" />
                                </div>
                                <div>
                                    <div className="text-text-primary text-2xl font-display font-bold">
                                        {totalMembers}
                                    </div>
                                    <div className="text-text-secondary text-sm">
                                        Members
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Workspaces Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-text-primary text-2xl font-display font-semibold">
                            Workspaces
                        </h2>
                    </div>

                    {dashboardLoading ? (
                        <div className="space-y-6">
                            <DashboardSectionSkeleton hasLabel={true} hasInfo={true} cardCount={5} />
                            <DashboardSectionSkeleton hasLabel={true} hasInfo={true} cardCount={3} />
                        </div>
                    ) : myWorkspaces.length > 0 ? (
                        <div className="space-y-6 animate-fade-in">
                            {myWorkspaces.map((workspace) => (
                                <DashboardSection
                                    key={workspace.id}
                                    label={workspace.name}
                                    info={{
                                        members: workspace.memberCount,
                                        boards: workspace.boardCount,
                                        owner: workspace.isOwner ? "Owner" : "Member",
                                    }}
                                    cards={workspace.boards.map(board => ({
                                        title: board.name,
                                        icon: board.icon,
                                        members: board.members,
                                        lastUpdated: new Date(board.lastUpdated).toLocaleString()
                                    }))}
                                    workspaceId={workspace.id}
                                    onCardClick={(title) => {
                                        const board = workspace.boards.find(b => b.name === title);
                                        if (board) handleBoardClick(board);
                                    }}
                                    onWorkspaceClick={() => handleWorkspaceClick(workspace)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="bg-background-secondary rounded-lg p-8 max-w-md mx-auto">
                                <FiFolder className="text-text-secondary text-4xl mx-auto mb-4" />
                                <h3 className="text-text-primary text-lg font-display font-medium mb-2">
                                    No workspaces yet
                                </h3>
                                <p className="text-text-secondary text-sm mb-4">
                                    Create your first workspace to start organizing your boards and collaborating with your team.
                                </p>
                                <button
                                    onClick={() => openCreateWorkspaceModal()}
                                    className="flex items-center gap-2 bg-spotlight-purple hover:bg-spotlight-purple/80 text-text-primary px-4 py-2 rounded-lg font-medium transition-colors mx-auto"
                                >
                                    <FiPlus size={16} />
                                    Create Workspace
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedLayout>
    );
}