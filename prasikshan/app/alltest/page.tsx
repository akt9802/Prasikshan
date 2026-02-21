"use client";

import React from "react";
import Link from "next/link";
import Footer from "@/components/footer/Footer";

interface TestItem {
  id: string;
  title: string;
  description: string;
  route: string;
  label: string;
  duration: string;
  questions: number;
  icon: string;
}

export default function Alltest() {
  const tests: TestItem[] = [
    {
      id: "oir",
      label: "OIR",
      title: "Officer Intelligence Rating Test",
      description:
        "Assess your logical and analytical abilities with verbal and non-verbal reasoning questions designed to evaluate your problem-solving skills.",
      route: "/alltest/oir",
      duration: "40 min",
      questions: 40,
      icon: "🧠",
    },
    {
      id: "ppdt",
      label: "PPDT",
      title: "Picture Perception and Discussion Test",
      description:
        "View images, write creative stories, and participate in group discussions to showcase your observation and communication abilities.",
      route: "/alltest/ppdt",
      duration: "35 min",
      questions: 5,
      icon: "🖼️",
    },
    {
      id: "tat",
      label: "TAT",
      title: "Thematic Apperception Test",
      description:
        "Interpret images and create meaningful stories that reflect your emotional understanding and psychological perspective.",
      route: "/alltest/tat",
      duration: "60 min",
      questions: 12,
      icon: "📖",
    },
    {
      id: "wat",
      label: "WAT",
      title: "Word Association Test",
      description:
        "Respond spontaneously to word prompts and evaluate your subconscious thinking patterns and emotional maturity.",
      route: "/alltest/wat",
      duration: "15 min",
      questions: 60,
      icon: "💭",
    },
    {
      id: "srt",
      label: "SRT",
      title: "Situation Reaction Test",
      description:
        "Make quick decisions on real-life scenarios to assess your presence of mind and practical decision-making abilities.",
      route: "/alltest/srt",
      duration: "20 min",
      questions: 60,
      icon: "⚡",
    },
    {
      id: "lecturette",
      label: "LECTURETTE",
      title: "Lecturette Test",
      description:
        "Choose a topic, prepare your thoughts, and deliver a structured speech demonstrating clarity and confidence.",
      route: "/alltest/lecturette",
      duration: "6 min",
      questions: 1,
      icon: "🎤",
    },
    {
      id: "pi",
      label: "PI",
      title: "Personal Interview",
      description:
        "Engage in a comprehensive interview to evaluate your personality traits, adaptability, and Officer-Like Qualities.",
      route: "/alltest/pi",
      duration: "30 min",
      questions: 1,
      icon: "👔",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        {/* Header Section */}
        <div className="bg-white border-b border-slate-200 py-12 px-4 md:px-8 lg:px-12 shadow-sm">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              SSB Test Practice Modules
            </h1>
            <p className="text-slate-600 text-base md:text-lg">
              Choose any test below to begin your preparation. Each module includes practice questions and detailed feedback.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 md:px-8 lg:px-12 py-12">
          {/* Tests Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tests.map((test, index) => (
              <Link href={test.route} key={test.id}>
                <div
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer transform hover:scale-105"
                >
                  {/* Top Bar with Color */}
                  <div className="h-2 bg-blue-600"></div>

                  <div className="p-6">
                    {/* Icon and Label Row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-4xl">{test.icon}</div>
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 font-semibold text-sm rounded-full">
                        {test.label}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                      {test.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {test.description}
                    </p>

                    {/* Stats Row */}
                    <div className="flex gap-6 mb-5 pb-5 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⏱️</span>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Duration</p>
                          <p className="text-sm font-semibold text-slate-900">{test.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📝</span>
                        <div>
                          <p className="text-xs text-slate-500 font-medium">Questions</p>
                          <p className="text-sm font-semibold text-slate-900">{test.questions}</p>
                        </div>
                      </div>
                    </div>

                    {/* Button */}
                    <div className="inline-flex items-center justify-center w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg active:scale-95 transition-all duration-200">
                      Start Practice →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Info Section */}
          <div className="mt-14 bg-gradient-to-r from-blue-600 to-teal-500 rounded-2xl p-8 md:p-10 shadow-lg">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                🎯 About SSB Testing
              </h2>
              <p className="text-blue-50 leading-relaxed mb-6">
                The Services Selection Board (SSB) conducts comprehensive psychological evaluations for Indian Armed Forces recruitment. Our practice modules cover all major test components to help you prepare effectively and boost your confidence.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <p className="text-3xl font-bold text-white">7</p>
                  <p className="text-blue-50 text-sm mt-1">Test Modules</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <p className="text-3xl font-bold text-white">2000+</p>
                  <p className="text-blue-50 text-sm mt-1">Questions</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <p className="text-3xl font-bold text-white">100%</p>
                  <p className="text-blue-50 text-sm mt-1">Free</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
