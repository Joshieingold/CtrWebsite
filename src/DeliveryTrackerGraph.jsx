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
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

const DeliveryTrackerGraph= () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    saintJohn: true,
    moncton: true,
    fredericton: true,
    misc: true,
  });

  useEffect(() => {
    const getData = async () => {
      const data = await fetchDeliveryTrackerData();
      if (data) {
        console.log("Fetched Data: ", data);

        const excludedNames = [
          "1318 Grand Lake Rd", "35 Rue Court", "454 KING GEORGE HWY",
          "55 Expansion Ave", "875 Bayside Drive Unit 3", "70 Assomption Bvd.",
          "1318 Grand Lake Road", "70 Assomption Blvd", "Acadian Peninsula (Caraquet)",
          "454 King George Hwy", "70 Assomption blvd", "106 Whalen Street",
          "2978 Rte 132", "875 Bayside Drive", "EDI Inc", "TRAN NF1_Newfoundland Warehouse",
          "Virtual Location", "1595 North Service Rd E CTDI", "MICHAEL BARNED", "246 Church St"
        ];

        // Step 1: Filter out excluded names
        let filteredData = Object.entries(data)
          .filter(([name, details]) => !excludedNames.includes(name)) // Exclude names
          .filter(([_, details]) => {
            const location = details.Location || "";
            return (
              (filters.saintJohn && location.includes("Saint John")) ||
              (filters.moncton && location.includes("Moncton")) ||
              (filters.fredericton && location.includes("Fredericton")) ||
              (filters.misc && !["Saint John", "Moncton", "Fredericton"].some(city => location.includes(city)))
            );
          })
          .reduce((acc, [name, value]) => {
            acc[name] = value.TotalOrders || 0; // Make sure we use the correct field
            return acc;
          }, {});


        setChartData({
          labels: Object.keys(filteredData),
          datasets: [
            {
              label: "Total Orders",
              data: Object.values(filteredData).map(Number),
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      }
      setLoading(false);
    };

    getData();
  }, [filters]); // Refetch when filters change

  // Function to handle checkbox toggle
  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prev) => ({ ...prev, [name]: checked }));
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: false,
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
      
      y: {
        title: {
          display: true,
          text: "Orders",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container">
      <h2 className="title-text">Total Orders Requested</h2>

      {/* Checkbox Filters */}
      <div className="filter-section">
        <label className="Checkbox-Text">
          <input
            type="checkbox"
            name="saintJohn"
            checked={filters.saintJohn}
            onChange={handleFilterChange}
          />
          Saint John
        </label>

        <label className="Checkbox-Text">
          <input
            type="checkbox"
            name="moncton"
            checked={filters.moncton}
            onChange={handleFilterChange}
          />
          Moncton
        </label>

        <label className="Checkbox-Text">
          <input
            type="checkbox"
            name="fredericton"
            checked={filters.fredericton}
            onChange={handleFilterChange}
          />
          Fredericton
        </label>

        <label className="Checkbox-Text">
          <input
            type="checkbox"
            name="misc"
            checked={filters.misc}
            onChange={handleFilterChange}
          />
          Purolator   
        </label>
      </div>

      {loading ? <p>Loading...</p> : chartData && <Bar data={chartData} options={options} />}
    </div>
  );
};

export default DeliveryTrackerGraph;
