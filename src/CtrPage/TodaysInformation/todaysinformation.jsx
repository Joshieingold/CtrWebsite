import React, { useEffect, useState } from "react";
import { fetchLatestCTRReport, fetchPriorCTRReport, FetchCTRDetails } from "../api.jsx";
import { collection, getDocs, query, where, orderBy} from "firebase/firestore";
import { db } from "../firebase"; // Ensure your Firestore instance is correctly imported
import { format } from "date-fns"; // Import the format function from date-fns

import "./todaysinformation.css";

const deviceOrder = [
    "CGM4981COM", "CGM4331COM", "IPTVTCXI6HD", "SCXI11BEI", "XE2SGROG1", "Onts", "Camera 1", "Camera 2",
    "Camera 3", "XiOne Entos", "Meraki", "Cradlepoint", "CM8200A", "Coda5810"
];
function getColorClass(value) {
    if (value > 0) return "positive";
    if (value < 0) return "negative";
    return "neutral";
}

function calculatePercentage(inventory, maxAllowed) {
    if (!maxAllowed || maxAllowed === 0) return 0;
    return (inventory / maxAllowed) * 100;
}
function TodayInfo({ ctrId = "8052" }) {
    const [latestData, setLatestData] = useState(null);
    const [priorData, setPriorData] = useState(null);
    const [ctrDetails, setCTRDetails] = useState(null);
    const [mostRecentOrderTime, setMostRecentOrderTime] = useState(null);
    const [orderDetails, setOrderDetails] = useState([]); // To store order details (device and quantity)

    useEffect(() => {
        const loadReports = async () => {
            try {
                if (!ctrId) throw new Error("Missing CTR ID");
        
                const [latestReport, priorReport, ctrInfo] = await Promise.all([ 
                    fetchLatestCTRReport(ctrId), 
                    fetchPriorCTRReport(ctrId), 
                    FetchCTRDetails(ctrId) 
                ]);
        
                setLatestData(latestReport);
                setPriorData(priorReport);
                setCTRDetails(ctrInfo);
        
                const reportsWithOrders = await getReportsWithOrders(ctrId);
        
                if (reportsWithOrders.length > 0) {
                    const mostRecentOrderReport = reportsWithOrders[0];
                    setMostRecentOrderTime(mostRecentOrderReport.dateSubmitted);
        
                    // ✅ Only include orders where quantity > 0
                    setOrderDetails(
                        Object.entries(mostRecentOrderReport.deviceOrders || {}).filter(([_, quantity]) => quantity > 0)
                    );
                }
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };
        

        loadReports();
    }, [ctrId]);

    // Function to get reports with orders
    const getReportsWithOrders = async (ctrId) => {
        try {
            const reportsRef = collection(db, "CTR-Reports");
            const q = query(
                reportsRef,
                where("ctrId", "==", ctrId),
                orderBy("dateSubmitted", "desc")
            );
    
            const querySnapshot = await getDocs(q);
            const reportsWithOrders = [];
    
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const deviceOrders = data.deviceOrders || {};
                
                // Check if any device order is greater than 0
                const hasRealOrders = Object.values(deviceOrders).some(value => value > 0);
                
                if (hasRealOrders) {
                    reportsWithOrders.push(data);
                }
            });
    
            return reportsWithOrders;
        } catch (error) {
            console.error("Error fetching reports with orders:", error);
            return [];
        }
    };

    if (!latestData || !ctrDetails) {
        return <div>Loading latest inventory data...</div>;
    }

    const { date = "Unknown Date", deviceCounts = {}, deviceOrders = {} } = latestData;
    const { date: priorDate = "Unknown Date", deviceCounts: priorDeviceCounts = {}, deviceOrders: priorDeviceOrders = {} } = priorData || {};
    const { deviceLimits = {} } = ctrDetails;

    const deviceList = Object.keys(deviceCounts).sort((a, b) => {
        const indexA = deviceOrder.indexOf(a);
        const indexB = deviceOrder.indexOf(b);
        if (indexA === -1 && indexB === -1) return a.localeCompare(b);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    // Format the most recent order date
    const formattedDate = mostRecentOrderTime
        ? format(mostRecentOrderTime.toDate(), "MMMM dd, yyyy")
        : "";

    return (
        <div className="TodayInfoMain">
            <div className="SmallDataContainer">
                <div className="SmallDataCard">
                    <p className="SmallDataTitle">Last Order</p>
                    {mostRecentOrderTime ? (
                        <div className="SmallDataContent">
                            
                            <ul>
                                {orderDetails.map(([device, quantity], index) => (
                                    <li key={index}>
                                        {device}: {quantity}
                                    </li>
                                ))}
                            </ul>
                            
                        </div>
                        
                    ) : (
                        <p className="SmallDataText">No orders found in any report</p>
                    )}
                    <p className="SmallDataText">
                                Completed on {formattedDate}.
                            </p>
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
                                    const priorInventory = priorDeviceCounts[device] || 0;
                                    const priorOrders = priorDeviceOrders[device] || 0;
                                    const maxAllowed = deviceLimits[device] || 50;
                                    const gainLoss = inventory - (priorInventory + priorOrders);

                                    return (
                                        <tr key={index}>
                                            <td>{device}</td>
                                            <td>{inventory}</td>
                                            <td>{maxAllowed}</td>
                                            <td className={getColorClass(gainLoss)}>
                                                {gainLoss}
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
                            const maxAllowed = deviceLimits[device] || 50;
                            const percentage = calculatePercentage(inventory, maxAllowed);
                            
                            return (
                                <div key={index} className="ProgressContainer">
                                    <p>{device}: {percentage.toFixed(2)}%</p>
                                    <div className="ProgressBarBackground">
                                        <div
                                            className="ProgressBar"
                                            style={{ width: `${Math.min(100, percentage)}%`}}
                                        />
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
