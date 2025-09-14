"use client";

import React from "react";
import AnimatedBackground from "@/components/auth/AnimatedBackground";
import Card from "@/components/card";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";
import { themeMetadata } from "@/stores/theme";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const isLightTheme = themeMetadata[theme].category === 'light';
  const logoSrc = isLightTheme ? '/logo-light.png' : '/logo.png';

  return (
    <div className="relative flex items-center min-h-screen bg-background-primary">
      {/* Theme Toggle - Top Right Corner */}
      <div className="absolute top-4 right-4 lg:top-6 lg:right-6 z-50">
        <ThemeToggle size="sm" variant="selector" />
      </div>

      <div className="flex flex-col lg:flex-row justify-between w-full px-4 md:px-8 lg:px-22 py-4 lg:py-0 items-center z-1">
        <div className="hidden lg:flex flex-col gap-6 lg:gap-10 items-center z-1">
          <div className="flex flex-col gap-6 lg:gap-10 w-full">
            <div
              className={`w-3/4 h-26 bg-gradient-to-br from-spotlight-purple to-spotlight-pink rounded-lg p-0.5 rotate-slight-reverse card-right`}
            >
              <div className="relative flex flex-col text-left w-full h-full rounded-lg pl-2.5 pt-1 bg-background-tertiary font-display overflow-hidden">
                <div className="flex flex-col gap-1 relative z-10">
                  <h1 className="text-sm text-text-primary">📋 Project Planning</h1>
                  <p className="text-xs text-text-tertiary">Organize your tasks efficiently</p>
                </div>
                <div className="absolute bottom-2 right-2 flex flex-row gap-1 z-10">
                  <div className="w-6 h-6 rounded-full text-[10px] bg-spotlight-green text-text-primary flex items-center justify-center">
                    ✓
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`w-3/4 h-26 bg-gradient-to-br from-spotlight-purple to-spotlight-pink rounded-lg p-0.5 rotate-slight card-left`}
            >
              <div className="relative flex flex-col text-left w-full h-full rounded-lg pl-2.5 pt-1 bg-background-tertiary font-display overflow-hidden">
                <div className="flex flex-col gap-1 relative z-10">
                  <h1 className="text-sm text-text-primary">👥 Team Collaboration</h1>
                  <p className="text-xs text-text-tertiary">Work together seamlessly</p>
                </div>
                <div className="absolute bottom-2 right-2 flex flex-row gap-1 z-10">
                  <div className="w-6 h-6 rounded-full text-[10px] bg-spotlight-red text-text-primary flex items-center justify-center">
                    🤝
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`w-3/4 h-26 bg-gradient-to-br from-spotlight-purple to-spotlight-pink rounded-lg p-0.5 rotate-slight-reverse card-right`}
            >
              <div className="relative flex flex-col text-left w-full h-full rounded-lg pl-2.5 pt-1 bg-background-tertiary font-display overflow-hidden">
                <div className="flex flex-col gap-1 relative z-10">
                  <h1 className="text-sm text-text-primary">🎯 Track Progress</h1>
                  <p className="text-xs text-text-tertiary">Monitor deadlines and milestones</p>
                </div>
                <div className="absolute bottom-2 right-2 flex flex-row gap-1 z-10">
                  <div className="w-6 h-6 rounded-full text-[10px] bg-spotlight-blue text-text-primary flex items-center justify-center">
                    📊
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6 lg:gap-10">
            <Image
              src={logoSrc}
              alt="Bassita Logo"
              width={280}
              height={68}
              className="lg:w-[350px] lg:h-[85px]"
              priority
            />
          </div>
        </div>

        <div className="relative flex items-center justify-center w-full lg:w-auto">
          <div className="relative z-10 bg-gradient-to-br from-spotlight-purple to-spotlight-pink rounded-2xl p-0.5 w-full max-w-md lg:w-[480px] lg:h-[650px] min-h-[500px] overflow-y-auto">
            <div className="bg-background-tertiary rounded-2xl w-full h-full flex flex-col justify-center items-center overflow-y-auto">
              {children}
            </div>
          </div>
          <div
            className="absolute w-[400px] h-[600px] lg:w-[600px] lg:h-[800px] bg-gradient-to-br from-spotlight-purple to-spotlight-pink shadow-glow-purple opacity-10 z-1"
            style={{
              borderRadius: "50% 50% 50% 50% / 55% 55% 45% 45%",
            }}
          />
        </div>
      </div>

      <AnimatedBackground />
    </div>
  );
}
