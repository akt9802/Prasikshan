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

// Example data: Replace this with your real OIR test data!
const data = [
  { attempt: "Attempt 1", score: 1, maxScore: 25, date: "2025-08-01" },
  { attempt: "Attempt 8", score: 23, maxScore: 25, date: "2025-08-18" },
  { attempt: "Attempt 2", score: 15, maxScore: 25, date: "2025-08-03" },
  { attempt: "Attempt 3", score: 18, maxScore: 25, date: "2025-08-05" },
  { attempt: "Attempt 4", score: 11, maxScore: 25, date: "2025-08-08" },
  { attempt: "Attempt 5", score: 20, maxScore: 25, date: "2025-08-10" },
  { attempt: "Attempt 6", score: 22, maxScore: 25, date: "2025-08-12" },
  { attempt: "Attempt 7", score: 19, maxScore: 25, date: "2025-08-15" },
  { attempt: "Attempt 3", score: 10, maxScore: 25, date: "2025-08-05" },
  { attempt: "Attempt 3", score: 8, maxScore: 25, date: "2025-08-05" },
  { attempt: "Attempt 3", score: 8, maxScore: 25, date: "2025-08-05" },
];

function PPDTScore({ oirData = data }) {
  return (
    <div
      style={{
        width: "100%",
        // margin: "40px auto",
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
        PPDT Test Score Progress
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
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#124D96" }}>
            {oirData[oirData.length - 1]?.score || 0}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Latest Score</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#28a745" }}>
            {Math.max(...oirData.map(d => d.score))}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Best Score</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#17a2b8" }}>
            {oirData.length}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#666" }}>Total Attempts</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={oirData}>
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
            domain={[0, 25]}
            fontSize={12}
          />
          <Tooltip 
            formatter={(value, name) => [value, name === 'score' ? 'Score' : 'Max Score']}
            labelFormatter={(label) => `${label}`}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="score"
            name="Your Score"
            stroke="#124D96"
            fill="#124D96"
            fillOpacity={0.3}
            strokeWidth={3}
          />
          <Area
            type="monotone"
            dataKey="maxScore"
            name="Max Score"
            stroke="#e0e0e0"
            fill="transparent"
            strokeDasharray="5 5"
            strokeWidth={1}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      {/* Performance Indicator */}
      <div style={{ textAlign: "center", marginTop: 15 }}>
        <span style={{ 
          fontSize: "0.9rem", 
          color: oirData[oirData.length - 1]?.score >= 20 ? "#28a745" : oirData[oirData.length - 1]?.score >= 15 ? "#ffc107" : "#dc3545",
          fontWeight: "500"
        }}>
          {oirData[oirData.length - 1]?.score >= 20 
            ? "🎉 Excellent Performance!" 
            : oirData[oirData.length - 1]?.score >= 15 }
        </span>
      </div>
    </div>
  );
}

export default PPDTScore;