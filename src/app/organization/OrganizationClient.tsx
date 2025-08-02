'use client';

import React from 'react';
import { useUserOrganizations } from '@/hooks/useUserOrganizations';

const OrganizationClient: React.FC = () => {
    const { organizations, loading, error } = useUserOrganizations();

    if (loading) {
        return <div>Loading organizations...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div>
            <h2 className="text-lg font-semibold mb-2">Your Organizations</h2>
            {organizations.length === 0 ? (
                <div>No organizations found.</div>
            ) : (
                <ul className="list-disc pl-5">
                    {organizations.map(org => (
                        <li key={org.id}>
                            {org.name} ({org.memberCount} members, {org.workspaceCount} workspaces)
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrganizationClient; 