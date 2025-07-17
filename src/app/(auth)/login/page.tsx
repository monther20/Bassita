"use client";

import { Button } from "@/components/buttoon";
import { FaDiscord, FaEnvelope, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  return (
    <div className="bg-background-tertiary rounded-2xl w-full h-full flex flex-col gap-6 items-center">
      <div className="flex flex-col gap-10 items-center pt-10 w-[75%]">
        <div className="flex flex-col items-start gap-2 justify-center w-full">
          <span className="text-text-primary font-display text-4xl">
            Welcome Back!
          </span>
          <span className="text-gray-400 font-display text-sm">
            Sign in to continue your journey
          </span>
        </div>
        <div className="flex flex-col gap-4">
          <Button
            label="Continue with Google"
            onclick={() => {
              console.log("Login");
            }}
            backgroundColor="bg-white"
            borderColor="border-white"
            hover="hover:shadow-glow-white"
            textColor="text-text-dark"
            textSize="text-lg"
            icon={<FcGoogle size={25} />}
            className="w-full h-full"
            width="360px"
            height="60px"
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
            textSize="text-lg"
            icon={<FaDiscord size={25} />}
            className="w-full h-full"
            width="360px"
            height="60px"
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
            textSize="text-lg"
            icon={<FaGithub size={25} />}
            className="w-full h-full"
            width="360px"
            height="60px"
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center relative bg-red-400">
            <div className="w-96 h-[0.5px] border-t border-gray-500"></div>
            <div className="absolute bg-background-tertiary px-2 text-gray-500 font-display ">
              Or
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Button
            label="Continue with Email"
            onclick={() => {
              console.log("Login");
            }}
            backgroundColor="bg-gradient-to-r from-spotlight-purple to-spotlight-pink"
            hover="hover:shadow-glow-purple"
            borderColor="border-background-primary"
            textColor="text-text-primary"
            textSize="text-lg"
            className="w-full h-full"
            width="360px"
            height="60px"
          />
        </div>
      </div>
    </div>
  );
}
