import CtrHeader from "./CtrHeader/ctrheader.jsx";
import TodayInfo from "./TodaysInformation/todaysinformation.jsx";
import CTRWeeklyTable from "./WeeklyTable/weeklytable.jsx";
import "./ctrpage.css";
function CTR() {
    return (
        <div className='CTRMain'>
            <CtrHeader />
            <div className="CtrOverviewContainer">
                <TodayInfo ctrID="8017"/>
                <CTRWeeklyTable ctrId="8017" className="TableData"/>
            </div>
            
        </div>
    );
  }
  
  export default CTR;
  