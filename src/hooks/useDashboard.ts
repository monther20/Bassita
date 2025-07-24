import { useQuery } from '@tanstack/react-query';
import { FirestoreService } from '@/lib/firestore';
import { FirestoreBoard, FirestoreWorkspace } from '@/types/firestore';
import { useAuth } from './useAuth';
import { useState, useMemo } from 'react';

// Dashboard-specific interfaces for UI
export interface DashboardBoard {
  id: string;
  name: string;
  icon: string;
  workspaceId: string;
  workspaceName?: string;
  lastUpdated: string;
  members: Array<{ name: string; color: string }>;
  isOwner: boolean;
}

export interface DashboardWorkspace {
  id: string;
  name: string;
  boardCount: number;
  memberCount: number;
  isOwner: boolean;
  lastActivity: string;
  boards: DashboardBoard[];
}

// Recently viewed items storage
const RECENT_ITEMS_KEY = 'bassita_recent_items';
const MAX_RECENT_ITEMS = 6;

interface RecentItem {
  id: string;
  name: string;
  type: 'board' | 'workspace';
  workspaceId?: string;
  workspaceName?: string;
  timestamp: number;
}

// Hook for recently viewed items
export function useRecentlyViewed() {
  const [recentItems, setRecentItems] = useState<RecentItem[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(RECENT_ITEMS_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const addRecentItem = (item: Omit<RecentItem, 'timestamp'>) => {
    const newItem = { ...item, timestamp: Date.now() };
    const filtered = recentItems.filter(i => !(i.id === item.id && i.type === item.type));
    const updated = [newItem, ...filtered].slice(0, MAX_RECENT_ITEMS);

    setRecentItems(updated);
    localStorage.setItem(RECENT_ITEMS_KEY, JSON.stringify(updated));
  };

  return { recentItems, addRecentItem };
}

// Main dashboard data hook
export function useDashboardData() {
  const { user } = useAuth();
  const { recentItems } = useRecentlyViewed();

  // Fetch user workspaces
  const workspacesQuery = useQuery({
    queryKey: ['dashboard-workspaces', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }
      const result = await FirestoreService.getUserWorkspaces(user.id);
      return result;
    },
    enabled: !!user?.id,
    staleTime: 0, // Always refetch for debugging
    gcTime: 0, // No caching for debugging
    retry: 1,
  });

  // Fetch all boards for the user
  const boardsQuery = useQuery({
    queryKey: ['dashboard-boards', user?.id],
    queryFn: async () => {
      if (!user?.id || !workspacesQuery.data) {
        return [];
      }
      const allBoards = await Promise.all(
        workspacesQuery.data.map(async (workspace) => {
          const boards = await FirestoreService.getWorkspaceBoards(workspace.id);
          return boards.map(board => ({
            ...board,
            workspaceName: workspace.name,
            isOwner: board.ownerId === user.id
          }));
        })
      );

      const flatBoards = allBoards.flat();
      return flatBoards;
    },
    enabled: !!user?.id && !!workspacesQuery.data,
    staleTime: 0, // Always refetch for debugging
    gcTime: 0, // No caching for debugging
    retry: 1,

  });

  // Transform data for dashboard UI
  const dashboardData = useMemo(() => {


    if (!workspacesQuery.data || !boardsQuery.data || !user?.id) {
      return {
        myWorkspaces: [],
        guestWorkspaces: [],
        recentlyViewed: [],
        allBoards: []
      };
    }

    // Transform workspaces
    const transformedWorkspaces = workspacesQuery.data.map((workspace): DashboardWorkspace => {
      const workspaceBoards = boardsQuery.data.filter(board => board.workspaceId === workspace.id);

      return {
        id: workspace.id,
        name: workspace.name,
        boardCount: workspaceBoards.length,
        memberCount: workspace.members?.length || 0,
        isOwner: workspace.ownerId === user.id,
        lastActivity: workspace.updatedAt?.toISOString() || new Date().toISOString(),
        boards: workspaceBoards.map((board): DashboardBoard => ({
          id: board.id,
          name: board.name,
          icon: board.icon,
          workspaceId: board.workspaceId,
          workspaceName: workspace.name,
          lastUpdated: board.updatedAt?.toISOString() || new Date().toISOString(),
          members: board.members?.map(m => ({
            name: m.userId.substring(0, 2).toUpperCase(),
            color: 'spotlight-purple' // TODO: Get real user colors
          })) || [],
          isOwner: board.ownerId === user.id
        }))
      };
    });

    // Separate owned vs guest workspaces
    const myWorkspaces = transformedWorkspaces.filter(w => w.isOwner);
    const guestWorkspaces = transformedWorkspaces.filter(w => !w.isOwner);


    // Get recently viewed boards
    const recentlyViewed = recentItems
      .filter(item => item.type === 'board')
      .map(item => {
        const board = boardsQuery.data.find(b => b.id === item.id);
        if (!board) return null;

        return {
          id: board.id,
          name: board.name,
          icon: board.icon,
          workspaceId: board.workspaceId,
          workspaceName: board.workspaceName,
          lastUpdated: board.updatedAt.toISOString(),
          members: board.members.map(m => ({
            name: m.userId.substring(0, 2).toUpperCase(),
            color: 'spotlight-purple'
          })),
          isOwner: board.isOwner
        };
      })
      .filter(Boolean) as DashboardBoard[];

    const finalResult = {
      myWorkspaces,
      guestWorkspaces,
      recentlyViewed,
      allBoards: boardsQuery.data.map((board): DashboardBoard => ({
        id: board.id,
        name: board.name,
        icon: board.icon,
        workspaceId: board.workspaceId,
        workspaceName: board.workspaceName,
        lastUpdated: board.updatedAt?.toISOString() || new Date().toISOString(),
        members: board.members?.map(m => ({
          name: m.userId.substring(0, 2).toUpperCase(),
          color: 'spotlight-purple'
        })) || [],
        isOwner: board.isOwner
      }))
    };


    return finalResult;
  }, [workspacesQuery.data, boardsQuery.data, user?.id, recentItems]);

  return {
    ...dashboardData,
    isLoading: workspacesQuery.isLoading || boardsQuery.isLoading,
    error: workspacesQuery.error || boardsQuery.error,
    refetch: () => {
      workspacesQuery.refetch();
      boardsQuery.refetch();
    }
  };
}

// Search hook
export function useSearch(query: string) {
  const { allBoards, myWorkspaces, guestWorkspaces } = useDashboardData();

  const searchResults = useMemo(() => {
    if (!query.trim()) {
      return {
        boards: [],
        workspaces: [],
        total: 0
      };
    }

    const searchTerm = query.toLowerCase();

    const matchingBoards = allBoards.filter(board =>
      board.name.toLowerCase().includes(searchTerm) ||
      board.workspaceName?.toLowerCase().includes(searchTerm)
    );

    const allWorkspaces = [...myWorkspaces, ...guestWorkspaces];
    const matchingWorkspaces = allWorkspaces.filter(workspace =>
      workspace.name.toLowerCase().includes(searchTerm)
    );

    return {
      boards: matchingBoards,
      workspaces: matchingWorkspaces,
      total: matchingBoards.length + matchingWorkspaces.length
    };
  }, [query, allBoards, myWorkspaces, guestWorkspaces]);

  return searchResults;
}