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

function TatScore({ userDetails }) {
//   console.log("TAT userDetails:", userDetails); // Debug log

  const processTATData = () => {
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
    //   console.log("All tests:", testArray); // Debug log

      const tatTests = testArray
        .filter(
          (test) =>
            test && test.testName && test.testName.toLowerCase().includes("tat") // Changed from "ppdt" to "tat"
        )
        .sort((a, b) => new Date(a.dateTaken) - new Date(b.dateTaken))
        .slice(-50); // Get only the last 50 TAT tests

    //   console.log("Filtered TAT tests (last 50):", tatTests); // Debug log

      const tatData = tatTests.map((test, index) => ({
        attempt: `Test ${index + 1}`,
        score: 0, // Set actual score to 0 as requested
        date: test.dateTaken
          ? new Date(test.dateTaken).toISOString().split("T")[0]
          : "",
      }));

    //   console.log("Processed TAT data (last 50):", tatData); // Debug log
      return tatData;
    } catch (error) {
      console.error("Error processing TAT data:", error);
      return [];
    }
  };

  const tatData = processTATData();

  const defaultData = [
    {
      attempt: "No attempts yet",
      score: 0,
      date: "",
    },
  ];

  const dataToUse = tatData.length > 0 ? tatData : defaultData;

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
        TAT Test Progress {tatData.length > 0 && `(${tatData.length} Tests)`}
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
            {tatData.length > 0 ? tatData[tatData.length - 1]?.score || 0 : 0}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Latest Score</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#28a745" }}
          >
            {tatData.length > 0 ? Math.max(...tatData.map((d) => d.score)) : 0}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Best Score</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#17a2b8" }}
          >
            {tatData.length}
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
            name="TAT Score"
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
          {tatData.length === 0
            ? "🎯 Take your first TAT test to see progress!"
            : `📊 ${tatData.length} TAT tests completed! Scoring system coming soon.`}
        </span>
      </div>
    </div>
  );
}

export default TatScore;
