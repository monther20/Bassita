"use client";

import { Button } from "@/components/buttoon";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import InputField from "@/components/inputField";

export default function EmailLoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);
    // TODO: Implement actual login logic
    setTimeout(() => {
      console.log("Login attempt:", formData);
      setIsLoading(false);
    }, 1000);
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
    <>
      <div className="flex flex-col gap-6 lg:gap-8 items-center py-6 lg:py-8 w-full px-6 lg:px-0 lg:w-[75%] max-w-xs lg:max-w-md">
        <div className="flex flex-col items-start gap-2 justify-center w-full">
          <span className="text-text-primary font-display text-2xl lg:text-4xl">
            Welcome Back!
          </span>
          <span className="text-gray-400 font-display text-xs lg:text-sm">
            Sign in to your account
          </span>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Email Input */}
          <div className="w-full">
            <InputField
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full h-12 px-4 bg-background-primary border ${
                errors.email ? "border-red-500" : "border-gray-600"
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
              className={`w-full h-12 px-4 pr-12 bg-background-primary border ${
                errors.password ? "border-red-500" : "border-gray-600"
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
            label={isLoading ? "Signing In..." : "Sign In"}
            onclick={() => handleSubmit(e)}
            backgroundColor="bg-gradient-to-r from-spotlight-purple to-spotlight-pink"
            hover="hover:shadow-glow-purple"
            borderColor="border-background-primary"
            textColor="text-text-primary"
            textSize="text-sm lg:text-lg"
            className="w-full h-full"
            width="100%"
            height="50px"
            disabled={isLoading}
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
    </>
  );
}
