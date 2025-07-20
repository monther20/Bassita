"use client";

import { Button } from "@/components/buttoon";
import { useState } from "react";
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import Link from "next/link";
import InputField from "@/components/inputField";
import { useAuth } from "@/hooks";
import { useRouter } from "next/navigation";
import { GuestGuard } from "@/components";

export default function EmailSignupPage() {
  const router = useRouter();
  const { signUp, error, isLoading: authLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

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

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the Terms of Service";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await signUp(formData.email, formData.password, formData.fullName);
      const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
      router.push(redirectTo);
    } catch (error) {
      console.error('Sign up failed:', error);
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

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordStrengthInfo = getPasswordStrengthText(passwordStrength);

  return (
    <GuestGuard>
      <div className="flex flex-col gap-4 lg:gap-6 items-center py-6 lg:py-8 w-full px-6 lg:px-0 lg:w-[75%] max-w-xs lg:max-w-md">
        <div className="flex flex-col items-start gap-2 justify-center w-full">
          <span className="text-text-primary font-display text-2xl lg:text-4xl">
            Join Bassita!
          </span>
          <span className="text-gray-400 font-display text-xs lg:text-sm">
            Create your account to get started
          </span>
        </div>

        {error && (
          <div className="w-full p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Full Name Input */}
          <div className="w-full">
            <InputField
              type="text"
              name="fullName"
              placeholder="Full name"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full h-12 px-4 bg-background-primary border ${
                errors.fullName ? "border-red-500" : "border-gray-600"
              } text-text-primary placeholder-gray-400 focus:outline-none focus:border-spotlight-purple transition-colors`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
            )}
          </div>

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
              className={`w-full h-12 px-4 pr-12  bg-background-primary border ${
                errors.password ? "border-red-500" : "border-gray-600"
              } text-text-primary placeholder-gray-400 focus:outline-none focus:border-spotlight-purple transition-colors`}
            />

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        passwordStrength >= 3
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
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full h-12 px-4 pr-12 bg-background-primary border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-600"
              } text-text-primary placeholder-gray-400 focus:outline-none focus:border-spotlight-purple transition-colors`}
            />

            {formData.confirmPassword && (
              <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                {formData.password === formData.confirmPassword &&
                formData.confirmPassword ? (
                  <FaCheck className="text-green-500" size={16} />
                ) : formData.confirmPassword ? (
                  <FaTimes className="text-red-500" size={16} />
                ) : null}
              </div>
            )}
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="w-full">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="w-4 h-4 mt-1 text-spotlight-purple bg-background-primary border-gray-600 rounded"
              />
              <span className="text-sm text-gray-400 leading-tight">
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-spotlight-purple hover:text-spotlight-pink transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-spotlight-purple hover:text-spotlight-pink transition-colors"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>
            )}
          </div>

          {/* Sign Up Button */}
          <Button
            label={authLoading ? "Creating Account..." : "Create Account"}
            onclick={handleSubmit}
            backgroundColor="bg-gradient-to-r from-spotlight-purple to-spotlight-pink"
            hover="hover:shadow-glow-purple"
            borderColor="border-background-primary"
            textColor="text-text-primary"
            textSize="text-sm lg:text-lg"
            className="w-full h-full"
            width="100%"
            height="50px"
            disabled={authLoading}
          />
        </form>

        {/* Sign In Link */}
        <div className="text-center">
          <span className="text-gray-400 text-sm">
            Already have an account?{" "}
          </span>
          <Link
            href="/login/email"
            className="text-spotlight-purple hover:text-spotlight-pink transition-colors text-sm font-medium"
          >
            Sign in
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
