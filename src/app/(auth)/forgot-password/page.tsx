"use client";

import { Button } from "@/components/buttoon";
import { useState } from "react";
import { FaArrowLeft, FaCheck } from "react-icons/fa";
import Link from "next/link";
import InputField from "@/components/inputField";

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState({
    email: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    // TODO: Implement actual forgot password logic
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTryAgain = () => {
    setIsSuccess(false);
    setFormData({ email: "" });
    setErrors({});
  };

  if (isSuccess) {
    return (
      <div className="bg-background-tertiary rounded-2xl w-full h-full flex flex-col justify-center items-center overflow-hidden">
        <div className="flex flex-col gap-6 lg:gap-8 items-center py-6 lg:py-8 w-full px-6 lg:px-0 lg:w-[75%] max-w-xs lg:max-w-md text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <FaCheck className="text-white text-2xl" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-text-primary font-display text-2xl lg:text-3xl">
                Check your email
              </span>
              <span className="text-gray-400 font-display text-xs lg:text-sm">
                We've sent a password reset link to
              </span>
              <span className="text-spotlight-purple font-display text-sm lg:text-base">
                {formData.email}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full">
            <p className="text-gray-400 text-sm text-center">
              Didn't receive the email? Check your spam folder or try again.
            </p>

            <Button
              label="Try again" 
              onclick={handleTryAgain}
              backgroundColor="bg-background-primary"
              borderColor="border-gray-600"
              textStyle="text-text-primary text-sm lg:text-lg"
              hover="hover:shadow-glow-black"
              className="w-full h-full"
              width="100%"
              height="48px"
            />
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="text-gray-500 hover:text-gray-400 transition-colors text-sm"
            >
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 lg:gap-8 items-center py-6 lg:py-8 w-full px-6 lg:px-0 lg:w-[75%] max-w-xs lg:max-w-md">
        <div className="flex flex-col items-start gap-2 justify-center w-full">
          <span className="text-text-primary font-display text-2xl lg:text-4xl">
            Forgot Password?
          </span>
          <span className="text-gray-400 font-display text-xs lg:text-sm">
            Enter your email address and we'll send you a link to reset your
            password.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Email Input */}
          <div className="w-full">
            <InputField
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full h-12 px-4 rounded-lg bg-background-primary border ${
                errors.email ? "border-red-500" : "border-gray-600"
              } text-text-primary placeholder-gray-400 focus:outline-none focus:border-spotlight-purple transition-colors`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Reset Password Button */}
          <Button
            label={isLoading ? "Sending..." : "Send Reset Link"}
            onclick={() => handleSubmit(e)}
            backgroundColor="bg-gradient-to-r from-spotlight-purple to-spotlight-pink"
            hover="hover:shadow-glow-purple"
            borderColor="border-background-primary"
            textStyle="text-text-primary text-sm lg:text-lg"
            className="w-full h-full"
            width="100%"
            height="50px"
          />
        </form>

        {/* Back to Login */}
        <div className="text-center">
          <Link
            href="/login/email"
            className="text-gray-500 hover:text-gray-400 transition-colors text-sm inline-flex items-center gap-2"
          >
            <FaArrowLeft size={12} />
            Back to login
          </Link>
        </div>
      </div>
    </>
  );
}
