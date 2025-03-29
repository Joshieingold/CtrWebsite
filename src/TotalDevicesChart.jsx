import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { fetchDeliveryTrackerData, fetchDeviceQuantityData} from "./CtrPage/api.jsx"; // Adjust the path
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as NewToolTip,
  Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, NewToolTip, Legend);

const TotalDevicesChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      const data = await fetchDeviceQuantityData();
      if (data) {
        console.log("Fetched Data: ", data);
  
        const devicesByTechnician = {};
  
        const excludedNames = ["1318 Grand Lake Rd","35 Rue Court","454 KING GEORGE HWY","55 Expansion Ave", "875 Bayside Drive Unit 3","70 Assomption Bvd.", "1318 Grand Lake Road","70 Assomption Blvd","Acadian Peninsula (Caraquet)", "454 King George Hwy", "70 Assomption blvd","106 Whalen Street", "2978 Rte 132", "875 Bayside Drive", "EDI Inc", "TRAN NF1_Newfoundland Warehouse", "Virtual Location", "1595 North Service Rd E CTDI", "MICHAEL BARNED", "246 Church St"]; // Add names to exclude

        Object.entries(data).forEach(([technician, totalDevices]) => {
        if (!excludedNames.includes(technician)) {  // Exclude names in the list
            devicesByTechnician[technician] = Number(totalDevices);
        }
        });

  
        console.log("Processed Data:", devicesByTechnician);
        console.log("Chart Labels:", Object.keys(devicesByTechnician));
        console.log("Chart Data:", Object.values(devicesByTechnician));
  
        setChartData({
          labels: Object.keys(devicesByTechnician),
          datasets: [
            {
              label: "Total Devices Ordered",
              data: Object.values(devicesByTechnician).map((value) => Number(value)), // Ensure numeric
              backgroundColor: "rgba(255, 99, 132, 0.6)",
              borderColor: "rgba(255, 99, 132, 1)",
              borderWidth: 1,
            },
          ],
        });
      }
      setLoading(false);
    };
  
    getData();
  }, []);
  


  // Chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Total Devices Ordered Per Technician",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Devices: ${tooltipItem.raw}`;
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
          text: "Total Devices",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container">
      <h2>Total Devices Ordered</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        chartData && <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default TotalDevicesChart;
