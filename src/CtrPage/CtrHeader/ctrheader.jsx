import React, { useState, useEffect } from "react";
import "./ctrheader.css";
import { FetchCTRDetails } from "../api";

function CtrHeader({ ctrId = "8017" }) {
  const [ctrDetails, setCTRDetails] = useState(null);

  // Fetch the CTR details when the component mounts or when ctrId changes
  useEffect(() => {
    const loadReports = async () => {
      try {
        if (!ctrId) throw new Error("Missing CTR ID");

        // Fetch the CTR details from the API
        const [ctrInfo] = await Promise.all([FetchCTRDetails(ctrId)]);

        setCTRDetails(ctrInfo); // Update the state with the fetched data
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    loadReports();
  }, [ctrId]);

  // Function to copy the address to the clipboard
  const copyToClipboard = () => {
    if (ctrDetails && ctrDetails.Address) {
      navigator.clipboard.writeText(ctrDetails.Address)
        .then(() => {
          console.log("Address copied to clipboard");
        })
        .catch((error) => {
          console.error("Error copying address to clipboard:", error);
        });
    }
  };

  if (!ctrDetails) {
    return <div>Loading...</div>; // Display a loading message while the data is being fetched
  }

  return (
    <div className="CtrHeaderMain">
      <div className="TitleContainer">
        <button className="BackBtn">🡐</button>
        {/* Use ctrDetails.CompanyName as the title */}
        <h3 className="Title">{ctrDetails.CompanyName}</h3>
        {/* Use ctrId as the subtitle */}
        <p className="Subtitle">Contractor {ctrId}</p>
      </div>
      <div className="ButtonContainer">
        {/* Call copyToClipboard when the button is clicked */}
        <button className="CopyAddress headbtn" onClick={copyToClipboard}>
          Copy Address
        </button>
        <button className="EditOrder headbtn">Add Order</button>
        <button className="EditDevice headbtn">Edit Devices</button>
      </div>
    </div>
  );
}

export default CtrHeader;
