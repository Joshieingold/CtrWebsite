import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate, Link } from "react-router-dom";
import "./App.css";
import logo from "./assets/logo.png";
import { fetchCTRReports } from "./CtrPage/api";
import CTRBarChart from "./CTRBarChart";
import DeliveryTrackerGraph from "./DeliveryTrackerGraph";
import TotalDevicesChart from "./TotalDevicesChart";
import TreemapChart from "./TreemapChart";

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
const WaybillPage = () => {

  return (
    <div className="window">
      <Header />
      <div className="content-waybills">
        <div className="big-graph-bubble">
          <DeliveryTrackerGraph/>
        </div>
        <div className="big-graph-bubble">
          <TotalDevicesChart/>
        </div>
      </div>
      <div className="content-big">
        <h2>Orders Grouping</h2>
        <TreemapChart/>
      </div>
    </div>
  );
};


const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/Waybill" element={<WaybillPage/>}/> 
    </Routes>
  </Router>
);

export default App;
