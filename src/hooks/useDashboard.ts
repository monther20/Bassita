import { useQuery } from '@tanstack/react-query';
import { FirestoreService } from '@/lib/firestore';
import { FirestoreBoard, FirestoreWorkspace, FirestoreOrganization } from '@/types/firestore';
import { useAuth } from './useAuth';
import { useCurrentOrganization } from './useUserOrganizations';
import { queryKeys } from '@/lib/query-keys';
import { useState, useMemo, useEffect } from 'react';

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
export function useDashboardData(organizationId?: string) {
  const { user } = useAuth();
  const { recentItems } = useRecentlyViewed();
  const currentOrganizationId = useCurrentOrganization();
  
  // Use provided organizationId or fall back to current organization
  const effectiveOrganizationId = organizationId || currentOrganizationId;

  // Fetch user workspaces (organization-specific or all)
  const workspacesQuery = useQuery({
    queryKey: queryKeys.dashboard.workspaces(user?.id || '', effectiveOrganizationId || ''),
    queryFn: async () => {
      if (!user?.id) {
        return [];
      }
      // Use organization-specific method if organizationId is provided
      if (effectiveOrganizationId) {
        const result = await FirestoreService.getOrganizationWorkspaces(effectiveOrganizationId, user.id);
        return result;
      } else {
        // Fall back to getting all user workspaces (for backward compatibility)
        const result = await FirestoreService.getUserWorkspaces(user.id);
        return result;
      }
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1,
  });

  // Fetch all boards for the user
  const boardsQuery = useQuery({
    queryKey: queryKeys.dashboard.boards(user?.id || '', effectiveOrganizationId || ''),
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
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
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

// Enhanced search hook using FirestoreService
export function useSearch(query: string, organizationId?: string) {
  const { user } = useAuth();
  const currentOrganizationId = useCurrentOrganization();
  const effectiveOrganizationId = organizationId || currentOrganizationId;
  
  const [searchResults, setSearchResults] = useState({
    boards: [] as DashboardBoard[],
    workspaces: [] as DashboardWorkspace[],
    organizations: [] as FirestoreOrganization[],
    total: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim() || !user?.id) {
        setSearchResults({ boards: [], workspaces: [], organizations: [], total: 0 });
        return;
      }

      setIsLoading(true);
      try {
        // Use FirestoreService search methods
        const results = await FirestoreService.searchAll(user.id, query);

        // Filter results by organization if specified
        if (effectiveOrganizationId) {
          // Get organization workspaces to filter boards
          const orgWorkspaces = await FirestoreService.getOrganizationWorkspaces(effectiveOrganizationId, user.id);
          const orgWorkspaceIds = new Set(orgWorkspaces.map(w => w.id));

          // Filter boards to only include those in organization workspaces
          results.boards = results.boards.filter(board => orgWorkspaceIds.has(board.workspaceId));
          
          // Filter workspaces to only include organization workspaces
          results.workspaces = results.workspaces.filter(workspace => 
            workspace.organizationId === effectiveOrganizationId
          );

          // Filter organizations to only include the current organization
          results.organizations = results.organizations.filter(org => org.id === effectiveOrganizationId);
        }

        // Create workspace lookup map for proper workspace name mapping
        const workspaceLookup = new Map(
          results.workspaces.map(workspace => [workspace.id, workspace.name])
        );

        // Transform the results to match the UI interface
        const transformedBoards: DashboardBoard[] = results.boards.map(board => ({
          id: board.id,
          name: board.name,
          icon: board.icon,
          workspaceId: board.workspaceId,
          workspaceName: workspaceLookup.get(board.workspaceId) || 'Unknown workspace',
          lastUpdated: board.updatedAt?.toISOString() || new Date().toISOString(),
          members: board.members?.map(m => ({
            name: m.userId.substring(0, 2).toUpperCase(),
            color: 'spotlight-purple'
          })) || [],
          isOwner: board.ownerId === user.id
        }));

        const transformedWorkspaces: DashboardWorkspace[] = results.workspaces.map(workspace => ({
          id: workspace.id,
          name: workspace.name,
          boardCount: 0, // We'll need to calculate this
          memberCount: workspace.members?.length || 0,
          isOwner: workspace.ownerId === user.id,
          lastActivity: workspace.updatedAt?.toISOString() || new Date().toISOString(),
          boards: [] // Empty for search results
        }));

        const transformedOrganizations = results.organizations.map(org => ({
          id: org.id,
          name: org.name,
          type: 'organization' as const,
          memberCount: org.memberUserIds?.length || 0,
          boardCount: org.workspaces?.length || 0,
          isOwner: org.ownerId === user.id
        }));

        setSearchResults({
          boards: transformedBoards,
          workspaces: transformedWorkspaces,
          organizations: transformedOrganizations,
          total: transformedBoards.length + transformedWorkspaces.length + transformedOrganizations.length
        });
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults({ boards: [], workspaces: [], organizations: [], total: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [query, user?.id, effectiveOrganizationId]);

  return { ...searchResults, isLoading };
}

// Legacy search hook for backward compatibility
export function useLegacySearch(query: string) {
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