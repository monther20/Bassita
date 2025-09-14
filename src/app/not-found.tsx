"use client";

import Button from "@/components/buttoon";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";

export default function NotFound() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleGoHome = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* 404 Animation/Icon */}
        <div className="relative">
          <div className="text-8xl lg:text-9xl font-display font-bold text-spotlight-purple opacity-20">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 lg:w-20 lg:h-20 border-4 border-spotlight-purple rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-3xl lg:text-4xl font-display text-text-primary">
            Page Not Found
          </h1>
          <p className="text-gray-400 font-body text-lg">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button
            label="Go Home"
            onClick={handleGoHome}
            backgroundColor="bg-gradient-to-r from-spotlight-purple to-spotlight-pink"
            hover="hover:shadow-glow-purple"
            textColor="text-text-primary"
            fullWidth={true}
            height="h-[50px]"
          />

          <Button
            label="Go Back"
            onClick={() => router.back()}
            backgroundColor="bg-background-secondary"
            hover="hover:shadow-glow-white"
            textColor="text-text-primary"
            fullWidth={true}
            height="h-[50px]"
          />
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t border-gray-600">
          <p className="text-gray-500 text-sm mb-4">
            Need help? Try these links:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <button
              onClick={() => router.push("/login")}
              className="text-spotlight-purple hover:text-spotlight-pink transition-colors"
            >
              Login
            </button>
            <span className="text-gray-600">•</span>
            <button
              onClick={() => router.push("/signup/email")}
              className="text-spotlight-purple hover:text-spotlight-pink transition-colors"
            >
              Sign Up
            </button>
            {isAuthenticated && (
              <>
                <span className="text-gray-600">•</span>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="text-spotlight-purple hover:text-spotlight-pink transition-colors"
                >
                  Dashboard
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}