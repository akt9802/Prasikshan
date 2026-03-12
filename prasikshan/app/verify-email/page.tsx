"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/footer/Footer";

function VerifyEmailContent() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    useEffect(() => {
        if (!email) {
            setError("No email found to verify. Please sign in or sign up again.");
        }
    }, [email]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/verify-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    otp,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(data.message || "Email verified successfully! Redirecting...");

                setTimeout(() => {
                    router.push("/signin");
                }, 1500);
            } else {
                setError(data.message || "Verification failed!");
            }
        } catch (error) {
            console.error("Error during verification:", error);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                        Verify Your Email
                    </h1>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                        We sent a verification code to <strong>{email}</strong>
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

                    {email && (
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label
                                    htmlFor="otp"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
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

                            <button
                                type="submit"
                                disabled={loading || otp.length < 6}
                                className="w-full text-black bg-blue-300 hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                {loading ? "Verifying..." : "Verify Email"}
                            </button>
                        </form>
                    )}

                    <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                        Back to{" "}
                        <Link
                            href="/signin"
                            className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div>
            <section className="bg-gray-50 dark:bg-gray-900">
                <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
                    <VerifyEmailContent />
                </Suspense>
            </section>
            <Footer />
        </div>
    );
}
