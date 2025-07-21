"use client";

import { useState, useEffect } from 'react';
import DashboardSection from '@/components/dashboard/dashboardSection';
import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import DashboardSectionSkeleton from '@/components/skeletons/DashboardSectionSkeleton';

const recentlyViewedCards = [
  {
    title: "Marketing Campaign",
    description: "Creative Agency",
    members: [{ name: "JD" }, { name: "SM" }],
  },
  {
    title: "Marketing Campaign",
    description: "Creative Agency",
    members: [{ name: "JD" }, { name: "SM" }],
  },
  {
    title: "Marketing Campaign",
    description: "Creative Agency",
    members: [{ name: "JD" }, { name: "SM" }],
  },

];

const workspaces = [
  {
    id: "Creative Agency",
    title: "Creative Agency",
    cards: [
      {
        title: "Workspace 1",
        lastUpdated: "2h ago",
        members: [{ name: "JD" }, { name: "SM" }],
      },
      {
        title: "Workspace 2",
        lastUpdated: "1h ago",
        members: [{ name: "JD" }, { name: "SM" }],
      },
      {
        title: "Workspace 3",
        lastUpdated: "1h ago",
        members: [{ name: "JD" }, { name: "SM" }],
      },

      {
        title: "Workspace 4",
        lastUpdated: "1h ago",
        members: [{ name: "JD" }, { name: "SM" }],
      },

      {
        title: "Workspace 5",
        lastUpdated: "1h ago",
        members: [{ name: "JD" }, { name: "SM" }],
      },

      {
        title: "Workspace 6",
        lastUpdated: "1h ago",
        members: [{ name: "JD" }, { name: "SM" }],
      },
    ]
  },

  {
    id: "Marketing Campaign",
    title: "Marketing Campaign",
    cards: [
      {
        title: "Workspace 1",
        lastUpdated: "2h ago",
        members: [{ name: "JD" }],
      },
      {
        title: "Workspace 2",
        lastUpdated: "1h ago",
        members: [{ name: "JD" }],
      },
      {
        title: "Workspace 3",
        lastUpdated: "1h ago",
        members: [{ name: "JD" }],
      },
      {
        title: "Workspace 4",
        lastUpdated: "1h ago",
        members: [{ name: "JD" }],
      },
      {
        title: "Workspace 5",
        lastUpdated: "1h ago",
        members: [{ name: "JD" }],
      },
      {
        title: "Workspace 6",
        lastUpdated: "1h ago",
        members: [{ name: "JD" }],
      },

    ]
  },



];

const guestWorkspaces = [
  {
    id: "Creative Agency",
    title: "Creative Agency",
    cards: [
      {
        title: "Workspace 1",
        lastUpdated: "2h ago",
        members: [{ name: "JD" }, { name: "SM" }],
      },
      {
        title: "Workspace 2",
        lastUpdated: "1h ago",
        members: [{ name: "JD" }, { name: "SM" }],
      },
      {
        title: "Workspace 3",
        lastUpdated: "1h ago",
        members: [{ name: "JD" }, { name: "SM" }],
      },

      {
        title: "Workspace 4",
        lastUpdated: "1h ago",
        members: [{ name: "JD" }, { name: "SM" }],
      },

      {
        title: "Workspace 5",
        lastUpdated: "1h ago",
        members: [{ name: "JD" }, { name: "SM" }],
      },

      {
        title: "Workspace 6",
        lastUpdated: "1h ago",
        members: [{ name: "JD" }, { name: "SM" }],
      },
    ]
  },

  {
    id: "Marketing Campaign",
    title: "Marketing Campaign",
    cards: [
      {
        title: "Workspace 1",
        lastUpdated: "2h ago",
        members: [{ name: "JD" }],
      },
      {
        title: "Workspace 2",
        lastUpdated: "1h ago",
        members: [{ name: "JD" }],
      },
      {
        title: "Workspace 3",
        lastUpdated: "1h ago",
        members: [{ name: "JD" }],
      },
      {
        title: "Workspace 4",
        lastUpdated: "1h ago",
        members: [{ name: "JD" }],
      },
      {
        title: "Workspace 5",
        lastUpdated: "1h ago",
        members: [{ name: "JD" }],
      },
      {
        title: "Workspace 6",
        lastUpdated: "1h ago",
        members: [{ name: "JD" }],
      },

    ]
  },



];

export default function DashboardPage() {
  const [isRecentlyViewedLoading, setIsRecentlyViewedLoading] = useState(true);
  const [isWorkspacesLoading, setIsWorkspacesLoading] = useState(true);
  const [isGuestWorkspacesLoading, setIsGuestWorkspacesLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls with staggered loading
    const loadRecentlyViewed = setTimeout(() => {
      setIsRecentlyViewedLoading(false);
    }, 1000);

    const loadWorkspaces = setTimeout(() => {
      setIsWorkspacesLoading(false);
    }, 1500);

    const loadGuestWorkspaces = setTimeout(() => {
      setIsGuestWorkspacesLoading(false);
    }, 2000);

    return () => {
      clearTimeout(loadRecentlyViewed);
      clearTimeout(loadWorkspaces);
      clearTimeout(loadGuestWorkspaces);
    };
  }, []);

  return (
    <ProtectedLayout>
      <div className="space-y-6 responsive-px-sm max-w-screen-2xl mx-auto">
        <div className="space-y-1">
          <div className="text-text-primary text-2xl font-display font-semibold">
            Recently Viewed
          </div>
          {isRecentlyViewedLoading ? (
            <DashboardSectionSkeleton cardCount={3} />
          ) : (
            <div className="animate-fade-in">
              <DashboardSection
                cards={recentlyViewedCards}
              />
            </div>
          )}
        </div>

        <div className="mt-12 space-y-1">
          <div className="text-text-primary text-2xl font-display font-semibold">
            Workspaces
          </div>
          {isWorkspacesLoading ? (
            <div className="space-y-6">
              <DashboardSectionSkeleton hasLabel={true} hasInfo={true} cardCount={5} />
              <DashboardSectionSkeleton hasLabel={true} hasInfo={true} cardCount={5} />
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {workspaces.map((workspace) => (
                <DashboardSection
                  key={workspace.id}
                  label={workspace.title}
                  info={{
                    members: workspace.cards.length,
                    boards: workspace.cards.length,
                    owner: "Owner",
                  }}
                  cards={workspace.cards}
                  workspaceId={workspace.id}
                />
              ))}
            </div>
          )}

          <div className="mt-12 space-y-1">
            <div className="text-text-primary text-2xl font-display font-semibold">
              Guest Workspaces
            </div>
            {isGuestWorkspacesLoading ? (
              <div className="space-y-6">
                <DashboardSectionSkeleton hasLabel={true} hasInfo={true} cardCount={5} />
                <DashboardSectionSkeleton hasLabel={true} hasInfo={true} cardCount={5} />
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                {guestWorkspaces.map((workspace) => (
                  <DashboardSection
                    key={workspace.id}
                    label={workspace.title}
                    info={{
                      members: workspace.cards.length,
                      boards: workspace.cards.length,
                      owner: "Owner",
                    }}
                    cards={workspace.cards}
                    workspaceId={workspace.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </ProtectedLayout >
  );
}