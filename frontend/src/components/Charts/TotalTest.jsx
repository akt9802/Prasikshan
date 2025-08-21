import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#124D96", // Blue for OIR
  "#00C49F", // Green for PPDT
  "#FFBB28", // Yellow for TAT
  "#FF8042", // Orange for WAT
  "#8884d8", // Purple for SRT
  "#82ca9d", // Light Green for Lecturette
];

function TotalTest({ userDetails }) {
  // console.log("TotalTest userDetails:", userDetails);

  const processTestData = () => {
    try {
      // Check if userDetails exists and has testsTaken array
      if (
        !userDetails ||
        !userDetails.testsTaken ||
        !Array.isArray(userDetails.testsTaken)
      ) {
        return [{ testName: "No tests taken yet", count: 0 }];
      }

      const testArray = userDetails.testsTaken;

      if (testArray.length === 0) {
        return [{ testName: "No tests taken yet", count: 0 }];
      }

      // Group tests by testName and count them
      const testCounts = {};
      testArray.forEach((test) => {
        if (test && test.testName && typeof test.testName === "string") {
          // Clean up test name - remove "Test" and make it consistent
          let cleanTestName = test.testName
            .replace(/\s+Test$/i, "") // Remove "Test" at the end
            .trim()
            .toUpperCase(); // Make it uppercase for consistency

          // Standardize test names
          if (cleanTestName === "OIR") cleanTestName = "OIR";
          else if (cleanTestName === "PPDT") cleanTestName = "PPDT";
          else if (cleanTestName === "TAT") cleanTestName = "TAT";
          else if (cleanTestName === "WAT") cleanTestName = "WAT";
          else if (cleanTestName === "SRT") cleanTestName = "SRT";
          else if (cleanTestName.includes("LECTURETTE"))
            cleanTestName = "LECTURETTE";

          testCounts[cleanTestName] = (testCounts[cleanTestName] || 0) + 1;
        }
      });

      // Convert to array format for chart
      const chartData = Object.entries(testCounts).map(([testName, count]) => ({
        testName: String(testName),
        count: Number(count),
      }));

      return chartData.length > 0
        ? chartData
        : [{ testName: "No valid tests", count: 0 }];
    } catch (error) {
      console.error("Error processing test data:", error);
      return [{ testName: "Error", count: 0 }];
    }
  };

  let chartData, totalTests, isLoading, hasTests;

  try {
    chartData = processTestData();

    // Calculate total tests from testsTaken array
    totalTests = userDetails?.testsTaken?.length || 0;

    isLoading = !userDetails;
    hasTests =
      totalTests > 0 &&
      Array.isArray(chartData) &&
      chartData.length > 0 &&
      chartData[0].testName !== "No tests taken yet" &&
      chartData[0].testName !== "Loading..." &&
      chartData[0].testName !== "Error" &&
      chartData[0].testName !== "No valid tests";

    // console.log("Chart Data:", chartData);
    // console.log("Total Tests:", totalTests);
    // console.log("Has Tests:", hasTests);
  } catch (error) {
    console.error("Error in TotalTest component:", error);
    return (
      <div
        style={{
          width: "100%",
          margin: "40px auto",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
          padding: 24,
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#dc3545" }}>Error Loading Chart</h2>
        <p>Please refresh the page</p>
      </div>
    );
  }

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
          marginBottom: 20,
          color: "#124D96",
        }}
      >
        Total Test
      </h2>

      {/* Chart or message */}
      {hasTests && Array.isArray(chartData) ? (
        <>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="testName"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#124D96"
                label={({ name, value, percent }) =>
                  `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [value, "Tests"]}
                labelFormatter={(label) => `${label} Tests`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          {/* Test breakdown */}
          {/* <div style={{ marginTop: 20 }}>
            <h3
              style={{
                textAlign: "center",
                color: "#124D96",
                marginBottom: 15,
              }}
            >
              Test Breakdown:
            </h3>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 10,
              }}
            >
              {chartData.map((item, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: COLORS[index % COLORS.length],
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: 20,
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                  }}
                >
                  {String(item.testName)}: {String(item.count)}
                </div>
              ))}
            </div>
          </div> */}
        </>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "40px 0",
            color: "#999",
            fontSize: "1.1rem",
          }}
        >
          {isLoading
            ? "Loading your test data..."
            : "Start taking tests to see your progress here!"}
        </div>
      )}
    </div>
  );
}

export default TotalTest;
