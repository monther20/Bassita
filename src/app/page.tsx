"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserOrganizations } from '@/hooks/useUserOrganizations';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const { currentOrganization, loading: orgLoading } = useUserOrganizations();

    useEffect(() => {
        if (!authLoading && !user) {
            // User not authenticated, redirect to login
            router.replace('/login');
            return;
        }

        if (!orgLoading && currentOrganization) {
            // User authenticated and has organization, redirect to organization page
            router.replace(`/organization/${currentOrganization.id}`);
            return;
        }
    }, [user, currentOrganization, authLoading, orgLoading, router]);

    // Show loading while determining where to redirect
    return (
        <div className="min-h-screen bg-background-primary flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-spotlight-purple mx-auto mb-4"></div>
                <div className="text-text-secondary">Loading...</div>
            </div>
        </div>
    );
}