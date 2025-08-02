"use client";

import { use, useRef } from "react";
import { useRouter } from "next/navigation";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import DashboardSection from "@/components/dashboard/dashboardSection";
import { useWorkspace, useWorkspaceBoards } from "@/hooks/useFirestore";
import { useRecentlyViewed } from "@/hooks/useDashboard";
import { FiArrowLeft, FiUserPlus } from "react-icons/fi";

interface WorkspacePageProps {
  params: Promise<{
    orgId: string;
    workspaceId: string;
  }>;
}

export default function WorkspacePage({ params }: WorkspacePageProps) {
  // Unwrap async params for Next.js 15 compatibility
  const { orgId: organizationId, workspaceId } = use(params);
  const router = useRouter();
  const { addRecentItem } = useRecentlyViewed();
  const createBoardRef = useRef<(() => void) | null>(null);

  // Fetch workspace and boards data
  const { data: workspace, isLoading: workspaceLoading, error: workspaceError } = useWorkspace(workspaceId);
  const { data: boards = [], isLoading: boardsLoading, error: boardsError } = useWorkspaceBoards(workspaceId);

  const isLoading = workspaceLoading || boardsLoading;
  const error = workspaceError || boardsError;

  const handleBoardClick = (boardTitle: string) => {
    const board = boards.find(b => b.name === boardTitle);
    if (board) {
      // Add to recently viewed
      addRecentItem({
        id: board.id,
        name: board.name,
        type: 'board',
        workspaceId: workspace?.id,
        workspaceName: workspace?.name
      });

      // Navigate to nested board route
      router.push(`/organization/${organizationId}/workspace/${workspaceId}/board/${board.id}`);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-text-secondary font-display text-lg">Loading workspace...</div>
        </div>
      </ProtectedLayout>
    );
  }

  // Show error state
  if (error || !workspace) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center h-full p-6">
          <div className="text-center">
            <div className="text-text-primary text-lg font-medium mb-2">
              Workspace not found
            </div>
            <div className="text-text-secondary mb-4">
              {error?.message || 'This workspace may not exist or you may not have access to it.'}
            </div>
            <button
              onClick={() => router.push(`/organization/${organizationId}`)}
              className="px-4 py-2 bg-spotlight-purple text-text-primary rounded-lg hover:bg-spotlight-purple/90 transition-colors"
            >
              Back to Organization
            </button>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout showSidebar={false} workspaceId={workspaceId} onCreateBoardRef={createBoardRef}>
      <div className="space-y-6 responsive-px-sm max-w-screen-2xl mx-auto p-6">
        {/* Workspace Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/organization/${organizationId}`)}
              className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-2"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Organization
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-text-primary text-3xl font-display font-bold">
                {workspace.name}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-text-secondary">
                <span>{boards.length} boards</span>
                <span>•</span>
                <span>{workspace.members.length} members</span>
                <span>•</span>
                <span>Owner</span>
              </div>
            </div>

            <button
              onClick={() => console.log('Invite members')}
              className="px-4 py-2 text-text-secondary border border-background-tertiary rounded-lg hover:border-text-tertiary hover:text-text-primary transition-colors flex items-center gap-2"
            >
              <FiUserPlus className="w-4 h-4" />
              Invite Members
            </button>
          </div>
        </div>

        {/* Workspace Boards */}
        <div className="mt-8">
          <div className="text-text-primary text-2xl font-display font-semibold mb-4">
            Boards
          </div>

          {boards.length > 0 ? (
            <DashboardSection
              showAllBoards={true}
              cards={boards.map(board => ({
                title: board.name,
                description: board.icon,
                members: board.members.map(m => ({
                  name: m.userId.substring(0, 2).toUpperCase(),
                  color: 'spotlight-purple'
                })),
                lastUpdated: new Date(board.updatedAt).toLocaleString()
              }))}
              onCardClick={handleBoardClick}
            />
          ) : (
            <div className="text-center py-12">
              <div className="text-text-secondary text-lg mb-4">
                No boards in this workspace yet
              </div>
              <button
                onClick={() => createBoardRef.current?.()}
                className="px-6 py-3 bg-spotlight-purple text-text-primary rounded-lg hover:bg-spotlight-purple/90 transition-colors"
              >
                Create Your First Board
              </button>
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}