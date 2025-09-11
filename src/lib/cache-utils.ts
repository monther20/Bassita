/**
 * Cache Management Utilities for Organization Switching
 * Provides helper functions for managing React Query cache when users switch organizations
 */

import { QueryClient } from '@tanstack/react-query';
import { queryKeys, invalidationPatterns } from './query-keys';

export interface CacheManagerOptions {
  queryClient: QueryClient;
  userId: string;
}

export class CacheManager {
  private queryClient: QueryClient;
  private userId: string;

  constructor({ queryClient, userId }: CacheManagerOptions) {
    this.queryClient = queryClient;
    this.userId = userId;
  }

  /**
   * Handles cache operations when switching organizations
   */
  async handleOrganizationSwitch(
    previousOrganizationId: string | null,
    newOrganizationId: string
  ): Promise<void> {
    // 1. Invalidate all organization-dependent queries
    await this.invalidateOrganizationQueries();

    // 2. Remove stale data for the previous organization
    if (previousOrganizationId) {
      await this.removeOrganizationData(previousOrganizationId);
    }

    // 3. Prefetch critical data for the new organization
    await this.prefetchOrganizationData(newOrganizationId);
  }

  /**
   * Invalidates all organization-dependent queries
   */
  private async invalidateOrganizationQueries(): Promise<void> {
    const patterns = [
      // Dashboard data
      { queryKey: ['dashboard'], exact: false },
      // Sidebar data
      { queryKey: ['boards', 'sidebar'], exact: false },
      { queryKey: ['workspaces', 'sidebar'], exact: false },
      // Organization-specific data
      { queryKey: ['boards', 'organization'], exact: false },
      { queryKey: ['workspaces', 'organization'], exact: false },
      // User-specific cross-organization data
      { queryKey: ['boards', 'user', this.userId], exact: false },
      { queryKey: ['workspaces', 'user', this.userId], exact: false },
      // Search results
      { queryKey: ['search'], exact: false },
    ];

    await Promise.all(
      patterns.map(pattern =>
        this.queryClient.invalidateQueries({
          queryKey: pattern.queryKey,
          exact: pattern.exact
        })
      )
    );
  }

  /**
   * Removes cached data for a specific organization
   */
  private async removeOrganizationData(organizationId: string): Promise<void> {
    const keysToRemove = [
      // Dashboard data for the organization
      queryKeys.dashboard.data(this.userId, organizationId),
      queryKeys.dashboard.boards(this.userId, organizationId),
      queryKeys.dashboard.workspaces(this.userId, organizationId),
      
      // Sidebar data for the organization
      queryKeys.boards.sidebar(this.userId, organizationId),
      queryKeys.workspaces.sidebar(this.userId, organizationId),
      
      // Organization-specific boards and workspaces
      queryKeys.boards.byOrganization(organizationId),
      queryKeys.workspaces.byOrganization(organizationId),
      
      // User data scoped to this organization
      queryKeys.boards.byUser(this.userId, organizationId),
      queryKeys.workspaces.byUser(this.userId, organizationId),
    ];

    keysToRemove.forEach(queryKey => {
      this.queryClient.removeQueries({ queryKey });
    });
  }

  /**
   * Prefetches critical data for the new organization
   */
  private async prefetchOrganizationData(organizationId: string): Promise<void> {
    // Note: Actual prefetching would need access to the FirestoreService
    // This is a placeholder for where you might want to warm the cache
    
    // Examples of what you might prefetch:
    // - Dashboard data
    // - Sidebar workspaces
    // - Recent boards
    
    console.log(`🔄 Prefetching data for organization: ${organizationId}`);
  }

  /**
   * Clears all cached data for a user (useful for logout)
   */
  clearAllUserData(): void {
    this.queryClient.clear();
  }

  /**
   * Selectively removes expired cache entries
   */
  cleanupStaleCache(): void {
    // Remove queries that are older than 1 hour
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    this.queryClient.getQueryCache().getAll().forEach(query => {
      if (query.state.dataUpdatedAt < oneHourAgo) {
        this.queryClient.removeQueries({ queryKey: query.queryKey });
      }
    });
  }

  /**
   * Gets cache statistics for debugging
   */
  getCacheStats(): {
    totalQueries: number;
    activeQueries: number;
    staleQueries: number;
    errorQueries: number;
  } {
    const allQueries = this.queryClient.getQueryCache().getAll();
    
    return {
      totalQueries: allQueries.length,
      activeQueries: allQueries.filter(q => q.state.status === 'success').length,
      staleQueries: allQueries.filter(q => q.isStale()).length,
      errorQueries: allQueries.filter(q => q.state.status === 'error').length,
    };
  }

  /**
   * Optimistic cache update for organization switching
   */
  updateOrganizationCache(organizationId: string, organizationData: any): void {
    // Update the current organization in the organizations list
    const organizationsQueryKey = queryKeys.organizations.byUser(this.userId);
    
    this.queryClient.setQueryData(organizationsQueryKey, (old: any) => {
      if (!old) return old;
      
      return old.map((org: any) => 
        org.id === organizationId 
          ? { ...org, ...organizationData }
          : org
      );
    });
  }
}

/**
 * Factory function to create a cache manager instance
 */
export function createCacheManager(queryClient: QueryClient, userId: string): CacheManager {
  return new CacheManager({ queryClient, userId });
}

/**
 * Hook to get a cache manager instance
 */
export function useCacheManager(queryClient: QueryClient, userId: string | undefined): CacheManager | null {
  if (!userId) return null;
  return new CacheManager({ queryClient, userId });
}

/**
 * Utility functions for common cache operations
 */
export const cacheUtils = {
  /**
   * Creates a cache key with fallbacks
   */
  createSafeQueryKey: (keyFactory: (...args: any[]) => readonly string[], ...args: any[]) => {
    try {
      return keyFactory(...args);
    } catch (error) {
      console.warn('Error creating query key:', error);
      return ['fallback'] as const;
    }
  },

  /**
   * Validates if a query key matches the expected pattern
   */
  isValidQueryKey: (queryKey: readonly string[]): boolean => {
    return Array.isArray(queryKey) && queryKey.length > 0 && queryKey.every(key => typeof key === 'string');
  },

  /**
   * Logs cache operations for debugging
   */
  logCacheOperation: (operation: string, queryKey: readonly string[], details?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🗄️ Cache ${operation}:`, queryKey, details);
    }
  },
};