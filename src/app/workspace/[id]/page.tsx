"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProtectedLayout from "@/components/layouts/ProtectedLayout";
import Card from "@/components/card";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import CardSkeleton from "@/components/skeletons/CardSkeleton";
import { createBoardSlug } from '@/lib/utils';

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = decodeURIComponent(params.id as string);
  const [isLoading, setIsLoading] = useState(true);
  const [workspace, setWorkspace] = useState<any>(null);

  useEffect(() => {
    // Simulate API call to fetch workspace data
    const loadWorkspace = setTimeout(() => {
      const workspaceData: { [key: string]: any } = {
        "Creative Agency": {
          title: "Creative Agency",
          info: {
            members: 6,
            boards: 6,
            owner: "Owner",
          },
          cards: [
            {
              title: "Board 1",
              lastUpdated: "2h ago",
              members: [{ name: "JD" }, { name: "SM" }],
            },
            {
              title: "Board 2",
              lastUpdated: "1h ago",
              members: [{ name: "JD" }, { name: "SM" }],
            },
            {
              title: "Board 3",
              lastUpdated: "1h ago",
              members: [{ name: "JD" }, { name: "SM" }],
            },
            {
              title: "Board 4",
              lastUpdated: "1h ago",
              members: [{ name: "JD" }, { name: "SM" }],
            },
            {
              title: "Board 5",
              lastUpdated: "1h ago",
              members: [{ name: "JD" }, { name: "SM" }],
            },
            {
              title: "Board 6",
              lastUpdated: "1h ago",
              members: [{ name: "JD" }, { name: "SM" }],
            },
          ],
        },
        "Marketing Campaign": {
          title: "Marketing Campaign",
          info: {
            members: 6,
            boards: 6,
            owner: "Owner",
          },
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
          ],
        },
      };

      setWorkspace(workspaceData[workspaceId]);
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(loadWorkspace);
  }, [workspaceId]);

  const spotlightColors = [
    "border-spotlight-purple",
    "border-spotlight-pink",
    "border-spotlight-blue",
    "border-spotlight-green",
  ];

  const getRandomColor = () => {
    return spotlightColors[Math.floor(Math.random() * spotlightColors.length)];
  };

  const handleCardClick = (cardTitle: string) => {
    const boardSlug = createBoardSlug(cardTitle);
    router.push(`/board/${boardSlug}`);
  };

  if (isLoading) {
    return (
      <ProtectedLayout>
        <div className="space-y-6 responsive-px-sm max-w-screen-2xl mx-auto">
          {/* Header skeleton */}
          <div className="flex items-center gap-4">
            <div className="p-2 hover:bg-background-secondary rounded-lg transition-colors">
              <FiArrowLeft className="w-5 h-5 text-text-primary" />
            </div>
            <div className="space-y-1">
              <div className="h-8 bg-background-secondary rounded w-60 animate-shimmer"></div>
              <div className="flex items-center gap-2">
                <div className="h-4 bg-background-secondary rounded w-20 animate-shimmer"></div>
                <div className="w-1 h-1 bg-text-secondary rounded-full"></div>
                <div className="h-4 bg-background-secondary rounded w-16 animate-shimmer"></div>
                <div className="w-1 h-1 bg-text-secondary rounded-full"></div>
                <div className="h-4 bg-background-secondary rounded w-12 animate-shimmer"></div>
              </div>
            </div>
          </div>

          {/* Workspace title skeleton */}
          <div className="h-6 bg-background-secondary rounded w-48 animate-shimmer"></div>

          {/* Boards grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <CardSkeleton
                key={index}
                className={`${Math.random() > 0.5
                  ? "rotate-slight"
                  : "rotate-slight-reverse"
                  } border-2 border-background-secondary`}
              />
            ))}
          </div>
        </div>
      </ProtectedLayout>
    );
  }

  if (!workspace) {
    return (
      <ProtectedLayout>
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
          <h1 className="text-2xl font-display text-text-primary">Workspace Not Found</h1>
          <p className="text-text-secondary">The workspace you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-spotlight-purple text-text-primary rounded-lg hover:bg-spotlight-pink transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="space-y-6 responsive-px-sm max-w-screen-2xl mx-auto animate-fade-in p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 hover:bg-background-secondary rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 text-text-primary" />
          </button>
          <div className="space-y-1">
            <div className="text-text-primary text-2xl font-display font-semibold">
              {workspace.title}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-text-secondary text-sm font-display">
                {workspace.info.members} members
              </span>
              <span className="text-text-secondary text-sm">•</span>
              <span className="text-text-secondary text-sm font-display">
                {workspace.info.boards} boards
              </span>
              <span className="text-text-secondary text-sm">•</span>
              <span className="text-text-secondary text-sm font-display">
                {workspace.info.owner}
              </span>
            </div>
          </div>
        </div>

        {/* Workspace Title with neon effect */}
        <div className="flex flex-col gap-0">
          <span className="text-spotlight-purple neon-text text-lg font-display">
            {workspace.title}
          </span>
        </div>

        {/* All Boards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {workspace.cards.map((card: any, index: number) => (
            <Card
              key={index}
              title={card.title}
              description={card?.description}
              lastUpdated={card?.lastUpdated}
              members={card.members.map((member: any) => member.name)}
              width="w-full"
              height="h-30"
              membersSize="w-8 h-8"
              onClick={() => handleCardClick(card.title)}
              className={`bg-background-secondary ${Math.random() > 0.5
                ? "rotate-slight hover:rotate-1"
                : "rotate-slight-reverse hover:-rotate-1"
                } cursor-pointer transition-transform duration-200 border-2 ${getRandomColor()} hover:bg-background-secondary/50`}
            />
          ))}
        </div>
      </div>
    </ProtectedLayout>
  );
}