import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2"; // Import from chart.js
import { fetchDeliveryTrackerData } from "./CtrPage/api.jsx"; // Adjust the path
import "./DeliveryTrackerGraph.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const DeliveryTrackerChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchDeliveryTrackerData();
      if (data) {
        console.log("Fetched Data: ", data); // Logging data to verify format

        // Prepare data for the chart
        const techNames = Object.keys(data); // Technicians' names
        const orderCounts = Object.values(data); // Order counts

        setChartData({
          labels: techNames, // Technician names as chart labels
          datasets: [
            {
              label: "Total Orders", // Chart label
              data: orderCounts, // Order counts as data
              backgroundColor: "rgba(75, 192, 192, 0.6)", // Bar color
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      }
      setLoading(false);
    };

    getData();
  }, []);

  // Default chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Delivery Tracker - Total Orders',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Orders: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Technician",
        },
      },
      y: {
        title: {
          display: true,
          text: "Orders",
        },
        beginAtZero: true, // Make sure the Y-axis starts at 0
      },
    },
  };

  return (
    <div className="chart-container">
      <h2>Delivery Tracker - Total Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        chartData && <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default DeliveryTrackerChart;
