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

function WatScore({ userDetails }) {
//   console.log("WAT userDetails:", userDetails); // Debug log

  const processWATData = () => {
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

      // Calculate date 30 days ago
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const watTests = testArray
        .filter(
          (test) =>
            test &&
            test.testName &&
            test.testName.toLowerCase().includes("wat") &&
            test.dateTaken &&
            new Date(test.dateTaken) >= thirtyDaysAgo // Only last 30 days
        )
        .sort((a, b) => new Date(a.dateTaken) - new Date(b.dateTaken));

    //   console.log("Filtered WAT tests (last 30 days):", watTests); // Debug log

      // Group tests by date and count how many tests per date
      const dailyCounts = {};

      watTests.forEach((test) => {
        if (test && test.dateTaken) {
          const testDate = new Date(test.dateTaken);
          const dateString = testDate.toISOString().split("T")[0]; // Get YYYY-MM-DD

          // Count tests for this date
          dailyCounts[dateString] = (dailyCounts[dateString] || 0) + 1;
        }
      });

      // Convert to array format for chart and sort by date
      const watData = Object.entries(dailyCounts)
        .map(([date, count]) => ({
          date,
          testsCount: Number(count),
          formattedDate: new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
          }),
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

    //   console.log("Processed WAT data (last 30 days):", watData); // Debug log
      return watData;
    } catch (error) {
      console.error("Error processing WAT data:", error);
      return [];
    }
  };

  const watData = processWATData();
  const totalTests = watData.reduce((sum, day) => sum + day.testsCount, 0);
  const activeDays = watData.length;

  const defaultData = [
    {
      date: "No attempts yet",
      testsCount: 0,
      formattedDate: "No data",
    },
  ];

  const dataToUse = watData.length > 0 ? watData : defaultData;

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
        WAT Test Activity - Last 30 Days{" "}
        {watData.length > 0 && `(${activeDays} Active Days)`}
      </h2>

      {/* Summary Stats */}
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
            {totalTests}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Total Tests</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#28a745" }}
          >
            {watData.length > 0
              ? Math.max(...watData.map((d) => d.testsCount))
              : 0}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Max Per Day</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#17a2b8" }}
          >
            {activeDays}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Active Days</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#FF8042" }}
          >
            {activeDays > 0
              ? Math.round((totalTests / activeDays) * 10) / 10
              : 0}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Avg Per Day</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={dataToUse}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="formattedDate"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            allowDecimals={false}
            domain={[0, "dataMax + 1"]} // Dynamic domain based on max tests per day
            fontSize={12}
            label={{
              value: "Tests Count",
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
                    <p style={{ margin: 0, fontWeight: "bold" }}>
                      Date: {new Date(data.date).toLocaleDateString()}
                    </p>
                    <p style={{ margin: "5px 0", color: "#124D96" }}>
                      WAT Tests: {data.testsCount}
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
            dataKey="testsCount"
            name="WAT Tests Per Day"
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
          {watData.length === 0
            ? "🎯 Take your first WAT test in the last 30 days to see activity!"
            : totalTests >= 10
            ? "🎉 Great WAT activity in the last 30 days!"
            : totalTests >= 5
            ? ""
            : ""}
        </span>
      </div>
    </div>
  );
}

export default WatScore;
