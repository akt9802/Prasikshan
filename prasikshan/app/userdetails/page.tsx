"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer/Footer";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TYPE_COLORS = ["#124D96", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

interface UserDetails {
  name: string;
  email: string;
  testsTaken?: any[];
}

// Mock data with multiple test attempts
const mockUserDetails: UserDetails = {
  name: "Aman Kumar",
  email: "aman@example.com",
  testsTaken: [
    { testName: "OIR", score: 28, timeTaken: 2400, dateTaken: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString() },
    { testName: "OIR", score: 32, timeTaken: 2200, dateTaken: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString() },
    { testName: "OIR", score: 35, timeTaken: 2100, dateTaken: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString() },
    { testName: "OIR", score: 38, timeTaken: 2050, dateTaken: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
    { testName: "OIR", score: 35, timeTaken: 2150, dateTaken: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
    { testName: "PPDT", score: 30, timeTaken: 1800, dateTaken: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString() },
    { testName: "PPDT", score: 32, timeTaken: 1750, dateTaken: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString() },
    { testName: "PPDT", score: 35, timeTaken: 1700, dateTaken: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString() },
    { testName: "TAT", score: 25, timeTaken: 2200, dateTaken: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString() },
    { testName: "TAT", score: 28, timeTaken: 2100, dateTaken: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString() },
    { testName: "WAT", score: 26, timeTaken: 1500, dateTaken: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString() },
    { testName: "WAT", score: 28, timeTaken: 1450, dateTaken: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
    { testName: "SRT", score: 22, timeTaken: 1800, dateTaken: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString() },
    { testName: "SRT", score: 25, timeTaken: 1750, dateTaken: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString() },
    { testName: "LECTURETTE", score: 24, timeTaken: 1900, dateTaken: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString() },
  ],
};

// Total Tests Chart Component
const TotalTestChart = ({ userDetails }: { userDetails: UserDetails }) => {
  const processTestData = () => {
    if (!userDetails?.testsTaken) {
      return [{ testName: "No tests taken yet", count: 0 }];
    }

    const testCounts: Record<string, number> = {};
    userDetails.testsTaken.forEach((test) => {
      const name = test.testName.toUpperCase();
      testCounts[name] = (testCounts[name] || 0) + 1;
    });

    return Object.entries(testCounts).map(([name, count]) => ({
      testName: name,
      count,
    }));
  };

  const data = processTestData();
  const hasData = data.length > 0 && data[0].testName !== "No tests taken yet";

  return (
    <div style={{ width: "100%", background: "#fff", borderRadius: 16, boxShadow: "0 8px 24px rgba(18, 77, 150, 0.12)", padding: 30, transition: "all 0.3s ease" }}>
      <h2 style={{ textAlign: "center", fontWeight: "700", fontSize: "1.5rem", marginBottom: 25, color: "#124D96", letterSpacing: "-0.5px" }}>
        📊 Test Distribution
      </h2>
      {hasData ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={data} dataKey="count" nameKey="testName" cx="50%" cy="50%" outerRadius={80} fill="#124D96" label>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }} />
            <Legend wrapperStyle={{ paddingTop: 20 }} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#00C49F", fontSize: "1rem", fontWeight: 500 }}>
          Start taking tests to see your progress!
        </div>
      )}
    </div>
  );
};

// Monthly Test Chart Component
const MonthlyTestChart = ({ userDetails }: { userDetails: UserDetails }) => {
  const processMonthlyData = () => {
    if (!userDetails?.testsTaken) return [];

    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const dailyCounts: Record<string, number> = {};

    userDetails.testsTaken.forEach((test) => {
      if (test.dateTaken) {
        const testDate = new Date(test.dateTaken);
        if (testDate >= thirtyDaysAgo && testDate <= today) {
          const dateString = testDate.toISOString().split("T")[0];
          dailyCounts[dateString] = (dailyCounts[dateString] || 0) + 1;
        }
      }
    });

    return Object.entries(dailyCounts)
      .map(([date, tests]) => ({
        date,
        tests,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const data = processMonthlyData();
  const hasData = data.length > 0;
  const totalTests = data.reduce((sum, day) => sum + day.tests, 0);

  return (
    <div style={{ width: "100%", background: "#fff", borderRadius: 16, boxShadow: "0 8px 24px rgba(18, 77, 150, 0.12)", padding: 30, transition: "all 0.3s ease" }}>
      <h2 style={{ textAlign: "center", fontWeight: "700", fontSize: "1.5rem", marginBottom: 25, color: "#124D96", letterSpacing: "-0.5px" }}>
        📈 Activity (Last 30 Days)
      </h2>
      {hasData ? (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 30 }}>
            <div style={{ background: "linear-gradient(135deg, #124D96 0%, #1E5799 100%)", padding: 20, borderRadius: 12, color: "white", textAlign: "center", boxShadow: "0 4px 12px rgba(18, 77, 150, 0.2)" }}>
              <div style={{ fontSize: "2rem", fontWeight: "700", marginBottom: 5 }}>{totalTests}</div>
              <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>Tests (30 days)</div>
            </div>
            <div style={{ background: "linear-gradient(135deg, #00C49F 0%, #00a884 100%)", padding: 20, borderRadius: 12, color: "white", textAlign: "center", boxShadow: "0 4px 12px rgba(0, 196, 159, 0.2)" }}>
              <div style={{ fontSize: "2rem", fontWeight: "700", marginBottom: 5 }}>{data.length}</div>
              <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>Active Days</div>
            </div>
            <div style={{ background: "linear-gradient(135deg, #FF8042 0%, #ff6627 100%)", padding: 20, borderRadius: 12, color: "white", textAlign: "center", boxShadow: "0 4px 12px rgba(255, 128, 66, 0.2)" }}>
              <div style={{ fontSize: "2rem", fontWeight: "700", marginBottom: 5 }}>{Math.round((totalTests / data.length) * 10) / 10}</div>
              <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>Daily Avg</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#124D96" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#124D96" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", background: "#fff" }} />
              <Legend wrapperStyle={{ paddingTop: 15 }} />
              <Line type="monotone" dataKey="tests" stroke="#124D96" strokeWidth={3} name="Tests Completed" dot={{ fill: "#124D96", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#00C49F", fontSize: "1rem", fontWeight: 500 }}>
          No test activity in the last 30 days
        </div>
      )}
    </div>
  );
};

// Individual Test Score Chart Component
const TestScoreChart = ({ userDetails, testName }: { userDetails: UserDetails; testName: string }) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const processTestData = () => {
    if (!userDetails?.testsTaken) return [];

    return userDetails.testsTaken
      .filter((test) => test.testName.toUpperCase() === testName.toUpperCase())
      .sort((a, b) => new Date(a.dateTaken).getTime() - new Date(b.dateTaken).getTime())
      .map((test, index) => ({
        attempt: `Test ${index + 1}`,
        score: test.score,
        timeInSeconds: test.timeTaken,
      }));
  };

  const data = processTestData();
  const latestScore = data.length > 0 ? data[data.length - 1]?.score || 0 : 0;
  const bestScore = data.length > 0 ? Math.max(...data.map((d) => d.score)) : 0;

  return (
    <div style={{ borderRadius: 8 }}>
      {/* Score Summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 15, marginBottom: 30 }}>
        <div style={{ background: "linear-gradient(135deg, #124D96 0%, #1E5799 100%)", padding: 20, borderRadius: 12, color: "white", textAlign: "center", boxShadow: "0 4px 12px rgba(18, 77, 150, 0.2)", transition: "transform 0.3s ease" }}>
          <div style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: 5 }}>{latestScore}</div>
          <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>Latest Score</div>
        </div>
        <div style={{ background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)", padding: 20, borderRadius: 12, color: "white", textAlign: "center", boxShadow: "0 4px 12px rgba(40, 167, 69, 0.2)", transition: "transform 0.3s ease" }}>
          <div style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: 5 }}>{bestScore}</div>
          <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>Best Score</div>
        </div>
        <div style={{ background: "linear-gradient(135deg, #17a2b8 0%, #20c997 100%)", padding: 20, borderRadius: 12, color: "white", textAlign: "center", boxShadow: "0 4px 12px rgba(23, 162, 184, 0.2)", transition: "transform 0.3s ease" }}>
          <div style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: 5 }}>{data.length}</div>
          <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>Attempts</div>
        </div>
        <div style={{ background: "linear-gradient(135deg, #FF8042 0%, #ff6627 100%)", padding: 20, borderRadius: 12, color: "white", textAlign: "center", boxShadow: "0 4px 12px rgba(255, 128, 66, 0.2)", transition: "transform 0.3s ease" }}>
          <div style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: 5 }}>
            {data.length > 0 ? formatTime(data[data.length - 1].timeInSeconds) : "0m 0s"}
          </div>
          <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>Latest Time</div>
        </div>
      </div>

      {/* Area Chart */}
      {data.length > 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", padding: 20 }}>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#124D96" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#124D96" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="attempt" fontSize={11} stroke="#999" angle={-45} textAnchor="end" height={60} />
              <YAxis domain={[0, 50]} fontSize={11} stroke="#999" />
              <Tooltip contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", background: "#fff" }} formatter={(value) => [value, "Score"]} />
              <Area type="monotone" dataKey="score" stroke="#124D96" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "40px", background: "#f8f9fa", borderRadius: 12, color: "#00C49F", fontSize: "1rem", fontWeight: 500 }}>
          No attempts for this test yet
        </div>
      )}
    </div>
  );
};

export default function UserDetails() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [selectedTest, setSelectedTest] = useState("OIR");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setUserDetails(mockUserDetails);
      setLoading(false);
    }, 500);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("auth-change"));
    alert("You have been logged out successfully!");
    window.location.href = "/";
  };

  const testButtons = [
    { name: "OIR", darkBg: "#0f3d6b", lightBg: "#1E5799" },
    { name: "PPDT", darkBg: "#009688", lightBg: "#00C49F" },
    { name: "TAT", darkBg: "#e6940a", lightBg: "#FFA500" },
    { name: "WAT", darkBg: "#e6692e", lightBg: "#FF8042" },
    { name: "SRT", darkBg: "#6c63d2", lightBg: "#8884d8" },
    { name: "LECTURETTE", darkBg: "#6bb36b", lightBg: "#82ca9d" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-xl text-gray-600">Loading user details...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "20px" }}>
        {userDetails ? (
          <div>
            {/* Hero Section with Gradient */}
            <div
              style={{
                background: "linear-gradient(135deg, #124D96 0%, #1E5799 50%, #00C49F 100%)",
                borderRadius: 16,
                padding: "50px 40px",
                marginBottom: 40,
                color: "white",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 12px 40px rgba(18, 77, 150, 0.25)",
              }}
            >
              <div style={{ position: "absolute", top: 0, right: 0, opacity: 0.1, fontSize: "200px" }}>🎯</div>
              
              <button
                onClick={handleLogout}
                style={{
                  position: "absolute",
                  top: "25px",
                  right: "25px",
                  padding: "12px 24px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  border: "2px solid rgba(255, 255, 255, 0.5)",
                  borderRadius: 8,
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(10px)",
                }}
                onMouseOver={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
                  target.style.transform = "translateY(-2px)";
                  target.style.boxShadow = "0 8px 20px rgba(0,0,0,0.2)";
                }}
                onMouseOut={(e) => {
                  const target = e.target as HTMLButtonElement;
                  target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
                  target.style.transform = "translateY(0)";
                  target.style.boxShadow = "none";
                }}
              >
                🚪 Logout
              </button>

              <div style={{ position: "relative", zIndex: 1, maxWidth: "70%" }}>
                <h1 style={{ fontWeight: "700", fontSize: "2.8rem", margin: 0, letterSpacing: "-1px", marginBottom: 10 }}>
                  Welcome back, {userDetails.name}! 👋
                </h1>
                <p style={{ fontSize: "1.1rem", margin: 0, opacity: 0.95, fontWeight: 400 }}>
                  Track your test performance and monitor your progress toward SSB success
                </p>
              </div>
            </div>

            {/* Quick Stats Overview */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
              {(() => {
                const testCounts: Record<string, number> = {};
                const scores: number[] = [];
                userDetails.testsTaken?.forEach((test) => {
                  testCounts[test.testName] = (testCounts[test.testName] || 0) + 1;
                  scores.push(test.score);
                });
                const totalAttempts = userDetails.testsTaken?.length || 0;
                const avgScore = scores.length > 0 ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : 0;
                const testsCompleted = Object.keys(testCounts).length;

                return (
                  <>
                    <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", border: "1px solid #e8ebf0", transition: "all 0.3s ease" }}>
                      <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#124D96", marginBottom: 8 }}>{totalAttempts}</div>
                      <div style={{ fontSize: "0.9rem", color: "#666", fontWeight: 500 }}>Total Attempts</div>
                    </div>
                    <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", border: "1px solid #e8ebf0", transition: "all 0.3s ease" }}>
                      <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#00C49F", marginBottom: 8 }}>{avgScore}</div>
                      <div style={{ fontSize: "0.9rem", color: "#666", fontWeight: 500 }}>Average Score</div>
                    </div>
                    <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", border: "1px solid #e8ebf0", transition: "all 0.3s ease" }}>
                      <div style={{ fontSize: "2.5rem", fontWeight: "700", color: "#FF8042", marginBottom: 8 }}>{testsCompleted}</div>
                      <div style={{ fontSize: "0.9rem", color: "#666", fontWeight: 500 }}>Test Types Done</div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Charts Container */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: 30, marginBottom: 40 }}>
              <TotalTestChart userDetails={userDetails} />
              <MonthlyTestChart userDetails={userDetails} />
            </div>

            {/* Test Score Selection Section */}
            <div
              style={{
                margin: "0 auto",
                padding: "40px",
                backgroundColor: "#fff",
                borderRadius: 16,
                boxShadow: "0 8px 24px rgba(18, 77, 150, 0.12)",
                maxWidth: 1200,
                marginBottom: 40,
              }}
            >
              <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "700", color: "#124D96", marginBottom: 35, letterSpacing: "-0.5px" }}>
                📊 Detailed Performance Analysis
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 35, alignItems: "start" }}>
                {/* Test Type Buttons */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12, height: "fit-content" }}>
                  {testButtons.map((test, index) => (
                    <button
                      key={test.name}
                      onClick={() => setSelectedTest(test.name)}
                      style={{
                        padding: "16px 20px",
                        backgroundColor: selectedTest === test.name ? test.darkBg : "#f0f2f5",
                        color: selectedTest === test.name ? "white" : "#124D96",
                        border: selectedTest === test.name ? "none" : "2px solid #e0e0e0",
                        borderRadius: 10,
                        fontSize: "1rem",
                        fontWeight: selectedTest === test.name ? "700" : "600",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        transform: selectedTest === test.name ? "translateX(8px)" : "translateX(0)",
                        boxShadow: selectedTest === test.name ? "0 6px 16px rgba(0,0,0,0.15)" : "none",
                        letterSpacing: "-0.3px",
                      }}
                      onMouseOver={(e) => {
                        const target = e.target as HTMLButtonElement;
                        if (selectedTest !== test.name) {
                          target.style.backgroundColor = "#e8f0ff";
                          target.style.borderColor = test.lightBg;
                        }
                      }}
                      onMouseOut={(e) => {
                        const target = e.target as HTMLButtonElement;
                        if (selectedTest !== test.name) {
                          target.style.backgroundColor = "#f0f2f5";
                          target.style.borderColor = "#e0e0e0";
                        }
                      }}
                    >
                      {index === 0 ? "👁️" : index === 1 ? "🎨" : index === 2 ? "✏️" : index === 3 ? "📝" : index === 4 ? "💭" : "🎤"} {test.name}
                    </button>
                  ))}
                </div>

                {/* Chart Area */}
                <TestScoreChart userDetails={userDetails} testName={selectedTest} />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
            <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#666" }}>
              Unable to load user details
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
