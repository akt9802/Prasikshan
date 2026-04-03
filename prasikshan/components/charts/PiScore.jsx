"use client";
import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

function PiScore({ userDetails }) {
  const processPiData = () => {
    try {
      if (
        !userDetails ||
        !userDetails.testsTaken ||
        !Array.isArray(userDetails.testsTaken)
      ) {
        return [];
      }

      const testArray = userDetails.testsTaken;

      const piTests = testArray
        .filter((test) => {
          if (!test || !test.testName) return false;
          const n = test.testName.toUpperCase();
          return n.includes("PI") || n.includes("PERSONAL INTERVIEW");
        })
        .sort((a, b) => new Date(a.dateTaken).getTime() - new Date(b.dateTaken).getTime())
        .slice(-50); 

      const piData = piTests.map((test, index) => ({
        attempt: `Test ${index + 1}`,
        score: Number(test.score) || 0,
        timeInSeconds: Number(test.timeTaken) || 0,
        date: test.dateTaken
          ? new Date(test.dateTaken).toISOString().split("T")[0]
          : "",
      }));

      return piData;
    } catch (error) {
      console.error("Error processing PI data:", error);
      return [];
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const piData = processPiData();
  const defaultData = [
    {
      attempt: "No attempts yet",
      score: 0,
      timeInSeconds: 0,
      date: "",
    },
  ];

  const dataToUse = piData.length > 0 ? piData : defaultData;

  return (
    <div
      style={{
        width: "100%",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
        padding: 24,
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.5rem",
          marginBottom: 24,
          color: "#124D96",
        }}
      >
        PI Test Score Progress{" "}
        {piData.length > 0 && `(Last ${piData.length} Tests)`}
      </h2>

      {/* Score Summary */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: 20,
          padding: "10px 0",
          background: "#f8f9fa",
          borderRadius: 8,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#124D96" }}
          >
            {piData.length > 0 ? piData[piData.length - 1]?.score || 0 : 0}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Latest Score</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#28a745" }}
          >
            {piData.length > 0 ? Math.max(...piData.map((d) => d.score)) : 0}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Best Score</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#17a2b8" }}
          >
            {piData.length}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>
            Recent Attempts
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#FF8042" }}
          >
            {piData.length > 0 && piData[piData.length - 1]?.timeInSeconds
              ? formatTime(piData[piData.length - 1].timeInSeconds)
              : "0m 0s"}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Latest Time</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={dataToUse}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="attempt"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis allowDecimals={false} domain={[0, 10]} fontSize={12} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: 8,
                      padding: 10,
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: "bold" }}>{label}</p>
                    <p style={{ margin: "5px 0", color: "#124D96" }}>
                      Score: {data.score}
                    </p>
                    <p style={{ margin: "5px 0", color: "#FF8042" }}>
                      Time: {formatTime(data.timeInSeconds)}
                    </p>
                    <p
                      style={{
                        margin: "5px 0",
                        color: "#666",
                        fontSize: "0.9rem",
                      }}
                    >
                      Date: {new Date(data.date).toLocaleDateString()}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="score"
            name="Interview Score"
            stroke="#124D96"
            fill="#124D96"
            fillOpacity={0.3}
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Performance Indicator */}
      <div style={{ textAlign: "center", marginTop: 15 }}>
        <span
          style={{
            fontSize: "0.9rem",
            color: "#124D96",
            fontWeight: "500",
          }}
        >
          {piData.length === 0
            ? "🎯 Take your first PI test to see progress!"
            : `📊 ${piData.length} PI tests completed!`}
        </span>
      </div>
    </div>
  );
}

export default PiScore;
