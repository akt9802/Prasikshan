"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/footer/Footer";

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const handleRequestOtp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(data.message || "OTP sent to your email!");
                setTimeout(() => {
                    setSuccess("");
                    setStep(2);
                }, 2000);
            } else {
                setError(data.message || "Failed to request OTP.");
            }
        } catch (err) {
            console.error("Error requesting OTP:", err);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(data.message || "Password reset successfully!");
                setTimeout(() => {
                    router.push("/signin");
                }, 2000);
            } else {
                setError(data.message || "Failed to reset password.");
            }
        } catch (err) {
            console.error("Error resetting password:", err);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <section className="bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                                {step === 1 ? "Forgot Password" : "Reset Password"}
                            </h1>

                            <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                                {step === 1
                                    ? "Enter your email address and we'll send you a One-Time Password (OTP) to reset your password."
                                    : `Please enter the 6-digit OTP sent to ${email} along with your new password.`}
                            </p>

                            {error && (
                                <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
                                    {success}
                                </div>
                            )}

                            {step === 1 ? (
                                <form className="space-y-4 md:space-y-6" onSubmit={handleRequestOtp}>
                                    <div>
                                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Your Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="name@company.com"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading || !email}
                                        className="w-full text-black bg-blue-300 hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        {loading ? "Sending OTP..." : "Send OTP"}
                                    </button>
                                    <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                                        Remember your password?{" "}
                                        <Link href="/signin" className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                                            Sign in
                                        </Link>
                                    </p>
                                </form>
                            ) : (
                                <form className="space-y-4 md:space-y-6" onSubmit={handleResetPassword}>
                                    <div>
                                        <label htmlFor="otp" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Verification Code (OTP)
                                        </label>
                                        <input
                                            type="text"
                                            name="otp"
                                            id="otp"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="bg-white border text-center text-xl tracking-widest border-gray-300 text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            placeholder="------"
                                            maxLength={6}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            id="newPassword"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="bg-white border text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            id="confirmPassword"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="bg-white border text-gray-900 rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                            required
                                            minLength={6}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={loading || otp.length < 6 || !newPassword || !confirmPassword}
                                        className="w-full text-black bg-blue-300 hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        {loading ? "Resetting..." : "Reset Password"}
                                    </button>
                                    <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                                        <button type="button" onClick={() => setStep(1)} className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                                            Back to Email Input
                                        </button>
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
