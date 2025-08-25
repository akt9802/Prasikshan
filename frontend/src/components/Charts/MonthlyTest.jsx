import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

function MonthlyTest({ userDetails }) {
  const processMonthlyData = () => {
    try {
      // Check if userDetails exists and has testsTaken array
      if (
        !userDetails ||
        !userDetails.testsTaken ||
        !Array.isArray(userDetails.testsTaken)
      ) {
        return [];
      }

      const testArray = userDetails.testsTaken;

      if (testArray.length === 0) {
        return [];
      }

      // Calculate date 30 days ago from today
      const today = new Date();
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);

      // console.log("Today:", today.toISOString().split("T")[0]);
      // console.log("30 days ago:", thirtyDaysAgo.toISOString().split("T")[0]);

      // Group tests by date (only for past 30 days)
      const dailyCounts = {};

      testArray.forEach((test) => {
        if (test && test.dateTaken) {
          const testDate = new Date(test.dateTaken);

          // Only include tests from the past 30 days
          if (testDate >= thirtyDaysAgo && testDate <= today) {
            const dateString = testDate.toISOString().split("T")[0]; // Get YYYY-MM-DD
            dailyCounts[dateString] = (dailyCounts[dateString] || 0) + 1;
          }
        }
      });

      // Convert to array format for chart and sort by date
      const monthlyData = Object.entries(dailyCounts)
        .map(([date, tests]) => ({
          date,
          tests: Number(tests),
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      // console.log("Processed monthly data (last 30 days):", monthlyData);
      return monthlyData;
    } catch (error) {
      console.error("Error processing monthly data:", error);
      return [];
    }
  };

  const monthlyData = processMonthlyData();
  const hasData = monthlyData && monthlyData.length > 0;
  const totalTestDays = monthlyData.length;
  const totalTests = monthlyData.reduce((sum, day) => sum + day.tests, 0);

  return (
    <div
      style={{
        width: "100%",
        margin: "40px auto",
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
          color: "#124D96",
        }}
      >
        Daily Test Activity (Last 30 Days)
      </h2>

      {/* Summary Stats */}
      {hasData && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: 5,
            padding: "5px",
            backgroundColor: "#f8f9fa",
            borderRadius: 8,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#124D96",
              }}
            >
              {totalTests}
            </div>
            <div style={{ fontSize: "0.9rem", color: "#666" }}>
              Tests (30 days)
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#00C49F",
              }}
            >
              {totalTestDays}
            </div>
            <div style={{ fontSize: "0.9rem", color: "#666" }}>Active Days</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#FF8042",
              }}
            >
              {totalTestDays > 0
                ? Math.round((totalTests / totalTestDays) * 10) / 10
                : 0}
            </div>
            <div style={{ fontSize: "0.9rem", color: "#666" }}>Daily Avg</div>
          </div>
        </div>
      )}

      {/* Chart or No Data Message */}
      {hasData ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => {
                const dateObj = new Date(date);
                return `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
              }}
              minTickGap={5}
              fontSize={12}
            />
            <YAxis
              allowDecimals={false}
              fontSize={12}
              label={{
                value: "Tests",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />
            <Tooltip
              formatter={(value, name) => [value, "Tests Solved"]}
              labelFormatter={(date) => {
                const dateObj = new Date(date);
                return `Date: ${dateObj.toLocaleDateString()}`;
              }}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                borderRadius: 8,
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="tests"
              name="Tests Solved"
              stroke="#124D96"
              strokeWidth={3}
              dot={{ r: 5, fill: "#124D96", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{
                r: 6,
                fill: "#FF0000",
                strokeWidth: 2,
                stroke: "#fff",
              }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "60px 20px",
            color: "#999",
            fontSize: "1.2rem",
          }}
        >
          <div style={{ marginBottom: 15, fontSize: "3rem" }}>📊</div>
          <div style={{ marginBottom: 10 }}>
            No test activity in the last 30 days
          </div>
          <div style={{ fontSize: "1rem" }}>
            Start taking tests to see your daily progress here!
          </div>
        </div>
      )}
    </div>
  );
}

export default MonthlyTest;
