import React from "react";
import AnimatedBackground from "@/components/auth/AnimatedBackground";
import Card from "@/components/card";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex items-center h-screen pr-22 bg-background-primary">
      <div className="flex flex-row justify-between w-full px-22 items-center z-1">
        <div className="flex flex-col gap-10 items-center z-1">
          <div className="flex flex-col gap-10">
            <Card
              width="200"
              height="120"
              title="✨ Welcome Task"
              description="Get ready to dance!"
              className="rotate-slight-reverse card-right"
              members={["✔"]}
            />
            <Card
              width="200"
              height="120"
              title="<🎯 Login Flow"
              description="Simple and secure"
              className="rotate-slight card-left"
              members={["🔥"]}
            />
            <Card
              width="200"
              height="120"
              title="🚀 Get Started"
              description="Create your profile and explore"
              className="rotate-slight-reverse card-right"
              members={["→"]}
            />
          </div>
          <div className="flex flex-col gap-10">
            <Image src="/logo.png" alt="logo" width={350} height={85} />
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="relative z-10 bg-gradient-to-br from-spotlight-purple to-spotlight-pink rounded-2xl p-0.5 w-[480px] h-[600px]">
            {children}
          </div>
          <div
            className="absolute w-[600px] h-[800px] bg-gradient-to-br from-spotlight-purple to-spotlight-pink shadow-glow-purple opacity-10 z-1"
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
