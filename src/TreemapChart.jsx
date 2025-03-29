import React, { useState, useEffect } from "react";
import { fetchWaybillData } from "./CtrPage/api.jsx";
import { Treemap, ResponsiveContainer, Tooltip } from "recharts";

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
  if (name?.startsWith("STJ")) return "STJ Shipments";
  if (/^\d+$/.test(name)) return "Numeric Waybills";
  if (name?.includes("pickup")) return "Pickup Orders";
  return "Other"; // Default category
};

// Function to get color for each group
const getColor = (category) => {
  const colorMap = {
    "STJ Shipments": "#ff7300",  // Orange
    "Numeric Waybills": "#8884d8", // Blue
    "Pickup Orders": "#ff0000", // Red
    "Other": "#00C49F" // Green
  };
  return colorMap[category] || "#000000";
};

const WaybillTreemap = () => {
  const [treemapData, setTreemapData] = useState([]);

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

        // Convert grouped data into hierarchical structure
        const formattedData = {
          name: "Waybills",
          children: Object.keys(groupedData).map((category) => ({
            name: category,
            children: groupedData[category]
          })),
        };

        console.log("Grouped Treemap Data: ", formattedData);
        setTreemapData(formattedData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    getData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Treemap
        data={treemapData.children}
        dataKey="size"
        stroke="#fff"
        fill="#8884d8"
      >
        <Tooltip content={<CustomTooltip />} />
      </Treemap>
    </ResponsiveContainer>
  );
};

export default WaybillTreemap;
