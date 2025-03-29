import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { fetchDeviceQuantityData } from "./CtrPage/api.jsx"; // Adjust the path
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
  const [locationFilters, setLocationFilters] = useState({
    SaintJohn: true,
    Moncton: true,
    Fredericton: true,
    Misc: true,
  });

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const data = await fetchDeviceQuantityData();

      console.log("📌 Raw Data from API:", data);

      if (data && Object.keys(data).length > 0) {
        const devicesByTechnician = {};

        Object.entries(data).forEach(([technician, { TotalDevices, Location }]) => {
          console.log(`✅ Processing: ${technician} - Total Devices: ${TotalDevices}, Location: ${Location}`);

          // Check if the location is included in the filters
          const locationLower = Location.toLowerCase(); // Convert to lowercase for case-insensitive comparison
          const isSaintJohn = locationLower.includes("saint john");
          const isMoncton = locationLower.includes("moncton");
          const isFredericton = locationLower.includes("fredericton");

          if (TotalDevices > 0 && (
            (locationFilters.SaintJohn && isSaintJohn) ||
            (locationFilters.Moncton && isMoncton) ||
            (locationFilters.Fredericton && isFredericton) ||
            (locationFilters.Misc && !isSaintJohn && !isMoncton && !isFredericton)
          )) {
            devicesByTechnician[technician] = TotalDevices;
          }
        });

        console.log("🛠️ Processed Data for Chart:", devicesByTechnician);

        if (Object.keys(devicesByTechnician).length === 0) {
          console.warn("⚠️ No valid data to display in the chart.");
          setChartData(null);
        } else {
          setChartData({
            labels: Object.keys(devicesByTechnician),
            datasets: [
              {
                label: "Total Devices Ordered",
                data: Object.values(devicesByTechnician),
                backgroundColor: "rgba(255, 99, 132, 0.6)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 1,
              },
            ],
          });
        }
      } else {
        console.warn("⚠️ No data fetched from API.");
        setChartData(null);
      }
      setLoading(false);
    };

    getData();
  }, [locationFilters]); // Refetch when filters change

  // Function to toggle filters
  const handleFilterChange = (event) => {
    setLocationFilters({
      ...locationFilters,
      [event.target.name]: event.target.checked,
    });
  };

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

      {/* Checkboxes for filtering */}
      <div>
        {Object.keys(locationFilters).map((location) => (
          <label key={location} className="Checkbox-Text">
            <input
              type="checkbox"
              name={location}
              checked={locationFilters[location]}
              onChange={handleFilterChange}
            />
            {location}
          </label>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        chartData && <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default TotalDevicesChart;