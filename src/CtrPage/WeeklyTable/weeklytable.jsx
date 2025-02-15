import { addDays, format, startOfWeek } from "date-fns";
import React, { useEffect, useState } from 'react';
import { fetchCTRReportsForWeek } from "../api.jsx";
import "./weeklytable.css";
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

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

  // Extract all device names from data
  const allDevices = new Set();
  Object.values(weeklyData).forEach((entry) => {
    Object.keys(entry.deviceCounts || {}).forEach((device) => allDevices.add(device));
    

  });

  return (
    <div className="weekly-table-container">
      <table>
        <thead>
          <tr>
            <th>Device</th>
            {dateHeaders.map((date, index) => (
              <th key={index} colSpan="3">{date} ({daysOfWeek[index]})</th>
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
        <tbody>
          {[...allDevices].map((device) => (
            <tr key={device}>
              <td>{device}</td>
              {daysOfWeek.map((_, index) => {
                const dateKey = format(addDays(weekStart, index), "yyyy-MM-dd");
                const entry = weeklyData[dateKey] || {};
                const prevEntry = weeklyData[format(addDays(weekStart, index - 1), "yyyy-MM-dd")] || {};

                const count = entry.deviceCounts?.[device] ?? "";
                const orders = entry.deviceOrders?.[device] ?? "";
                const prevCount = prevEntry.deviceCounts?.[device] ?? count;
                const change = prevCount !== "" && count !== "" ? count - prevCount : "";

                return (
                  <React.Fragment key={`device-${device}-day-${index}`}>
                    <td>{count}</td>
                    <td>{orders}</td>
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
