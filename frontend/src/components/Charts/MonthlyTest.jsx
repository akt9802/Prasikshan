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

// Example data: Replace this with your real data!
const data = [
  { date: "2025-08-01", tests: 2 },
  { date: "2025-08-02", tests: 1 },
  { date: "2025-08-03", tests: 0 },
  { date: "2025-08-04", tests: 3 },
  { date: "2025-08-05", tests: 2 },
  { date: "2025-08-06", tests: 1 },
  { date: "2025-08-07", tests: 2 },
  { date: "2025-08-08", tests: 2 },
  { date: "2025-08-09", tests: 2 },
  { date: "2025-08-10", tests: 1 },
  { date: "2025-08-11", tests: 2 },
  { date: "2025-08-12", tests: 10 },
  { date: "2025-08-13", tests: 2 },
  { date: "2025-08-14", tests: 5 },
  { date: "2025-08-15", tests: 2 },
  { date: "2025-08-16", tests: 1 },
  // ...add more days as needed
];

function MonthlyTest({ monthlyData = data }) {
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
          marginBottom: 24,
          color: "#124D96",
        }}
      >
        Tests Solved Per Day (This Month)
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => date.slice(5)}
            minTickGap={10}
          />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="tests"
            name="Tests Solved"
            stroke="#124D96"
            strokeWidth={3}
            dot={{ r: 4, fill: "#FF0000" }}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthlyTest;
