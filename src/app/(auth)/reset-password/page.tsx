"use client";

import { Button } from "@/components/buttoon";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaCheck } from "react-icons/fa";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import InputField from "@/components/inputField";

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (!tokenParam) {
      // If no token, redirect to forgot password
      router.push("/forgot-password");
    } else {
      setToken(tokenParam);
    }
  }, [searchParams, router]);

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return { text: "Very Weak", color: "text-red-500" };
      case 2:
        return { text: "Weak", color: "text-orange-500" };
      case 3:
        return { text: "Fair", color: "text-yellow-500" };
      case 4:
        return { text: "Good", color: "text-blue-500" };
      case 5:
        return { text: "Strong", color: "text-green-500" };
      default:
        return { text: "", color: "" };
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    // TODO: Implement actual reset password logic
    setTimeout(() => {
      console.log("Reset password:", { token, password: formData.password });
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

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordStrengthInfo = getPasswordStrengthText(passwordStrength);

  if (!token) {
    return (
      <>
        <div className="flex flex-col gap-6 items-center py-6 w-full px-6 max-w-xs text-center">
          <span className="text-text-primary font-display text-2xl">
            Invalid Reset Link
          </span>
          <span className="text-gray-400 font-display text-sm">
            This password reset link is invalid or has expired.
          </span>
          <Link
            href="/forgot-password"
            className="text-spotlight-purple hover:text-spotlight-pink transition-colors text-sm"
          >
            Request a new reset link
          </Link>
        </div>
      </>
    );
  }

  if (isSuccess) {
    return (
      <>
        <div className="flex flex-col gap-6 lg:gap-8 items-center py-6 lg:py-8 w-full px-6 lg:px-0 lg:w-[75%] max-w-xs lg:max-w-md text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <FaCheck className="text-white text-2xl" />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-text-primary font-display text-2xl lg:text-3xl">
                Password Reset!
              </span>
              <span className="text-gray-400 font-display text-xs lg:text-sm">
                Your password has been successfully reset. You can now sign in
                with your new password.
              </span>
            </div>
          </div>

          <Button
            label="Sign In"
            onclick={() => router.push("/login/email")}
            backgroundColor="bg-gradient-to-r from-spotlight-purple to-spotlight-pink"
            hover="hover:shadow-glow-purple"
            borderColor="border-background-primary"
            textStyle="text-text-primary text-sm lg:text-lg"
            className="w-full h-full"
            width="100%"
            height="50px"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 lg:gap-8 items-center py-6 lg:py-8 w-full px-6 lg:px-0 lg:w-[75%] max-w-xs lg:max-w-md">
        <div className="flex flex-col items-start gap-2 justify-center w-full">
          <span className="text-text-primary font-display text-2xl lg:text-4xl">
            Reset Password
          </span>
          <span className="text-gray-400 font-display text-xs lg:text-sm">
            Enter your new password below
          </span>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Password Input */}
          <div className="w-full relative">
            <InputField
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full h-12 px-4 pr-12 rounded-lg bg-background-primary border ${errors.password ? "border-red-500" : "border-gray-600"
                } text-text-primary placeholder-gray-400 focus:outline-none focus:border-spotlight-purple transition-colors`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-text-primary transition-colors"
            >
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength >= 3
                          ? "bg-green-500"
                          : passwordStrength >= 2
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs ${passwordStrengthInfo.color}`}>
                    {passwordStrengthInfo.text}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="w-full relative">
            <InputField
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full h-12 px-4 pr-12 rounded-lg bg-background-primary border ${errors.confirmPassword ? "border-red-500" : "border-gray-600"
                } text-text-primary placeholder-gray-400 focus:outline-none focus:border-spotlight-purple transition-colors`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-text-primary transition-colors"
            >
              {showConfirmPassword ? (
                <FaEyeSlash size={16} />
              ) : (
                <FaEye size={16} />
              )}
            </button>
            {formData.confirmPassword && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                {formData.password === formData.confirmPassword &&
                  formData.confirmPassword ? (
                  <FaCheck className="text-green-500" size={16} />
                ) : formData.confirmPassword ? (
                  <div className="w-4 h-4 border-2 border-red-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-0.5 bg-red-500 transform rotate-45"></div>
                  </div>
                ) : null}
              </div>
            )}
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Reset Button */}
          <Button
            label={isLoading ? "Resetting..." : "Reset Password"}
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
            href="/login"
            className="text-gray-500 hover:text-gray-400 transition-colors text-sm"
          >
            ← Back to login
          </Link>
        </div>
      </div>
    </>
  );
}
