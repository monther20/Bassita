"use client";

import { useRouter } from 'next/navigation';
import { FiUsers, FiPlus, FiFolder, FiActivity } from 'react-icons/fi';
import { useUserOrganizations } from '@/hooks/useUserOrganizations';
import { useModal } from '@/contexts/ModalContext';
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import Card from '@/components/card';
import DashboardSectionSkeleton from '@/components/skeletons/DashboardSectionSkeleton';
import Button from '@/components/buttoon';

export default function Organization() {
    const router = useRouter();
    const { organizations, loading, error } = useUserOrganizations();
    const { openCreateOrganizationModal } = useModal();

    const handleOrganizationClick = (organizationId: string) => {
        router.push(`/organization/${organizationId}`);
    };

    if (loading) {
        return (
            <ProtectedLayout>
                <div className="space-y-6 responsive-px-sm max-w-screen-2xl mx-auto p-6">
                    <div className="space-y-4">
                        <div className="animate-pulse">
                            <div className="h-10 bg-background-tertiary rounded w-64 mb-2"></div>
                            <div className="h-5 bg-background-tertiary rounded w-96"></div>
                        </div>
                        <div className="flex justify-end">
                            <div className="h-10 bg-background-tertiary rounded w-40"></div>
                        </div>
                    </div>
                    <DashboardSectionSkeleton hasLabel={false} hasInfo={false} cardCount={6} />
                </div>
            </ProtectedLayout>
        );
    }

    if (error) {
        return (
            <ProtectedLayout>
                <div className="flex items-center justify-center h-full p-6">
                    <div className="text-center">
                        <div className="text-text-primary text-lg font-medium mb-2">
                            Failed to load organizations
                        </div>
                        <div className="text-text-secondary mb-4">
                            {error}
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-spotlight-purple hover:bg-spotlight-purple/80 text-text-primary px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </ProtectedLayout>
        );
    }

    return (
        <ProtectedLayout>
            <div className="space-y-6 responsive-px-sm max-w-screen-2xl mx-auto p-6">
                {/* Header */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-text-primary text-3xl font-display font-bold">
                                Organizations
                            </h1>
                            <p className="text-text-secondary text-base font-body mt-1">
                                Manage and access your organizations
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={() => openCreateOrganizationModal()}
                                label="New Organization"
                                icon={<FiPlus size={18} />}
                                className="rounded-lg"
                                backgroundColor="bg-spotlight-purple"
                                textColor="text-text-primary"
                                iconPosition="left"
                                size="md"
                                height="h-10"
                            />
                        </div>
                    </div>
                </div>

                {/* Organizations Grid */}
                {organizations.length > 0 ? (
                    <div className="space-y-4">
                        <h2 className="text-text-primary text-xl font-display font-semibold">
                            Your Organizations ({organizations.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
                            {organizations.map((org, index) => {
                                const spotlightColors = [
                                    "border-spotlight-purple",
                                    "border-spotlight-pink",
                                    "border-spotlight-blue",
                                    "border-spotlight-green",
                                    "border-spotlight-yellow",
                                    "border-spotlight-red"
                                ];
                                const randomColor = spotlightColors[index % spotlightColors.length];
                                const rotationClass = Math.random() > 0.5 ? 'rotate-slight hover:rotate-1' : 'rotate-slight-reverse hover:-rotate-1';

                                return (
                                    <div
                                        key={org.id}
                                        className={`bg-background-secondary rounded-lg p-4 border-2 ${randomColor} ${rotationClass} cursor-pointer transition-all duration-200 hover:scale-105 group`}
                                        onClick={() => handleOrganizationClick(org.id)}
                                    >
                                        <div className="space-y-4">
                                            {/* Organization Header */}
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-spotlight-purple/20 rounded-lg flex items-center justify-center group-hover:bg-spotlight-purple/30 transition-colors">
                                                        <FiUsers className="text-spotlight-purple text-xl" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-text-primary font-display font-semibold text-base truncate max-w-[140px]">
                                                            {org.name}
                                                        </h3>
                                                        <p className="text-text-secondary text-sm">
                                                            {org.isOwner ? 'Owner' : 'Member'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Organization Stats */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <FiFolder className="text-spotlight-blue text-sm" />
                                                        <span className="text-text-primary font-display font-bold text-base">
                                                            {org.workspaceCount}
                                                        </span>
                                                    </div>
                                                    <p className="text-text-secondary text-xs">
                                                        Workspaces
                                                    </p>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <FiUsers className="text-spotlight-green text-sm" />
                                                        <span className="text-text-primary font-display font-bold text-base">
                                                            {org.memberCount}
                                                        </span>
                                                    </div>
                                                    <p className="text-text-secondary text-xs">
                                                        Members
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Action Indicator */}
                                            <div className="flex items-center justify-between pt-2 border-t border-background-tertiary">
                                                <span className="text-text-tertiary text-xs">
                                                    Click to view
                                                </span>
                                                <div className="w-2 h-2 bg-spotlight-purple rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    /* Empty State */
                    <div className="text-center py-16">
                        <div className="bg-background-secondary rounded-lg p-12 max-w-lg mx-auto">
                            <div className="w-20 h-20 bg-spotlight-purple/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FiUsers className="text-spotlight-purple text-3xl" />
                            </div>
                            <h3 className="text-text-primary text-xl font-display font-semibold mb-3">
                                No organizations yet
                            </h3>
                            <p className="text-text-secondary text-base mb-6 leading-relaxed">
                                Organizations help you manage teams, workspaces, and projects all in one place. Create your first organization to get started.
                            </p>
                            <button
                                onClick={() => openCreateOrganizationModal()}
                                className="flex items-center gap-2 bg-spotlight-purple hover:bg-spotlight-purple/80 text-text-primary px-6 py-3 rounded-lg font-medium transition-all duration-200 mx-auto hover:shadow-glow-purple"
                            >
                                <FiPlus size={18} />
                                Create Your First Organization
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedLayout>
    );
}