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

function OirScore({ userDetails }) {
  // console.log("OIR userDetails:", userDetails); // Debug log

  const processOirData = () => {
    try {
      if (
        !userDetails ||
        !userDetails.testsTaken ||
        !Array.isArray(userDetails.testsTaken)
      ) {
        // console.log("No testsTaken array found");
        return [];
      }

      const testArray = userDetails.testsTaken;
      // console.log("All tests:", testArray); // Debug log

      const oirTests = testArray
        .filter(
          (test) =>
            test && test.testName && test.testName.toLowerCase().includes("oir")
        )
        .sort((a, b) => new Date(a.dateTaken) - new Date(b.dateTaken))
        .slice(-50); // Get only the last 50 OIR tests

      // console.log("Filtered OIR tests (last 50):", oirTests); // Debug log

      const oirData = oirTests.map((test, index) => ({
        attempt: `Test ${index + 1}`,
        score: Number(test.score) || 0,
        timeInMinutes: Math.round((Number(test.timeTaken) || 0) / 60), // Convert seconds to minutes
        timeInSeconds: Number(test.timeTaken) || 0,
        date: test.dateTaken
          ? new Date(test.dateTaken).toISOString().split("T")[0]
          : "",
      }));

      // console.log("Processed OIR data (last 50):", oirData); // Debug log
      return oirData;
    } catch (error) {
      console.error("Error processing OIR data:", error);
      return [];
    }
  };

  // Function to format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const oirData = processOirData();

  const defaultData = [
    {
      attempt: "No attempts yet",
      score: 0,
      timeInMinutes: 0,
      timeInSeconds: 0,
      date: "",
    },
  ];

  const dataToUse = oirData.length > 0 ? oirData : defaultData;

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
        OIR Test Score Progress{" "}
        {oirData.length > 0 && `(Last ${oirData.length} Tests)`}
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
            {oirData.length > 0 ? oirData[oirData.length - 1]?.score || 0 : 0}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Latest Score</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#28a745" }}
          >
            {oirData.length > 0 ? Math.max(...oirData.map((d) => d.score)) : 0}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Best Score</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#17a2b8" }}
          >
            {oirData.length}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>
            Recent Attempts
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#FF8042" }}
          >
            {oirData.length > 0 && oirData[oirData.length - 1]?.timeInSeconds
              ? formatTime(oirData[oirData.length - 1].timeInSeconds)
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
          <YAxis allowDecimals={false} domain={[0, 50]} fontSize={12} />
          <Tooltip
            formatter={(value, name) => {
              if (name === "score") {
                return [value, "Your Score"];
              }
              return [value, name];
            }}
            labelFormatter={(label) => `${label}`}
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
            name="Score is out of 40"
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
            color:
              oirData.length > 0 && oirData[oirData.length - 1]?.score >= 40
                ? "#28a745"
                : oirData.length > 0 && oirData[oirData.length - 1]?.score >= 25
                ? "#ffc107"
                : "#dc3545",
            fontWeight: "500",
          }}
        >
          {oirData.length === 0
            ? "🎯 Take your first OIR test to see progress!"
            : oirData[oirData.length - 1]?.score >= 40
            ? "🎉 Excellent Performance!"
            : oirData[oirData.length - 1]?.score >= 25
            ? "👍 Good Progress!"
            : ""}
        </span>
      </div>
    </div>
  );
}

export default OirScore;
