import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./CtrPage/firebase.jsx";
import "./WaybillTable.css";

const WaybillTable = () => {
  const [data, setData] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");

  const excludedNames = [
    "1318 Grand Lake Rd", "35 Rue Court", "454 KING GEORGE HWY",
    "55 Expansion Ave", "875 Bayside Drive Unit 3", "70 Assomption Bvd.",
    "1318 Grand Lake Road", "70 Assomption Blvd", "Acadian Peninsula (Caraquet)",
    "454 King George Hwy", "70 Assomption blvd", "106 Whalen Street",
    "2978 Rte 132", "875 Bayside Drive", "EDI Inc", "TRAN NF1_Newfoundland Warehouse",
    "Virtual Location", "1595 North Service Rd E CTDI", "MICHAEL BARNED", "246 Church St"
  ];

  useEffect(() => {
    const fetchWaybillData = async () => {
      try {
        const deliveryRef = collection(db, "DeliveryTracker");
        const querySnapshot = await getDocs(deliveryRef);
        let waybillData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const dateCompleted = data.DateCompleted?.toDate();
          if (excludedNames.includes(data.TechName)) return;

          // Determine Location Category
          let locationCategory = "Other";
          if (data.Location?.includes("Saint John")) locationCategory = "Saint John";
          else if (data.Location?.includes("Moncton")) locationCategory = "Moncton";
          else if (data.Location?.includes("Fredericton")) locationCategory = "Fredericton";

          waybillData.push({
            waybill: data.Waybill || "Unknown",
            boxes: data.Boxes || 0,
            weight: data.Weight || 0,
            date: dateCompleted ? dateCompleted.toISOString().split("T")[0] : "N/A",
            Technician: data.TechName || "Unknown Tech",
            Location: locationCategory, // Store categorized location
          });
        });

        setData(waybillData);
      } catch (error) {
        console.error("❌ Error fetching waybill data:", error);
      }
    };

    fetchWaybillData();
  }, []);

  // Apply filters
  const filteredData = data
    .filter((item) => item.waybill.toLowerCase().includes(filterText.toLowerCase()))
    .filter((item) => {
      if (!fromDate && !toDate) return true;
      const itemDate = new Date(item.date);
      return (
        (!fromDate || itemDate >= new Date(fromDate)) &&
        (!toDate || itemDate <= new Date(toDate))
      );
    })
    .filter((item) => locationFilter === "All" || item.Location === locationFilter);

  // Define columns
  const columns = [
    { name: "Waybill", selector: (row) => row.waybill, sortable: true },
    { name: "Total Boxes", selector: (row) => row.boxes, sortable: true },
    { name: "Total Weight", selector: (row) => `${row.weight} lb`, sortable: true }, // ✅ Add "lb"
    { name: "Technician", selector: (row) => row.Technician, sortable: true },
    { name: "Location", selector: (row) => row.Location, sortable: true }, // ✅ Display location
    { name: "Date Completed", selector: (row) => row.date, sortable: true },
  ];

  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <h2 className="title-text">Shipment Data</h2>

      <div className="search-customization-container">
        <div className="date-container">
          <p>Search Waybill:</p>
          <input
            type="text"
            placeholder="Search Waybill..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="text-input"
          />
        </div>

        <div className="date-container">
          <p>Filter by Location:</p>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="text-input"
          >
            <option value="All">All</option>
            <option value="Saint John">Saint John</option>
            <option value="Moncton">Moncton</option>
            <option value="Fredericton">Fredericton</option>
            <option value="Other">Other</option>
          </select>
        </div>
                <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <div className="date-container">
            <p>From Date:</p>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div className="date-container">
            <p>To Date:</p>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>
        </div>


      </div>

      <div style={{ width: "100%", overflowX: "auto" }}>
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          striped
          customStyles={{
            table: {
              style: {
                width: "100%",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default WaybillTable;
