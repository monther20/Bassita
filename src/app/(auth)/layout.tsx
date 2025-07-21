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
    <div className="relative flex items-center min-h-screen bg-background-primary">
      <div className="flex flex-col lg:flex-row justify-between w-full px-4 md:px-8 lg:px-22 py-4 lg:py-0 items-center z-1">
        <div className="hidden lg:flex flex-col gap-6 lg:gap-10 items-center z-1">
          <div className="flex flex-col gap-6 lg:gap-10 w-full">
            <div
              className={`w-3/4 h-26 bg-gradient-to-br from-spotlight-purple to-spotlight-pink rounded-lg p-0.5 rotate-slight-reverse card-right`}
            >
              <Card
                width=""
                height=""
                title="✨ Welcome Task"
                description="Get ready to dance!"
                members={["✔"]}
              />
            </div>
            <div
              className={`w-3/4 h-26 bg-gradient-to-br from-spotlight-purple to-spotlight-pink rounded-lg p-0.5 rotate-slight card-left`}
            >
              <Card
                width="200"
                height="120"
                title="🎯 Login Flow"
                description="Simple and secure"
                members={["🔥"]}
              />
            </div>
            <div
              className={`w-3/4 h-26 bg-gradient-to-br from-spotlight-purple to-spotlight-pink rounded-lg p-0.5 rotate-slight-reverse card-right`}
            >
              <Card
                width="200"
                height="120"
                title="🚀 Get Started"
                description="Create your profile and explore"
                members={["→"]}
              />
            </div>
          </div>
          <div className="flex flex-col gap-6 lg:gap-10">
            <Image
              src="/logo.png"
              alt="logo"
              width={280}
              height={68}
              className="lg:w-[350px] lg:h-[85px]"
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
