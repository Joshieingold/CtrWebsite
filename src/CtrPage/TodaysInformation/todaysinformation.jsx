import React, { useEffect, useState } from "react";
import { fetchLatestCTRReport } from "../api.jsx";
import "./todaysinformation.css";

function getColorClass(value) {
    if (value > 0) return "positive";
    if (value < 0) return "negative";
    return "neutral";
}

function calculatePercentage(inventory, maxAllowed) {
    if (!maxAllowed || maxAllowed === 0) return 0;
    return (inventory / maxAllowed) * 100;
}

function TodayInfo({ ctrId = "8017" }) { // Provide a default CTR ID
    const [latestData, setLatestData] = useState(null);

    useEffect(() => {
        const loadLatestReport = async () => {
            if (!ctrId) {
                console.error("Missing CTR ID");
                return;
            }
            try {
                const report = await fetchLatestCTRReport(ctrId);
                setLatestData(report);
            } catch (error) {
                console.error("Error fetching latest report:", error);
            }
        };

        loadLatestReport();
    }, [ctrId]); // Dependency added for reloading when `ctrId` changes

    if (!latestData) {
        return <div>Loading latest inventory data...</div>;
    }

    const { date = "Unknown Date", deviceCounts = {}, deviceOrders = {} } = latestData;
    const deviceList = Object.keys(deviceCounts);
    
    return (
        <div className="TodayInfoMain">
            <div className="SmallDataContainer">
                <div className="SmallDataCard">
                    <p className="SmallDataTitle">Last Order</p>
                    <div className="SmallDataContent">
                        <h3 className="SmallDataContentHeader">
                            Number of Picks: {Object.keys(deviceOrders).length}
                        </h3>
                        {Object.entries(deviceOrders).map(([device, amount]) => (
                            <p key={device} className="SmallDataText">{device}: {amount}</p>
                        ))}
                    </div>
                    <p className="SmallDataText">Completed on {date}</p>
                </div>
            </div>

            <div className="BigDataContainer">
                <div className="BigDataCard">
                    <div className="BigTitle">Contractor Current Inventory</div>
                    <div className="BigDataContent">
                        <table>
                            <thead>
                                <tr>
                                    <th>Device</th>
                                    <th>Inventory</th>
                                    <th>Max Allowed</th>
                                    <th>Gain/Loss</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deviceList.map((device, index) => {
                                    const inventory = deviceCounts[device] || 0;
                                    const maxAllowed = 50; // Replace with actual logic
                                    return (
                                        <tr key={index}>
                                            <td>{device}</td>
                                            <td>{inventory}</td>
                                            <td>{maxAllowed}</td>
                                            <td className={getColorClass(inventory - maxAllowed)}>
                                                {inventory - maxAllowed}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="BigDataCard">
                    <div className="BigTitle">Inventory Capacity</div>
                    <div className="BigDataContent">
                        {deviceList.map((device, index) => {
                            const inventory = deviceCounts[device] || 0;
                            const maxAllowed = 50; // Replace with actual logic
                            const percentage = calculatePercentage(inventory, maxAllowed);
                            return (
                                <div key={index} className="ProgressContainer">
                                    <p>{device}: {percentage.toFixed(2)}%</p>
                                    <div className="ProgressBarBackground">
                                        <div
                                            className="ProgressBar"
                                            style={{ width: `${Math.min(100, percentage)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TodayInfo;
