import CtrHeader from "./CtrHeader/ctrheader.jsx";
import TodayInfo from "./TodaysInformation/todaysinformation.jsx";
import "./ctrpage.css"
function CTR() {
    return (
        <div className='CTRMain'>
            <CtrHeader />
            <div className="CtrOverviewContainer">
                <TodayInfo/>
            </div>
        </div>
    );
  }
  
  export default CTR;
  