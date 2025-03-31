import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate, Link } from "react-router-dom";
import "./App.css";
import logo from "./assets/logo.png";
import { fetchCTRReports } from "./CtrPage/api";
import CTRBarChart from "./CTRBarChart";
import DeliveryTrackerGraph from "./DeliveryTrackerGraph";
import TotalDevicesChart from "./TotalDevicesChart";
import WaybillTreemap from "./TreemapChart";
import WaybillTable from "./WaybillTable";


const CTRs = [
  { number: "8052", name: "DHT Fredericton" },
  { number: "8067", name: "DHT Moncton" },
  { number: "8090", name: "DHT Saint John" },
  { number: "8091", name: "DHT North" },
  { number: "8134", name: "DHT Bathurst" },
  { number: "NB1", name: "New Brunswick Warehouse" },
  { number: "NF1", name: "Newfoundland Warehouse" },
];

const Header = () => (
  <div className="header">
    <div className="LogoContainer">
      <div className="logo">
      <img className="LogoImage" src={logo} alt="Logo" />
      </div>
      <h2 className="Title">Warehouse Daily Run</h2>
    </div>
    
    <div className="Links">
      <Link to="/">Contractors</Link>
      <Link to="/Waybill">Orders</Link>
    </div>
  </div>
);


const SelectionBox = ({ selectedCtr, setSelectedCtr }) => (
  <div className="selection-box">
    <ul>
      {CTRs.map((ctr, index) => (
        <li
          key={index}
          className={`ctr-number-container ${selectedCtr.number === ctr.number ? "active" : ""}`}
          onClick={() => setSelectedCtr(ctr)}
        >
          <p className="icon">{ctr.number}</p>
          <span className="ctr-number-link">{ctr.name}</span>
        </li>
      ))}
    </ul>
  </div>
);

const CtrBanner = ({ selectedCtr }) => {
  const [displayName, setDisplayName] = useState(selectedCtr.name);
  const [displayNumber, setDisplayNumber] = useState(selectedCtr.number);
  const [animClass, setAnimClass] = useState("");

  const navigate = useNavigate(); // Declare useNavigate() outside

  useEffect(() => {
    if (selectedCtr.name !== displayName || selectedCtr.number !== displayNumber) {
      setAnimClass("slide-out");
  
      setTimeout(() => {
        setDisplayName(selectedCtr.name);
        setDisplayNumber(selectedCtr.number);
        setAnimClass("slide-in");
  

      }, 400);
    }
  }, [selectedCtr, navigate]); // Add navigate as a dependency

  return (
    <div className="ctr-banner">
      <div className="left-banner-content">
        <h3 className={animClass}>{displayName}</h3>
        <h4 className={`subtext ${animClass}`}>Contractor: {displayNumber}</h4>
      </div>
      <div className="right-banner-content">
        <button className="banner-button">Copy Address</button>
        <button className="banner-button">Add Orders</button>
      </div>
    </div>
  );
};
const WaybillNav = () => {
  return (
    <div className="waybill-nav">
      <Link to="/Waybill" className="link-button">Statistics</Link>
      <Link to="/Submit" className="link-button">Submit Orders</Link>
    </div>
  );
}
const OverviewContainer = ({ selectedCtr }) => (
  <div className="overview-container">
    <div className="big-panel-container">
      <div className="stats-bubble">
        <CTRBarChart ctrId={selectedCtr.number} />
      </div>
    </div>
    <div className="small-panel-container">
      <div className="graph-bubble">
        <CTRBarChart ctrId={selectedCtr.number} />
      </div>
    </div>
  </div>
);

const CtrData = ({ selectedCtr }) => (
  <div className="ctr-data">
    <CtrBanner selectedCtr={selectedCtr} />
    <OverviewContainer selectedCtr={selectedCtr} />
  </div>
);

const HomePage = () => {
  const [selectedCtr, setSelectedCtr] = useState(CTRs[1]);

  return (
    <div className="window">
      <Header />
      <div className="content">
        <SelectionBox selectedCtr={selectedCtr} setSelectedCtr={setSelectedCtr} />
        <CtrData selectedCtr={selectedCtr} />
      </div>
    </div>
  );
};







import { db } from "./CtrPage/firebase.jsx"; // Ensure your Firebase config is set up
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";




const SubmitWaybillDataPage = () => {
  const initialFormData = {
    Boxes: "",
    DateCompleted: "",
    Location: "",
    OrderID: "",
    techname: "",
    waybill: "",
    Devices: [{ name: "", quantity: "" }],
  };

  const [techOptions, setTechOptions] = useState([]);
  const [techMap, setTechMap] = useState({});
  const [formData, setFormData] = useState(initialFormData);
  const [skids, setSkids] = useState(0);
  const [deviceOptions, setDeviceOptions] = useState([]);
  const [deviceFullBoxMap, setDeviceFullBoxMap] = useState({});

  useEffect(() => {
    const fetchTechs = async () => {
      try {
        const techRef = collection(db, "TechDatabase");
        const querySnapshot = await getDocs(techRef);
        const techs = {};
        const techNames = [];

        querySnapshot.docs.forEach(doc => {
          const data = doc.data();
          techs[data.Name] = data.Location || ""; // Default Location to empty if missing
          techNames.push(data.Name);
        });

        setTechOptions(techNames);
        setTechMap(techs);
      } catch (error) {
        console.error("Error fetching techs:", error);
      }
    };
    fetchTechs();
  }, []);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const deviceRef = collection(db, "DeviceDatabase");
        const querySnapshot = await getDocs(deviceRef);
        const devices = {};
        const deviceNames = [];

        querySnapshot.docs.forEach(doc => {
          const data = doc.data();
          devices[data.Name] = data.FullBox || 10;
          deviceNames.push(data.Name);
        });

        setDeviceOptions(deviceNames);
        setDeviceFullBoxMap(devices);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };
    fetchDevices();
  }, []);

  useEffect(() => {
    const calculateBoxes = () => {
      let totalBoxFraction = 0;

      formData.Devices.forEach(({ name, quantity }) => {
        const fullBox = deviceFullBoxMap[name] || 10;
        if (quantity) {
          totalBoxFraction += quantity / fullBox;
        }
      });

      const totalBoxes = Math.ceil(totalBoxFraction);
      setFormData(prev => ({ ...prev, Boxes: totalBoxes }));
    };

    calculateBoxes();
  }, [formData.Devices, deviceFullBoxMap]);

  useEffect(() => {
    setSkids((parseFloat(formData.Boxes) || 0) / 24);
  }, [formData.Boxes]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      techname: value,
      Location: techMap[value] || prev.Location, // Autofill Location if name exists
    }));
  };

  const handleDeviceChange = (index, field, value) => {
    const updatedDevices = [...formData.Devices];
    updatedDevices[index][field] = value;
    setFormData((prev) => ({ ...prev, Devices: updatedDevices }));
  };

  const addDevice = () => {
    setFormData((prev) => ({
      ...prev,
      Devices: [...prev.Devices, { name: "", quantity: "" }],
    }));
  };

  const removeDevice = (index) => {
    if (formData.Devices.length > 1) {
      setFormData((prev) => {
        const updatedDevices = prev.Devices.filter((_, i) => i !== index);
        return { ...prev, Devices: updatedDevices };
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", { ...formData, Skids: skids });
    setFormData(initialFormData);
    setSkids(0);
  };

  return (
    <div className="window-submit">
      <Header />
      <WaybillNav />
      <form onSubmit={handleSubmit} className="form-container">
        <h3 className="StatTitle">Manual Submit</h3>
        <label>
          Boxes:
          <input type="number" name="Boxes" value={formData.Boxes} onChange={handleChange} className="input-field" />
        </label>
        <label>
          Date Completed:
          <input type="date" name="DateCompleted" value={formData.DateCompleted} onChange={handleChange} className="input-field" />
        </label>
        <label>
          Location:
          <input type="text" name="Location" value={formData.Location} onChange={handleChange} className="input-field" />
        </label>
        <label>
          Order ID:
          <input type="text" name="OrderID" value={formData.OrderID} onChange={handleChange} className="input-field" />
        </label>
        <label>
          Tech Name:
          <input
            list="tech-options"
            type="text"
            name="techname"
            value={formData.techname}
            onChange={handleTechChange}
            className="input-field"
          />
          <datalist id="tech-options">
            {techOptions.map((techName, idx) => (
              <option key={idx} value={techName} />
            ))}
          </datalist>
        </label>
        <label>
          Waybill:
          <input type="text" name="waybill" value={formData.waybill} onChange={handleChange} className="input-field" />
        </label>

        <div className="devices-container">
          <strong className="text">Devices:</strong>
          {formData.Devices.map((device, index) => (
            <div key={index} className="device-entry">
              <input
                list={`device-options-${index}`}
                type="text"
                placeholder="Device Name"
                value={device.name}
                onChange={(e) => handleDeviceChange(index, "name", e.target.value)}
                className="input-field"
              />
              < datalist id={`device-options-${index}`}>
                {deviceOptions.map((deviceName, idx) => (
                  <option key={idx} value={deviceName} />
                ))}
              </datalist>
              <input
                type="number"
                placeholder="Quantity"
                value={device.quantity}
                onChange={(e) => handleDeviceChange(index, "quantity", e.target.value)}
                className="input-field"
              />
              <button type="button" onClick={() => removeDevice(index)} className="remove-button">-</button>
            </div>
          ))}
          <button type="button" onClick={addDevice} className="add-button">+ Add Device</button>
        </div>

        <div className="skids-display">
          <strong>Skids:</strong> {skids}
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};




















const WaybillPage = () => {

  return (
    <div className="window-waybills">
      <Header />
      <WaybillNav/>
      <div className="content-waybills">
        <div className="big-graph-bubble">
          <DeliveryTrackerGraph/>
        </div>
        <div className="big-graph-bubble">
          <TotalDevicesChart/>
        </div>
      </div>
      <div className="content-big">
        <WaybillTable/>

      </div>
        
      <div className="content-big">
        <h2>Orders Grouping</h2>
        <WaybillTreemap/>
      </div>
    </div>
  );
};


const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/Waybill" element={<WaybillPage/>}/> 
      <Route path="/Submit" element={<SubmitWaybillDataPage/>}/>
    </Routes>
  </Router>
);

export default App;
