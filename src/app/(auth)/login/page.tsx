"use client";

import { Button } from "@/components/buttoon";
import { FaDiscord, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  return (
    <div className="bg-background-tertiary rounded-2xl w-full h-full flex flex-col gap-4 lg:gap-6 items-center">
      <div className="flex flex-col gap-6 lg:gap-10 items-center pt-6 lg:pt-10 w-full px-4 lg:px-0 lg:w-[75%] max-w-md">
        <div className="flex flex-col items-start gap-2 justify-center w-full">
          <span className="text-text-primary font-display text-2xl lg:text-4xl">
            Welcome Back!
          </span>
          <span className="text-gray-400 font-display text-xs lg:text-sm">
            Sign in to continue your journey
          </span>
        </div>
        <div className="flex flex-col gap-3 lg:gap-4 w-full">
          <Button
            label="Continue with Google"
            onclick={() => {
              console.log("Login");
            }}
            backgroundColor="bg-white"
            borderColor="border-white"
            hover="hover:shadow-glow-white"
            textColor="text-text-dark"
            textSize="text-sm lg:text-lg"
            icon={<FcGoogle size={20} className="lg:w-[25px] lg:h-[25px]" />}
            className="w-full h-full"
            width="100%"
            height="50px"
          />

          <Button
            label="Continue with Discord"
            onclick={() => {
              console.log("Login");
            }}
            backgroundColor="bg-spotlight-blue"
            hover="hover:shadow-glow-blue"
            borderColor="border-background-primary"
            textColor="text-text-primary"
            textSize="text-sm lg:text-lg"
            icon={<FaDiscord size={20} className="lg:w-[25px] lg:h-[25px]" />}
            className="w-full h-full"
            width="100%"
            height="50px"
          />

          <Button
            label="Continue with Github"
            onclick={() => {
              console.log("Login");
            }}
            backgroundColor="bg-background-primary"
            borderColor="border-background-primary"
            textColor="text-text-primary"
            hover="hover:shadow-glow-black"
            textSize="text-sm lg:text-lg"
            icon={<FaGithub size={20} className="lg:w-[25px] lg:h-[25px]" />}
            className="w-full h-full"
            width="100%"
            height="50px"
          />
        </div>
        <div className="flex flex-col gap-3 lg:gap-4 w-full">
          <div className="flex items-center justify-center relative">
            <div className="w-full h-[0.5px] border-t border-gray-500"></div>
            <div className="absolute bg-background-tertiary px-2 text-gray-500 font-display text-sm">
              Or
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:gap-4 w-full">
          <Button
            label="Continue with Email"
            onclick={() => {
              console.log("Login");
            }}
            backgroundColor="bg-gradient-to-r from-spotlight-purple to-spotlight-pink"
            hover="hover:shadow-glow-purple"
            borderColor="border-background-primary"
            textColor="text-text-primary"
            textSize="text-sm lg:text-lg"
            className="w-full h-full"
            width="100%"
            height="50px"
          />
        </div>
      </div>
    </div>
  );
}
