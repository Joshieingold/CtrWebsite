import { addDays, format, startOfWeek } from "date-fns";
import React, { useEffect, useState } from "react";
import { fetchCTRReportsForWeek } from "../api.jsx";
import "./weeklytable.css";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const deviceOrder = [
  "XB8", "XB7", "Xi6", "XiOne", "Pods", "Onts", "Camera 1", "Camera 2",
  "Camera 3", "XiOne Entos", "Meraki", "Cradlepoint", "CM8200A", "Coda5810"
];

const CTRWeeklyTable = ({ ctrId }) => {
  const [weeklyData, setWeeklyData] = useState({});

  useEffect(() => {
    const loadReports = async () => {
      const reports = await fetchCTRReportsForWeek(ctrId);
      setWeeklyData(reports);
    };

    loadReports();
  }, [ctrId]);

  // Get start of the current week (Monday)
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  // Generate column headers with actual dates
  const dateHeaders = daysOfWeek.map((_, index) =>
    format(addDays(weekStart, index), "MMM dd")
  );

  // Extract all device names and sort by the predefined order
  const allDevices = Array.from(
    new Set(
      Object.values(weeklyData).flatMap((entry) =>
        Object.keys(entry.deviceCounts || {})
      )
    )
  ).sort((a, b) => deviceOrder.indexOf(a) - deviceOrder.indexOf(b));

  return (
    <div className="ctr-weekly-table-container">
      <table className="ctr-weekly-table">
        <thead>
          <tr>
            <th>Device</th>
            {dateHeaders.map((date, index) => (
              <th key={index} colSpan="3">
                {date} ({daysOfWeek[index]})
              </th>
            ))}
          </tr>
          <tr>
            <th></th>
            {daysOfWeek.map((_, index) => (
              <React.Fragment key={`header-${index}`}>
                <th>Count</th>
                <th>Orders</th>
                <th>+/-</th>
              </React.Fragment>
            ))}
          </tr>
        </thead>
        <tbody className="SnapshotBody">
          {allDevices.map((device) => (
            <tr key={device}>
              <td>{device}</td>
              {daysOfWeek.map((_, index) => {
                const dateKey = format(addDays(weekStart, index), "yyyy-MM-dd");
                const prevDateKey = format(addDays(weekStart, index - 1), "yyyy-MM-dd");

                const entry = weeklyData[dateKey] || {};
                const prevEntry = weeklyData[prevDateKey] || {};

                const count = entry.deviceCounts?.[device] ?? "";
                const orders = entry.deviceOrders?.[device] ?? 0;  // Ensure orders is always a number
                const prevCount = prevEntry.deviceCounts?.[device] ?? count;
                const prevOrders = prevEntry.deviceOrders?.[device] ?? 0;

                // Adjusted +/- Calculation
                const change =
                  prevCount !== "" && count !== "" ? count - (prevCount + prevOrders) : "";

                return (
                  <React.Fragment key={`device-${device}-day-${index}`}>
                    <td>{count}</td>
                    <td>{orders}</td> {/* Ensure this correctly shows deviceOrders */}
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
