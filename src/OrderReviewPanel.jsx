import { useState, useEffect } from "react";
import { db } from "./CtrPage/firebase.jsx";
import { collection, getDocs, updateDoc, doc, addDoc, deleteDoc, setDoc } from "firebase/firestore";

const OrderReviewPanel = () => {
    const [orders, setOrders] = useState([]);
    const [techMap, setTechMap] = useState({}); // To store tech names and their locations
    const [techNames, setTechNames] = useState([]); // To store tech names for auto-fill

    useEffect(() => {
        const fetchTechs = async () => {
            try {
                const techRef = collection(db, "TechDatabase");
                const querySnapshot = await getDocs(techRef);
                const techs = {};
                const names = [];
                querySnapshot.docs.forEach(doc => {
                    const data = doc.data();
                    techs[data.Name] = data.Location || ""; // Store location in techMap
                    names.push(data.Name); // Collect tech names for auto-fill
                });
                setTechMap(techs);
                setTechNames(names);
            } catch (error) {
                console.error("Error fetching techs:", error);
            }
        };

        const fetchOrders = async () => {
          try {
              const tempOrdersRef = collection(db, "TempDelivery");
              const querySnapshot = await getDocs(tempOrdersRef);
              let orderList = [];
              querySnapshot.forEach((doc) => {
                  const data = doc.data();
                  // Convert Firestore timestamp to JavaScript Date
                  const dateCompleted = data.DateCompleted ? data.DateCompleted.toDate().toISOString().slice(0, 16) : "";
                  orderList.push({ id: doc.id, ...data, DateCompleted: dateCompleted });
              });
      
              // Update locations based on techMap dynamically
              orderList = orderList.map(order => {
                  const techLocation = techMap[order.TechName]; // Check if tech exists in techMap
                  return {
                      ...order,
                      Location: techLocation || order.Location // Use tech location if exists, otherwise keep existing location
                  };
              });
      
              setOrders(orderList);
          } catch (error) {
              console.error("Error fetching orders:", error);
          }
        };
      
        fetchTechs();
        fetchOrders();
    }, []); 

    const handleEdit = (id, field, value) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) => {
                if (order.id === id) {
                    if (field === "TechName") {
                        // Autofill Location if tech name exists
                        return { ...order, [field]: value, Location: techMap[value] || order.Location };
                    } else if (field.startsWith("Devices.")) {
                        // Handle device editing
                        const deviceName = field.split('.')[1];
                        return {
                            ...order,
                            Devices: {
                                ...order.Devices,
                                [deviceName]: value
                            }
                        };
                    }
                    return { ...order, [field]: value };
                }
                return order;
            })
        );
    };

    const handleSendOrder = async (order) => {
        try {
            // Check if the tech name already exists in the database
            const techRef = collection(db, "TechDatabase");
            const techSnapshot = await getDocs(techRef);
            const techExists = techSnapshot.docs.some(doc => doc.data().Name === order.TechName);

            if (techExists) {
                // Update the existing tech's location
                const techDoc = techSnapshot.docs.find(doc => doc.data().Name === order.TechName);
                await updateDoc(doc(db, "TechDatabase", techDoc.id), { Location: order.Location });
            } else {
                // Add new tech if it doesn't exist, using the tech name as the document ID
                await setDoc(doc(db, "TechDatabase", order.TechName), { Name: order.TechName, Location: order.Location });
            }

            await addDoc(collection(db, "DeliveryTracker"), order);
            // Remove from TempDelivery after sending
            await deleteDoc(doc(db, "TempDelivery", order.id));
            setOrders((prevOrders) => prevOrders.filter((o) => o.id !== order.id));
        } catch (error) {
            console.error("Error sending order:", error);
        }
    };

    return (
        <div style={{ 
            height: "85vh", 
            width: "50%",
            overflowY: "auto", 
            display: "flex", 
            flexDirection: "column", 
            gap: "16px"
        }}>
            {orders.map((order) => (
                <div key={order.id} className="form-container">
                    <h3 style={{color: "black"}}>Order ID: {order.OrderID}</h3>
                    <label>
                        Tech Name:
                        <input className="input-field"
                            type="text"
                            value={order.TechName || ""}
                            onChange={(e) => handleEdit(order.id, "TechName", e.target.value)}
                            list="tech-names"
                            style={{ display: "block", margin: "8px 0", width: "90%" }}
                        />
                        <datalist id="tech-names">
                            {techNames.map((techName, index) => (
                                <option key={index} value={techName} />
                            ))}
                        </datalist>
                    </label>
                    <label>
                        Location:
                        <input
                            className="input-field"
                            type="text"
                            value={order.Location || ""}
                            onChange={(e) => handleEdit(order.id, "Location", e.target.value)}
                            style={{ display: "block", margin: "8px 0", width: "90%" }}
                        />
                    </label>
                    <label>
                        Boxes:
                        <input
                            className="input-field"
                            type="number"
                            value={order.Boxes || ""}
                            onChange={(e) => handleEdit(order.id, "Boxes", e.target.value)}
                            style={{ display: "block", margin: "8px 0", width: "90%" }}
                        />
                    </label>
                    <label>
                        Date Completed:
                        <input
                            className="input-field"
                            type="datetime-local"
                            value={order.DateCompleted || ""}
                            onChange={(e) => handleEdit(order.id, "DateCompleted", e.target.value)}
                            style={{ display: "block", margin: "8px 0", width: "90%" }}
                        />
                    </label>
                    <label>
                        Waybill:
                        <input
                            className="input-field"
                            type="text"
                            value={order.Waybill || ""}
                            onChange={(e) => handleEdit(order.id, "Waybill", e.target.value)}
                            style={{ display: "block", margin : "8px 0", width: "90%" }}
                        />
                    </label>
                    <label>
                        Skids:
                        <input
                            className="input-field"
                            type="number"
                            value={order.Skids || ""}
                            onChange={(e) => handleEdit(order.id, "Skids", e.target.value)}
                            style={{ display: "block", margin: "8px 0", width: "90%" }}
                        />
                    </label>
                    <label>
                        Weight:
                        <input
                            className="input-field"
                            type="number"
                            value={order.Weight || ""}
                            onChange={(e) => handleEdit(order.id, "Weight", e.target.value)}
                            style={{ display: "block", margin: "8px 0", width: "90%" }}
                        />
                    </label>
                    <div>
                        <strong style={{color: "black"}}>Devices:</strong>
                        {order.Devices && Object.entries(order.Devices).map(([deviceName, quantity], index) => (
                            <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                                <input
                                    className="input-field"
                                    type="text"
                                    value={deviceName}
                                    onChange={(e) => handleEdit(order.id, `Devices.${deviceName}`, e.target.value)}
                                    style={{ width: "50%" }}
                                />
                                <input
                                    className="input-field"
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => handleEdit(order.id, `Devices.${deviceName}`, e.target.value)}
                                    style={{ width: "35%" }}
                                />
                            </div>
                        ))}
                    </div>
                    <button onClick={() => handleSendOrder(order)} style={{ padding: "8px 16px", background: "#007bff", color: "white", border: "none", cursor: "pointer", marginTop: "12px" }}>Send</button>
                </div>
            ))}
        </div>
    );
};

export default OrderReviewPanel;