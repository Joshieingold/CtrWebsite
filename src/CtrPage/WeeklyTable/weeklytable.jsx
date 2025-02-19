import { addDays, format, parse } from "date-fns";
import React, { useEffect, useState } from "react";
import { fetchCTRReportsForWeek } from "../api.jsx"; // Ensure this function is modified for date ranges
import "./weeklytable.css";

// Define the days of the week for display purposes.
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// Define the order in which devices should be displayed in the table.
const deviceOrder = [
  "XB8", "XB7", "Xi6", "XiOne", "Pods", "Onts", "Camera 1", "Camera 2",
  "Camera 3", "XiOne Entos", "Meraki", "Cradlepoint", "CM8200A", "Coda5810"
];

const CTRWeeklyTable = ({ ctrId }) => {
  // State to store the weekly CTR data and selected date range.
  const [weeklyData, setWeeklyData] = useState({});
  const [startDate, setStartDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 6), "yyyy-MM-dd"));

  // useEffect hook to load reports when the component mounts or when ctrId or date range changes.
  useEffect(() => {
    const loadReports = async () => {
      // Pass the startDate and endDate to the Firestore query function
      const reports = await fetchCTRReportsForWeek(ctrId, startDate, endDate);
      setWeeklyData(reports);
    };

    loadReports();
  }, [ctrId, startDate, endDate]); // Re-run the effect when ctrId or the date range changes.

  // Generate column headers with actual dates (e.g., "Jan 01") based on the selected date range.
  const dateHeaders = Array.from({ length: 5 }, (_, index) => {
    const date = addDays(parse(startDate, "yyyy-MM-dd", new Date()), index);
    return format(date, "MMM dd");
  });

  // Extract all device names from the weekly data and sort them according to deviceOrder.
  const allDevices = Array.from(
    new Set(
      Object.values(weeklyData).flatMap((entry) =>
        Object.keys(entry.deviceCounts || {})
      )
    )
  ).sort((a, b) => deviceOrder.indexOf(a) - deviceOrder.indexOf(b));

  return (
    <div className="ctr-weekly-table-container">
      {/* Date Range Picker */}
      <div className="date-range-picker">
        <label>
          Start Date: 
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)} 
          />
        </label>
        <label>
          End Date: 
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)} 
          />
        </label>
      </div>

      <table className="ctr-weekly-table">
        <thead>
          {/* Header row for dates */}
          <tr>
            <th>Device</th>
            {dateHeaders.map((date, index) => (
              <th key={index} colSpan="3">
                {date}
              </th>
            ))}
          </tr>
          {/* Header row for Inventory, Ordered, and +/- */}
          <tr>
            <th></th>
            {daysOfWeek.map((_, index) => (
              <React.Fragment key={`header-${index}`}>
                <th>Inventory</th>
                <th>Ordered</th>
                <th>+/-</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody className="SnapshotBody">
          {/* Rows for each device */}
          {allDevices.map((device) => (
            <tr key={device}>
              <td>{device}</td>
              {/* Cells for each day of the week */}
              {daysOfWeek.map((_, index) => {
                // Calculate the date keys for the current and previous days.
                const dateKey = format(addDays(parse(startDate, "yyyy-MM-dd", new Date()), index), "yyyy-MM-dd");
                const prevDateKey = format(addDays(parse(startDate, "yyyy-MM-dd", new Date()), index - 1), "yyyy-MM-dd");

                // Retrieve the data entries for the current and previous days.
                const entry = weeklyData[dateKey] || {};
                const prevEntry = weeklyData[prevDateKey] || {};

                // Get the device counts and orders for the current and previous days.
                const count = entry.deviceCounts?.[device] ?? "";
                const orders = entry.deviceOrders?.[device] ?? 0;  // Ensure orders is always a number, default to 0.
                const prevCount = prevEntry.deviceCounts?.[device] ?? count;
                const prevOrders = prevEntry.deviceOrders?.[device] ?? 0;

                // Calculate the change in count from the previous day (adjusting for orders).
                const change =
                  prevCount !== "" && count !== "" ? count - (prevCount + prevOrders) : "";

                return (
                  <React.Fragment key={`device-${device}-day-${index}`}>
                    <td>{count}</td>
                    <td>{orders}</td> {/* Display the device orders for the current day. */}
                    {/* Apply styling based on whether the change is positive, negative, or neutral. */}
                    <td className={change > 0 ? "positive" : change < 0 ? "negative" : ""}>
                      {change}
                    </td>
                  </React.Fragment>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CTRWeeklyTable;
