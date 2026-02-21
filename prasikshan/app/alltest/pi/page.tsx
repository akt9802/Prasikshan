"use client";

import React from "react";
import Link from "next/link";
import Footer from "@/components/footer/Footer";

export default function PiInstruction() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
        {/* Header */}
        <div className="bg-white border-b border-blue-200 py-6 px-4 md:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-900">
              👔 Personal Interview (PI) Test
            </h1>
            <p className="text-blue-600 mt-2">Guidelines & Instructions</p>
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
                  Interview Guidelines
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
                        This session assesses your <span className="font-semibold">personality, confidence, communication skills, and Officer-Like Qualities (OLQs)</span> through an interactive interview.
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full flex-shrink-0">
                      2
                    </span>
                    <div>
                      <p className="text-gray-700 text-base md:text-lg">
                        You will have a one-on-one interview where you'll be asked about your <span className="font-semibold">personal life, academics, hobbies, achievements, and current affairs</span>.
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full flex-shrink-0">
                      3
                    </span>
                    <div>
                      <p className="text-gray-700 text-base md:text-lg">
                        The duration of the interview is approximately <span className="font-semibold">30 to 60 minutes</span>.
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full flex-shrink-0">
                      4
                    </span>
                    <div>
                      <p className="text-gray-700 text-base md:text-lg">
                        Answer all questions <span className="font-semibold">honestly, confidently, and with clarity</span>. Avoid memorized or exaggerated responses.
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full flex-shrink-0">
                      5
                    </span>
                    <div>
                      <p className="text-gray-700 text-base md:text-lg">
                        Maintain a <span className="font-semibold">positive attitude, proper posture, and natural eye contact</span> throughout the interview.
                      </p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white font-bold rounded-full flex-shrink-0">
                      6
                    </span>
                    <div>
                      <p className="text-gray-700 text-base md:text-lg">
                        Listen carefully to questions and respond in a <span className="font-semibold">calm and composed manner</span>.
                      </p>
                    </div>
                  </li>
                </ol>

                {/* Key Tips Section */}
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-bold text-blue-900 mb-3">💡 Key Tips for Success:</h3>
                  <ul className="space-y-2 text-gray-700 text-sm md:text-base">
                    <li>✓ Be yourself - authenticity is key</li>
                    <li>✓ Listen carefully before answering</li>
                    <li>✓ Maintain good body language and eye contact</li>
                    <li>✓ Be prepared to discuss your hobbies and interests</li>
                    <li>✓ Show interest in current affairs</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="flex justify-center mt-8">
              <Link
                href="/alltest/pi/displaypiquestions"
                className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors duration-200 shadow-lg"
              >
                Start Interview →
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
