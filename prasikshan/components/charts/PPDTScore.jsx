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

function PPDTScore({ userDetails }) {
  // console.log("PPDT userDetails:", userDetails); // Debug log

  const processPPDTData = () => {
    try {
      if (
        !userDetails ||
        !userDetails.testsTaken ||
        !Array.isArray(userDetails.testsTaken)
      ) {
        console.log("No testsTaken array found");
        return [];
      }

      const testArray = userDetails.testsTaken;
      // console.log("All tests:", testArray); // Debug log

      const ppdtTests = testArray
        .filter(
          (test) =>
            test &&
            test.testName &&
            test.testName.toLowerCase().includes("ppdt")
        )
        .sort((a, b) => new Date(a.dateTaken) - new Date(b.dateTaken))
        .slice(-50); // Get only the last 50 PPDT tests

      // console.log("Filtered PPDT tests (last 50):", ppdtTests); // Debug log

      const ppdtData = ppdtTests.map((test, index) => ({
        attempt: `Test ${index + 1}`,
        score: 0, // Set score to 0 as requested (not attempt number)
        date: test.dateTaken
          ? new Date(test.dateTaken).toISOString().split("T")[0]
          : "",
      }));

      // console.log("Processed PPDT data (last 50):", ppdtData); // Debug log
      return ppdtData;
    } catch (error) {
      console.error("Error processing PPDT data:", error);
      return [];
    }
  };

  const ppdtData = processPPDTData();

  const defaultData = [
    {
      attempt: "No attempts yet",
      score: 0,
      date: "",
    },
  ];

  const dataToUse = ppdtData.length > 0 ? ppdtData : defaultData;

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
        PPDT Test Progress {ppdtData.length > 0 && `(${ppdtData.length} Tests)`}
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
            {ppdtData.length > 0
              ? ppdtData[ppdtData.length - 1]?.score || 0
              : 0}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Latest Score</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#28a745" }}
          >
            {ppdtData.length > 0
              ? Math.max(...ppdtData.map((d) => d.score))
              : 0}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Best Score</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#17a2b8" }}
          >
            {ppdtData.length}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>
            Total Attempts
          </div>
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
          <YAxis
            allowDecimals={false}
            domain={[0, 10]} // Fixed domain for score range
            fontSize={12}
            label={{
              value: "Score",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" },
            }}
          />
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
                      Score: {data.score} (Coming Soon)
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
            name="PPDT Score"
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
          {ppdtData.length === 0
            ? "🎯 Take your first PPDT test to see progress!"
            : `📊 ${ppdtData.length} PPDT tests completed! Scoring system coming soon.`}
        </span>
      </div>
    </div>
  );
}

export default PPDTScore;
