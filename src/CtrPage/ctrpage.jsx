import CtrHeader from "./CtrHeader/ctrheader.jsx";
import TodayInfo from "./TodaysInformation/todaysinformation.jsx";
import CTRWeeklyTable from "./WeeklyTable/weeklytable.jsx";
import "./ctrpage.css";
function CTR() {
    return (
        <div className='CTRMain'>
            <CtrHeader />
            <div className="CtrOverviewContainer">
                <TodayInfo/>
                <CTRWeeklyTable ctrId="8019"/>
            </div>
            
        </div>
    );
  }
  
  export default CTR;
  