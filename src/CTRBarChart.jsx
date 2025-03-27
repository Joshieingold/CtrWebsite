import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { fetchCTRReports } from "./CtrPage/api.jsx";
import Chart from "chart.js/auto";
import "./CTRBarChart.css";

const CTRBarChart = ({ ctrId }) => {
    const [chartData, setChartData] = useState(null);
  
    useEffect(() => {
      const loadData = async () => {
        const reports = await fetchCTRReports(ctrId);
        console.log("Fetched reports:", reports); // Debugging
  
        if (!reports) return;
  
        const { todayReport, priorReport } = reports;
  
        // Ensure `deviceCounts` exists
        const todayDeviceCounts = todayReport?.deviceCounts || {};
        const priorDeviceCounts = priorReport?.deviceCounts || {};
  
        console.log("Today's deviceCounts:", todayDeviceCounts);
        console.log("Yesterday's deviceCounts:", priorDeviceCounts);
  
        // Get all unique device names
        const allDevices = [...new Set([...Object.keys(todayDeviceCounts), ...Object.keys(priorDeviceCounts)])];
  
        if (allDevices.length === 0) {
          console.warn("No devices found.");
          return;
        }
  
        // Map counts for each device
        const todayCounts = allDevices.map(device => todayDeviceCounts[device] || 0);
        const priorCounts = allDevices.map(device => priorDeviceCounts[device] || 0);
  
        const newChartData = {
          labels: allDevices,
          datasets: [
            {
              label: "Today",
              data: todayCounts,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderWidth: 1,
            },
            {
              label: "Yesterday",
              data: priorCounts,
              backgroundColor: "rgba(255, 99, 132, 0.6)",
              borderWidth: 1,
            },
          ],
        };
  
        console.log("Chart data:", newChartData); // Debugging
        setChartData(newChartData);
      };
  
      loadData();
    }, [ctrId]);
  
    return (
      <div>
        <h2 className="StatTitle">Device Report Comparison</h2>
        {chartData ? <Bar data={chartData} /> : <p>Loading chart...</p>}
      </div>
    );
  };
  
  export default CTRBarChart;