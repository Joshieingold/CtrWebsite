import React from "react";
import "./App.css"; // Import CSS for styling
import logo from "./assets/logo.png";

const Header = () => (
  <div className="header">
    <div className="logo">
      <img className="LogoImage" src={logo}></img>
    </div>
    <h2 className="Title">CTR Daily Run</h2>
  </div>
);

const SelectionBox = () => {
  const items = [
    { number: "Overview", name: "" },
    { number: "8052", name: "Company A" },
    { number: "8067", name: "Company B" },
    { number: "8090", name: "Company C" },
    { number: "8091", name: "Company D" },
    { number: "8134", name: "Company E" },
    { number: "NB1", name: "Company F" },
    { number: "NF1", name: "Company G" },
  ];

  return (
    <div className="selection-box">
      <ul>
        {items.map((item, index) => (
          <li key={index} className="ctr-number-container">
            <p className="icon">{item.number}</p>
            <a href="#" className="ctr-number-link">{item.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

const CtrBanner = () => (
  <div className="ctr-banner">
    <div className="left-banner-content">
      <h3>CTR USERNAME</h3>
      <h4 className="subtext">Contactor "ctr number"</h4>
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

const SpreadsheetContainer = () => <div className="spreadsheet-container"></div>;

const CtrData = () => (
  <div className="ctr-data">
    <CtrBanner />
    <OverviewContainer />
    <SpreadsheetContainer />
  </div>
);

const App = () => {
  return (
    <div className="window">
      <Header />
      <div className="content">
        <SelectionBox />
        <CtrData />
      </div>
    </div>
  );
};

export default App;
