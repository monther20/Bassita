"use client";

import { useRouter } from 'next/navigation';
import DashboardSection from '@/components/dashboard/dashboardSection';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import DashboardSectionSkeleton from '@/components/skeletons/DashboardSectionSkeleton';
import { useDashboardData, useRecentlyViewed } from '@/hooks/useDashboard';

export default function DashboardPage() {
  const router = useRouter();
  const { addRecentItem } = useRecentlyViewed();
  const {
    myWorkspaces,
    guestWorkspaces,
    recentlyViewed,
    isLoading,
    error
  } = useDashboardData();

  const handleBoardClick = (board: { id: string; name: string; workspaceId?: string; workspaceName?: string }) => {
    // Add to recently viewed
    addRecentItem({
      id: board.id,
      name: board.name,
      type: 'board',
      workspaceId: board.workspaceId,
      workspaceName: board.workspaceName
    });

    router.push(`/board/${board.id}`);
  };

  const handleWorkspaceClick = (workspace: { id: string; name: string }) => {
    // Add to recently viewed
    addRecentItem({
      id: workspace.id,
      name: workspace.name,
      type: 'workspace'
    });

    router.push(`/workspace/${workspace.id}`);
  };

  // Show error state
  if (error) {
    return (
      <ProtectedLayout>
        <div className="flex items-center justify-center h-full p-6">
          <div className="text-center">
            <div className="text-text-primary text-lg font-medium mb-2">
              Failed to load dashboard
            </div>
            <div className="text-text-secondary mb-4">
              {error.message}
            </div>
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="space-y-6 responsive-px-sm max-w-screen-2xl mx-auto p-6">
        {/* Recently Viewed Section */}
        <div className="space-y-1">
          <div className="text-text-primary text-2xl font-display font-semibold">
            Recently Viewed
          </div>
          {isLoading ? (
            <DashboardSectionSkeleton cardCount={3} />
          ) : recentlyViewed.length > 0 ? (
            <div className="animate-fade-in">
              <DashboardSection
                cards={recentlyViewed.map(board => ({
                  title: board.name,
                  description: board.workspaceName || "",
                  members: board.members,
                  lastUpdated: new Date(board.lastUpdated).toLocaleString()
                }))}
                onCardClick={(title) => {
                  const board = recentlyViewed.find(b => b.name === title);
                  if (board) handleBoardClick(board);
                }}
              />
            </div>
          ) : (
            <div className="text-text-secondary text-center py-8">
              No recently viewed boards
            </div>
          )}
        </div>

        {/* My Workspaces Section */}
        <div className="mt-12 space-y-1">
          <div className="text-text-primary text-2xl font-display font-semibold">
            My Workspaces
          </div>
          {isLoading ? (
            <div className="space-y-6">
              <DashboardSectionSkeleton hasLabel={true} hasInfo={true} cardCount={5} />
              <DashboardSectionSkeleton hasLabel={true} hasInfo={true} cardCount={5} />
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
                    owner: "Owner",
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
                />
              ))}
            </div>
          ) : (
            <div className="text-text-secondary text-center py-8">
              No workspaces found. Create your first workspace to get started!
            </div>
          )}

          {/* Guest Workspaces Section */}
          {guestWorkspaces.length > 0 && (
            <div className="mt-12 space-y-1">
              <div className="text-text-primary text-2xl font-display font-semibold">
                Guest Workspaces
              </div>
              {isLoading ? (
                <div className="space-y-6">
                  <DashboardSectionSkeleton hasLabel={true} hasInfo={true} cardCount={5} />
                  <DashboardSectionSkeleton hasLabel={true} hasInfo={true} cardCount={5} />
                </div>
              ) : (
                <div className="space-y-6 animate-fade-in">
                  {guestWorkspaces.map((workspace) => (
                    <DashboardSection
                      key={workspace.id}
                      label={workspace.name}
                      info={{
                        members: workspace.memberCount,
                        boards: workspace.boardCount,
                        owner: "Guest",
                      }}
                      cards={workspace.boards.map(board => ({
                        title: board.name,
                        description: board.icon,
                        members: board.members,
                        lastUpdated: new Date(board.lastUpdated).toLocaleString()
                      }))}
                      workspaceId={workspace.id}
                      onCardClick={(title) => {
                        const board = workspace.boards.find(b => b.name === title);
                        if (board) handleBoardClick(board);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedLayout>
  );
}