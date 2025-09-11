/**
 * Centralized Query Keys Factory for React Query
 * Provides type-safe, organization-aware query keys with hierarchical structure
 */

export const queryKeys = {
  // User-related queries
  users: {
    all: ['users'] as const,
    organizations: (userId: string) => ['users', userId, 'organizations'] as const,
  },

  // Organization-related queries
  organizations: {
    all: ['organizations'] as const,
    byUser: (userId: string) => ['organizations', 'user', userId] as const,
    detail: (organizationId: string) => ['organizations', organizationId] as const,
    workspaces: (organizationId: string) => ['organizations', organizationId, 'workspaces'] as const,
    boards: (organizationId: string) => ['organizations', organizationId, 'boards'] as const,
    members: (organizationId: string) => ['organizations', organizationId, 'members'] as const,
  },

  // Workspace-related queries
  workspaces: {
    all: ['workspaces'] as const,
    byOrganization: (organizationId: string) => ['workspaces', 'organization', organizationId] as const,
    byUser: (userId: string, organizationId?: string) => 
      organizationId 
        ? ['workspaces', 'user', userId, 'organization', organizationId] as const
        : ['workspaces', 'user', userId] as const,
    detail: (workspaceId: string) => ['workspaces', workspaceId] as const,
    boards: (workspaceId: string) => ['workspaces', workspaceId, 'boards'] as const,
    sidebar: (userId: string, organizationId: string) => ['workspaces', 'sidebar', userId, organizationId] as const,
  },

  // Board-related queries
  boards: {
    all: ['boards'] as const,
    byUser: (userId: string, organizationId?: string) => 
      organizationId 
        ? ['boards', 'user', userId, 'organization', organizationId] as const
        : ['boards', 'user', userId] as const,
    byWorkspace: (workspaceId: string) => ['boards', 'workspace', workspaceId] as const,
    byOrganization: (organizationId: string) => ['boards', 'organization', organizationId] as const,
    detail: (boardId: string) => ['boards', boardId] as const,
    tasks: (boardId: string) => ['boards', boardId, 'tasks'] as const,
    realTime: (boardId: string) => ['boards', boardId, 'realtime'] as const,
    sidebar: (userId: string, organizationId: string) => ['boards', 'sidebar', userId, organizationId] as const,
  },

  // Task-related queries
  tasks: {
    all: ['tasks'] as const,
    byBoard: (boardId: string) => ['tasks', 'board', boardId] as const,
    detail: (taskId: string) => ['tasks', taskId] as const,
  },

  // Template-related queries
  templates: {
    all: ['templates'] as const,
    byCategory: (category: string) => ['templates', 'category', category] as const,
    detail: (templateId: string) => ['templates', templateId] as const,
  },

  // Dashboard-related queries
  dashboard: {
    data: (userId: string, organizationId: string) => ['dashboard', userId, organizationId] as const,
    boards: (userId: string, organizationId: string) => ['dashboard', 'boards', userId, organizationId] as const,
    workspaces: (userId: string, organizationId: string) => ['dashboard', 'workspaces', userId, organizationId] as const,
  },

  // Search-related queries
  search: {
    all: (userId: string, organizationId: string, query: string) => 
      ['search', userId, organizationId, query] as const,
    boards: (userId: string, organizationId: string, query: string) => 
      ['search', 'boards', userId, organizationId, query] as const,
    workspaces: (userId: string, organizationId: string, query: string) => 
      ['search', 'workspaces', userId, organizationId, query] as const,
    organizations: (userId: string, query: string) => 
      ['search', 'organizations', userId, query] as const,
  },
} as const;

/**
 * Utility functions for cache invalidation patterns
 */
export const invalidationPatterns = {
  // Invalidate all organization-related data
  organization: (organizationId: string) => [
    queryKeys.organizations.detail(organizationId),
    queryKeys.organizations.workspaces(organizationId),
    queryKeys.organizations.boards(organizationId),
    queryKeys.organizations.members(organizationId),
  ],

  // Invalidate all workspace-related data
  workspace: (workspaceId: string, organizationId: string) => [
    queryKeys.workspaces.detail(workspaceId),
    queryKeys.workspaces.boards(workspaceId),
    queryKeys.workspaces.byOrganization(organizationId),
  ],

  // Invalidate all board-related data
  board: (boardId: string, workspaceId: string, organizationId: string) => [
    queryKeys.boards.detail(boardId),
    queryKeys.boards.tasks(boardId),
    queryKeys.boards.realTime(boardId),
    queryKeys.boards.byWorkspace(workspaceId),
    queryKeys.boards.byOrganization(organizationId),
  ],

  // Invalidate user-specific data for an organization
  userOrganizationData: (userId: string, organizationId: string) => [
    queryKeys.dashboard.data(userId, organizationId),
    queryKeys.dashboard.boards(userId, organizationId),
    queryKeys.dashboard.workspaces(userId, organizationId),
    queryKeys.boards.sidebar(userId, organizationId),
    queryKeys.workspaces.sidebar(userId, organizationId),
  ],

  // Invalidate all data when switching organizations
  organizationSwitch: (userId: string, newOrganizationId: string) => [
    // Dashboard data
    { queryKey: ['dashboard'], exact: false },
    // Sidebar data
    { queryKey: ['boards', 'sidebar'], exact: false },
    { queryKey: ['workspaces', 'sidebar'], exact: false },
    // Organization-specific data
    { queryKey: ['boards', 'organization'], exact: false },
    { queryKey: ['workspaces', 'organization'], exact: false },
    // User-specific cross-organization data
    { queryKey: ['boards', 'user', userId], exact: false },
    { queryKey: ['workspaces', 'user', userId], exact: false },
    // Search results
    { queryKey: ['search'], exact: false },
  ],
} as const;

/**
 * Type helper for query keys
 */
export type QueryKeys = typeof queryKeys;
export type InvalidationPatterns = typeof invalidationPatterns;