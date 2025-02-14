import "./todaysinformation.css";

function getColorClass(value) {
    if (value > 0) return "positive";
    if (value < 0) return "negative";
    return "neutral";
}

function calculatePercentage(inventory, maxAllowed) {
    // If maxAllowed is not provided or 0, return 0 to prevent division by zero
    if (!maxAllowed || maxAllowed === 0) return 0;
    return (inventory / maxAllowed) * 100;
}

function TodayInfo() {
    const devicesData = [
        { name: 'XB8', inventory: 22, maxAllowed: 24 },
        { name: 'XB7', inventory: 69, maxAllowed: 54 },
        { name: 'XI6', inventory: 47, maxAllowed: 75 },
        { name: 'XIONE', inventory: 9, maxAllowed: 75 },
        { name: 'PODS', inventory: 46, maxAllowed: 30 },
        { name: 'ONTS', inventory: 0, maxAllowed: 0 },
        { name: 'SCHB1AEW', inventory: 11, maxAllowed: 20 },
        { name: 'SCHC2AEW', inventory: 9, maxAllowed: 20 },
        { name: 'SCHC3AEW', inventory: 5, maxAllowed: 20 },
        { name: 'XIONE - ENTOS', inventory: 50, maxAllowed: 0 }, // Example without maxAllowed
        { name: 'MR36HW', inventory: 2, maxAllowed: 0 },
        { name: 'S5A134A', inventory: 3, maxAllowed: 0 },
        { name: 'CM8200A', inventory: 16, maxAllowed: 0 },
        { name: 'CODA5810', inventory: 40, maxAllowed: 0 }
    ];

    return (
        <div className="TodayInfoMain">
            <div className="SmallDataContainer">
                
                    <div className="SmallDataCard">
                        <p className="SmallDataTitle">Last Order</p>
                        <div className="SmallDataContent">
                            <h3 className="SmallDataContentHeader">Number of Picks: 2</h3>
                            <p className="SmallDataText">S5A134A: 5</p>
                            <p className="SmallDataText">CODA5810: 5</p>
                        </div>
                        <p className="SmallDataText">Completed on January 15 2025</p>
                    </div>
                    <div className="SmallDataCard">
                        <p className="SmallDataTitle">Data Title</p>
                        <div className="SmallDataContent">
                            <h3 className="SmallDataContentHeader">Main Point</h3>
                            <p className="SmallDataText">subdata</p>
                            <p className="SmallDataText">subdata</p>
                        </div>
                        <p className="SmallDataText">Final Point</p>
                    </div>
                    <div className="SmallDataCard">
                        <p className="SmallDataTitle">Data Title</p>
                        <div className="SmallDataContent">
                            <h3 className="SmallDataContentHeader">Main Point</h3>
                            <p className="SmallDataText">subdata</p>
                            <p className="SmallDataText">subdata</p>
                        </div>
                        <p className="SmallDataText">Final Point</p>
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
                                    <th>+/-</th>
                                </tr>
                            </thead>
                            <tbody>
                                {devicesData.map((device, index) => (
                                    <tr key={index}>
                                        <td>{device.name}</td>
                                        <td>{device.inventory}</td>
                                        <td>{device.maxAllowed}</td>
                                        <td className={getColorClass(device.inventory - device.maxAllowed)}>
                                            {device.inventory - device.maxAllowed}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="BigDataCard">
                    <div className="BigTitle">Inventory Capacity</div>
                    <div className="BigDataContent">
                        {devicesData.map((device, index) => {
                            const percentage = calculatePercentage(device.inventory, device.maxAllowed);
                            return (
                                <div key={index} className="ProgressContainer">
                                    <p>{device.name}: {percentage.toFixed(2)}%</p>
                                    <div className="ProgressBarBackground">
                                        <div
                                            className="ProgressBar"
                                            style={{ width: `${percentage > 100 ? 100 : percentage}%` }}
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
