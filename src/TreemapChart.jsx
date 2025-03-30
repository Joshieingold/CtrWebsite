import React, { useState, useEffect } from "react";
import { fetchWaybillData } from "./CtrPage/api.jsx";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";
import "./TreemapChart.css"

// Custom Tooltip
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  
  const { name, totalWeight, size } = payload[0].payload;

  return (
    <div 
      style={{ 
        backgroundColor: "rgba(0,0,0,0.7)", 
        color: "white", 
        padding: "5px", 
        borderRadius: "5px" 
      }}
    >
      <p>{`Waybill: ${name}`}</p>
      <p>{`Total Weight: ${totalWeight} kg`}</p>
      <p>{`Associated Boxes: ${size}`}</p>
    </div>
  );
};

// Function to group waybills by type
const categorizeWaybill = (name) => {
  if (name?.startsWith("STJ")) return "Day&Ross Shipments";
  if (/^\d+$/.test(name)) return "Purolator Shipments";
  if (name?.includes("Pickup")) return "Pickup Orders";
  return "Pickup Orders"; // Default category
};

// Function to get color for each group
const getColor = (category) => {
  const colorMap = {
    "Day&Ross Shipments": "rgba(230, 124, 25, 0.83)",  // Orange
    "Purolator Shipments": "rgba(31, 181, 201, 0.83)", // Blue
    "Pickup Orders": "rgba(212, 24, 56, 0.83)", // Red
    "Other": "#00C49F" // Green
  };
  return colorMap[category] || "#000000";
};

const WaybillTreemap = () => {
  const [treemapData, setTreemapData] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchWaybillData();

        // Group data by category
        const groupedData = data.reduce((acc, item) => {
          const category = categorizeWaybill(item.name);
          if (!acc[category]) acc[category] = [];
          acc[category].push({
            name: item.name,
            size: item.size || 1,
            totalWeight: item.totalWeight || 0,
            fill: getColor(category),
          });
          return acc;
        }, {});

        // Calculate statistics for each category
        const totalBoxes = data.reduce((sum, item) => sum + (item.size || 1), 0);
        const stats = Object.keys(groupedData).map((category) => {
          const categoryBoxes = groupedData[category].reduce((sum, item) => sum + item.size, 0);
          return {
            name: category,
            percentage: ((categoryBoxes / totalBoxes) * 100).toFixed(2),
            totalBoxes: categoryBoxes,
          };
        });

        // Convert grouped data into hierarchical structure
        const formattedData = {
          name: "Waybills",
          children: Object.keys(groupedData).map((category) => ({
            name: category,
            children: groupedData[category],
          })),
        };

        console.log("Grouped Treemap Data: ", formattedData);
        setTreemapData(formattedData);
        setCategoryStats(stats);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    getData();
  }, []);

  return (
    <div className="Data-Container">
      <ResponsiveContainer className="Tree" width="100%" height={600}>
        <Treemap
          data={treemapData.children}
          dataKey="size"
          stroke="#fff"
          fill="rgba(255, 255, 255, 0)"
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
      <div className="Data-Breakdown"> 
        {categoryStats.map((stat) => (
          <div className="small-graph-bubble" key={stat.name}>
            <h3>{stat.name}</h3>
            <div>
              <p>{stat.percentage}% of orders</p>
              <p>{stat.totalBoxes} Boxes Sent</p>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaybillTreemap;
