"use client";

import React from "react";
import Link from "next/link";
import Footer from "@/components/footer/Footer";

export default function SrtInstruction() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
        {/* Header */}
        <div className="bg-white border-b border-blue-200 py-6 px-4 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900">
              ⚡ Situation Reaction Test (SRT)
            </h1>
            <p className="text-blue-600 mt-2">Instructions & Guidelines</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex justify-center items-center px-4 py-12">
          <div className="w-full max-w-4xl">
            {/* Instructions Card */}
            <div className="bg-white border border-blue-200 rounded-lg shadow-md overflow-hidden">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-600 to-teal-500 px-6 py-4 md:px-8 md:py-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Test Instructions
                </h2>
              </div>

              {/* Instructions Content */}
              <div className="p-6 md:p-8">
                <ol className="space-y-4">
                  <li className="flex gap-4">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full flex-shrink-0">
                      1
                    </span>
                    <div>
                      <p className="text-gray-700 text-base md:text-lg">
                        This test assesses your <span className="font-semibold">decision-making, presence of mind, and Officer-Like Qualities (OLQs)</span>.
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full flex-shrink-0">
                      2
                    </span>
                    <div>
                      <p className="text-gray-700 text-base md:text-lg">
                        You will be presented with <span className="font-semibold">60 situations</span> one after another.
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full flex-shrink-0">
                      3
                    </span>
                    <div>
                      <p className="text-gray-700 text-base md:text-lg">
                        Each situation describes a real-life scenario. Write your <span className="font-semibold">immediate and appropriate reaction</span>.
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full flex-shrink-0">
                      4
                    </span>
                    <div>
                      <p className="text-gray-700 text-base md:text-lg">
                        You will have <span className="font-semibold">30 seconds per situation</span> to write your response.
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full flex-shrink-0">
                      5
                    </span>
                    <div>
                      <p className="text-gray-700 text-base md:text-lg">
                        Keep your responses <span className="font-semibold">short, practical, and positive</span>, demonstrating leadership and courage.
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full flex-shrink-0">
                      6
                    </span>
                    <div>
                      <p className="text-gray-700 text-base md:text-lg">
                        Avoid negative responses or leaving any situation unanswered.
                      </p>
                    </div>
                  </li>
                </ol>

                {/* Key Tips Section */}
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-bold text-blue-900 mb-3">💡 Key Tips for Success:</h3>
                  <ul className="space-y-2 text-gray-700 text-sm md:text-base">
                    <li>✓ Read the situation quickly</li>
                    <li>✓ Think of practical and positive reactions</li>
                    <li>✓ Show leadership and decision-making skills</li>
                    <li>✓ Never leave a situation unanswered</li>
                    <li>✓ Be time-conscious - 30 seconds per question</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="flex justify-center mt-8">
              <Link
                href="/alltest/srt/displaysrtquestions"
                className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 shadow-lg"
              >
                Start Test →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
