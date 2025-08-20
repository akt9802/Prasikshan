import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Example data, replace this with your actual test data prop or fetch
const data = [
  { testName: "OIR", score: 18 },
  { testName: "PPDT", score: 15 },
  { testName: "TAT", score: 40 },
  { testName: "WAT", score: 47 },
  { testName: "SRT", score: 19 },
  { testName: "Lecturette", score: 12 },
];

const COLORS = [
  "#124D96",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

function TotalTest({ testsTaken = data }) {
  return (
    <div
      style={{
        width: "100%",
        // maxWidth: 600,
        margin: "40px auto",
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
        padding: 5,
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: "1.5rem",
          marginBottom: 0,
          color: "#124D96",
          paddingTop: 15,
        }}
      >
        Total Test
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={testsTaken}
            dataKey="score"
            nameKey="testName"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#124D96"
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
          >
            {testsTaken.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TotalTest;
