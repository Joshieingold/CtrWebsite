import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { fetchDeliveryTrackerData } from "./CtrPage/api.jsx"; // Adjust the path
import "./DeliveryTrackerGraph.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip, // Aliasing Tooltip
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

        // Excluded locations list
        const excludedNames = [
          "1318 Grand Lake Rd", "35 Rue Court", "454 KING GEORGE HWY",
          "55 Expansion Ave", "875 Bayside Drive Unit 3", "70 Assomption Bvd.",
          "1318 Grand Lake Road", "70 Assomption Blvd", "Acadian Peninsula (Caraquet)",
          "454 King George Hwy", "70 Assomption blvd", "106 Whalen Street",
          "2978 Rte 132", "875 Bayside Drive", "EDI Inc", "TRAN NF1_Newfoundland Warehouse",
          "Virtual Location", "1595 North Service Rd E CTDI", "MICHAEL BARNED", "246 Church St"
        ];

        // Filter out excluded names
        const filteredData = Object.entries(data)
          .filter(([name]) => !excludedNames.includes(name)) // Remove excluded names
          .reduce((acc, [name, value]) => {
            acc[name] = value;
            return acc;
          }, {});

        console.log("Filtered Data:", filteredData); // Debugging log

        setChartData({
          labels: Object.keys(filteredData), // Tech names as labels
          datasets: [
            {
              label: "Total Orders", // Chart label
              data: Object.values(filteredData).map(Number), // Convert values to numbers
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
        text: "Delivery Tracker - Total Orders",
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
