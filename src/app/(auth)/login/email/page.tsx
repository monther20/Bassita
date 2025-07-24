"use client";

import Button from "@/components/buttoon";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import InputField from "@/components/inputField";
import { useAuth } from "@/hooks";
import { useRouter } from "next/navigation";
import { GuestGuard } from "@/components";

export default function EmailLoginPage() {
  const router = useRouter();
  const { login, error, isLoading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await login(formData.email, formData.password);
      const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
      router.push(redirectTo);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <GuestGuard>
      <div className="flex flex-col gap-6 lg:gap-8 items-center py-6 lg:py-8 w-full px-6 lg:px-0 lg:w-[75%] max-w-xs lg:max-w-md">
        <div className="flex flex-col items-start gap-2 justify-center w-full">
          <span className="text-text-primary font-display text-2xl lg:text-4xl">
            Welcome Back!
          </span>
          <span className="text-gray-400 font-display text-xs lg:text-sm">
            Sign in to your account
          </span>
        </div>

        {error && (
          <div className="w-full p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Email Input */}
          <div className="w-full">
            <InputField
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full h-12 px-4 bg-background-primary border ${errors.email ? "border-red-500" : "border-gray-600"
                } text-text-primary placeholder-gray-400 focus:outline-none focus:border-spotlight-purple transition-colors`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="w-full relative">
            <InputField
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full h-12 px-4 pr-12 bg-background-primary border ${errors.password ? "border-red-500" : "border-gray-600"
                } text-text-primary placeholder-gray-400 focus:outline-none focus:border-spotlight-purple transition-colors`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between w-full">
            <Link
              href="/forgot-password"
              className="text-sm text-spotlight-purple hover:text-spotlight-pink transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <Button
            label={authLoading ? "Signing In..." : "Sign In"}
            onclick={handleSubmit}
            backgroundColor="bg-gradient-to-r from-spotlight-purple to-spotlight-pink"
            hover="hover:shadow-glow-purple"
            borderColor="border-background-primary"
            textStyle="text-text-primary text-sm lg:text-lg"
            className="w-full h-full"
            width="100%"
            height="50px"
            disabled={authLoading}
          />
        </form>

        {/* Sign Up Link */}
        <div className="text-center">
          <span className="text-gray-400 text-sm">Don't have an account? </span>
          <Link
            href="/signup/email"
            className="text-spotlight-purple hover:text-spotlight-pink transition-colors text-sm font-medium"
          >
            Sign up
          </Link>
        </div>

        {/* Back to Social Login */}
        <div className="text-center">
          <Link
            href="/login"
            className="text-gray-500 hover:text-gray-400 transition-colors text-sm"
          >
            ← Back to social login
          </Link>
        </div>
      </div>
    </GuestGuard>
  );
}
