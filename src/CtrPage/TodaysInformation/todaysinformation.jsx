import "./todaysinformation.css";

function getColorClass(value) {
    if (value > 0) return "positive"; // Light green for positive
    if (value < 0) return "negative"; // Light red for negative
    return "neutral"; // Black for zero
}

function TodayInfo() {
    return (
        <div className="TodayInfoMain">
            <div className="SmallDataContainer">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="SmallDataCard">
                        <p className="SmallDataTitle">Data Title</p>
                        <div className="SmallDataContent">
                            <h3 className="SmallDataContentHeader">Main Point</h3>
                            <p className="SmallDataText">subdata</p>
                            <p className="SmallDataText">subdata</p>
                        </div>
                        <p className="SmallDataText">Final Point</p>
                    </div>
                ))}
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
                                    <th>Maximum</th>
                                    <th>Yesterday +/-</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>XB8</td>
                                    <td>22</td>
                                    <td>24</td>
                                    <td className={getColorClass(-3)}>-3</td>
                                </tr>
                                <tr>
                                    <td>XB7</td>
                                    <td>69</td>
                                    <td>54</td>
                                    <td className={getColorClass(0)}>0</td>
                                </tr>
                                <tr>
                                    <td>XI6</td>
                                    <td>47</td>
                                    <td>75</td>
                                    <td className={getColorClass(0)}>0</td>
                                </tr>
                                <tr>
                                    <td>XIONE</td>
                                    <td>9</td>
                                    <td>75</td>
                                    <td className={getColorClass(0)}>0</td>
                                </tr>
                                <tr>
                                    <td>PODS</td>
                                    <td>46</td>
                                    <td>30</td>
                                    <td className={getColorClass(0)}>0</td>
                                </tr>
                                <tr>
                                    <td>ONTS</td>
                                    <td>0</td>
                                    <td>0</td>
                                    <td className={getColorClass(0)}>0</td>
                                </tr>
                                <tr>
                                    <td>SCHB1AEW</td>
                                    <td>11</td>
                                    <td>20</td>
                                    <td className={getColorClass(0)}>0</td>
                                </tr>
                                <tr>
                                    <td>SCHC2AEW</td>
                                    <td>9</td>
                                    <td>20</td>
                                    <td className={getColorClass(0)}>0</td>
                                </tr>
                                <tr>
                                    <td>SCHC3AEW</td>
                                    <td>5</td>
                                    <td>20</td>
                                    <td className={getColorClass(0)}>0</td>
                                </tr>
                                <tr>
                                    <td>XIONE - ENTOS</td>
                                    <td>50</td>
                                    <td></td>
                                    <td className={getColorClass(0)}>0</td>
                                </tr>
                                <tr>
                                    <td>MR36HW</td>
                                    <td>2</td>
                                    <td></td>
                                    <td className={getColorClass(0)}>0</td>
                                </tr>
                                <tr>
                                    <td>S5A134A</td>
                                    <td>3</td>
                                    <td></td>
                                    <td className={getColorClass(0)}>0</td>
                                </tr>
                                <tr>
                                    <td>CM8200A</td>
                                    <td>16</td>
                                    <td></td>
                                    <td className={getColorClass(0)}>0</td>
                                </tr>
                                <tr>
                                    <td>CODA5810</td>
                                    <td>40</td>
                                    <td></td>
                                    <td className={getColorClass(0)}>0</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="BigDataCard">
                    <div className="BigTitle">Data Title</div>
                    <div className="BigDataContent">
                        <div>Please</div>
                        <div>Work</div>
                        <div>Now</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TodayInfo;
