'use client';

import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FirestoreOrganization } from '@/types/firestore';
import { FirestoreService } from '@/lib/firestore';
import { useAuth } from './useAuth';
import { queryKeys, invalidationPatterns } from '@/lib/query-keys';

interface UserOrganization {
    id: string;
    name: string;
    memberCount: number;
    workspaceCount: number;
    isOwner: boolean;
}

interface UseUserOrganizationsReturn {
    organizations: UserOrganization[];
    currentOrganization: UserOrganization | null;
    loading: boolean;
    error: string | null;
    switchOrganization: (organizationId: string) => void;
    refetch: () => void;
}

export function useUserOrganizations(): UseUserOrganizationsReturn {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [currentOrganizationId, setCurrentOrganizationId] = useState<string | null>(null);

    const { data: organizations = [], isLoading, error, refetch } = useQuery({
        queryKey: queryKeys.organizations.byUser(user?.id || ''),
        queryFn: async () => {
            if (!user?.id) {
                return [];
            }

            // Fetch organizations from Firestore
            const orgs = await FirestoreService.getUserOrganizations(user.id);
            // Map FirestoreOrganization to UserOrganization
            return orgs.map(org => ({
                id: org.id,
                name: org.name,
                memberCount: org.memberUserIds.length,
                workspaceCount: org.workspaces.length,
                isOwner: org.ownerId === user.id
            }));
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    // Set initial organization when organizations load
    useEffect(() => {
        if (organizations.length > 0 && !currentOrganizationId) {
            // Try to get from localStorage first
            const savedOrganizationId = localStorage.getItem('current-organization-id');
            const validOrganization = organizations.find(org => org.id === savedOrganizationId);

            if (validOrganization) {
                setCurrentOrganizationId(savedOrganizationId);
            } else {
                // Default to first organization
                const defaultOrgId = organizations[0].id;
                setCurrentOrganizationId(defaultOrgId);
                localStorage.setItem('current-organization-id', defaultOrgId);
            }
        }
    }, [organizations, currentOrganizationId]);

    const currentOrganization = organizations.find(org => org.id === currentOrganizationId) || null;

    const switchOrganization = (organizationId: string) => {
        const previousOrganizationId = currentOrganizationId;
        setCurrentOrganizationId(organizationId);
        localStorage.setItem('current-organization-id', organizationId);

        // If switching to an organization that's not in our current list,
        // trigger a refetch to get the latest data
        const organizationExists = organizations.some(org => org.id === organizationId);
        if (!organizationExists) {
            refetch();
        }

        // Invalidate organization-dependent caches when switching
        if (user?.id && previousOrganizationId !== organizationId) {
            // Invalidate all organization-dependent queries
            invalidationPatterns.organizationSwitch(user.id, organizationId).forEach(pattern => {
                if ('exact' in pattern && !pattern.exact) {
                    // Invalidate queries that start with the pattern
                    queryClient.invalidateQueries({ 
                        queryKey: pattern.queryKey,
                        exact: false 
                    });
                } else {
                    // Invalidate exact query key matches
                    queryClient.invalidateQueries({ 
                        queryKey: Array.isArray(pattern) ? pattern : pattern.queryKey 
                    });
                }
            });

            // Remove stale data for the previous organization
            if (previousOrganizationId) {
                invalidationPatterns.userOrganizationData(user.id, previousOrganizationId).forEach(queryKey => {
                    queryClient.removeQueries({ queryKey });
                });
            }
        }
    };

    return {
        organizations,
        currentOrganization,
        loading: isLoading,
        error: error instanceof Error ? error.message : null,
        switchOrganization,
        refetch
    };
}

// Hook to get just the current organization ID
export function useCurrentOrganization(): string | null {
    const { currentOrganization } = useUserOrganizations();
    return currentOrganization?.id || null;
}