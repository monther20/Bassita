"use client";

import ProtectedLayout from '@/components/layouts/ProtectedLayout';
import { useAuth } from '@/hooks';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-display text-text-primary">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-400 mt-2">
            Here&apos;s what&apos;s happening with your projects today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-background-primary border border-gray-600 rounded-lg p-6">
            <h3 className="text-lg font-display text-text-primary mb-2">
              Total Tasks
            </h3>
            <p className="text-3xl font-bold text-spotlight-purple">42</p>
          </div>

          <div className="bg-background-primary border border-gray-600 rounded-lg p-6">
            <h3 className="text-lg font-display text-text-primary mb-2">
              Completed
            </h3>
            <p className="text-3xl font-bold text-green-500">28</p>
          </div>

          <div className="bg-background-primary border border-gray-600 rounded-lg p-6">
            <h3 className="text-lg font-display text-text-primary mb-2">
              In Progress
            </h3>
            <p className="text-3xl font-bold text-yellow-500">14</p>
          </div>
        </div>

        <div className="bg-background-primary border border-gray-600 rounded-lg p-6">
          <h3 className="text-lg font-display text-text-primary mb-4">
            Recent Activity
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-text-primary">Task &quot;Setup Authentication&quot; completed</span>
              <span className="text-gray-400 text-sm">2 minutes ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-primary">New project &quot;E-commerce App&quot; created</span>
              <span className="text-gray-400 text-sm">1 hour ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-primary">Team member invited to &quot;Mobile App&quot;</span>
              <span className="text-gray-400 text-sm">3 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}