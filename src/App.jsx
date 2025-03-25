import React from "react";
import "./App.css"; // Import CSS for styling
import logo from "./assets/logo.png";
import overview from "./assets/overview-inactive.png";
import { se } from "date-fns/locale";
import { useState } from "react";

const CTRs = [
    { number: "", name: "Overview" },
    { number: "8052", name: "DHT Fredericton" },
    { number: "8067", name: "DHT Moncton" },
    { number: "8090", name: "DHT Saint John" },
    { number: "8091", name: "DHT North" },
    { number: "8134", name: "DHT Bathurst" },
    { number: "NB1", name: "New Brunswick Warehouse" },
    { number: "NF1", name: "Newfoundland Warehouse" },
  ];

const Header = () => (
  <a className="header">
    <div className="logo">
      <img className="LogoImage" src={logo}></img>
    </div>
    <h2 className="Title">CTR Daily Run</h2>
  </a>
);

const SelectionBox = ({ selectedCtr, setSelectedCtr }) => {
  const items = [
    { number: "", name: "Overview" },
    { number: "8052", name: "DHT Fredericton" },
    { number: "8067", name: "DHT Moncton" },
    { number: "8090", name: "DHT Saint John" },
    { number: "8091", name: "DHT North" },
    { number: "8134", name: "DHT Bathurst" },
    { number: "NB1", name: "New Brunswick Warehouse" },
    { number: "NF1", name: "Newfoundland Warehouse" },
  ];

  return (
    <div className="selection-box">
      <ul>
        {items.map((item, index) => (
          <li
            key={index}
            className={`ctr-number-container ${selectedCtr.number === item.number ? "active" : ""}`}
            onClick={() => setSelectedCtr(item)} // ✅ Use the real setSelectedCtr
          >
            <p className="icon">{item.number}</p>
            <a href="#" className="ctr-number-link">{item.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};


const CtrBanner = ({selectedCtr}) => (
  <div className="ctr-banner">
    <div className="left-banner-content">
      <h3>{selectedCtr.name}</h3>
      <h4 className="subtext">Contractor: {selectedCtr.number}</h4>
    </div>
    <div className="right-banner-content">
      <button className="banner-button">Copy Address</button>
      <button className="banner-button">Add Orders</button>
    </div>
  </div>
);

const OverviewContainer = () => (
  <div className="overview-container">
    <div className="big-panel-container">
      <div className="stats-bubble"></div>
      <div className="stats-bubble"></div>
    </div>
    <div className="small-panel-container">
      <div className="graph-bubble"></div>
      <div className="graph-bubble"></div>
      <div className="graph-bubble"></div>
    </div>
  </div>
);

const SpreadsheetContainer = () => 
<div className="spreadsheet-container"></div>;

const CtrData = ({selectedCtr}) => (
  <div className="ctr-data">
    <CtrBanner selectedCtr={selectedCtr}/>
    <OverviewContainer />
    <SpreadsheetContainer />
  </div>
);

const App = () => {
  const [selectedCtr, setSelectedCtr] = useState(CTRs[1]);
  return (
    <div className="window">
      <Header selectedCtr={selectedCtr}/>
      <div className="content">
        <SelectionBox selectedCtr={selectedCtr} setSelectedCtr={setSelectedCtr}/>
        <CtrData selectedCtr={selectedCtr}/>
      </div>
    </div>
  );
};

export default App;
