import "./ctrheader.css"
function CtrHeader() {
    return (
        <div className='CtrHeaderMain'>
            
            <div className="TitleContainer">
                <button className="BackBtn">🡐</button>
                <h3 className="Title">Robitaille Edmunston</h3>
                <p className="Subtitle">Contractor 8017</p>
            </div>
            <div className="ButtonContainer">
                <button className="CopyAddress headbtn">Copy Address</button>
                <button className="EditOrder headbtn">Add Order</button>
                <button className="EditDevice headbtn">Edit Devices</button>
            </div>
        </div>
    );
  }
  
  export default CtrHeader;
  