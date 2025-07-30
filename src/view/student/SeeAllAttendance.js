import Collaps from "../compornants/Collaps";
import DegreeLevelCollaps from "../compornants/DegreeLevelCollaps";
import AttendanceSubjectCollaps from "../compornants/AttendanceSubjectCollaps";

const SeeAllAttendance = () => {
  return (
    <>
    <div className="col-12 mt-5 py-5">
      <h3 className="fw-bold text-black-50">
       Attendance
      </h3>
    </div>
    <Collaps>
      <DegreeLevelCollaps>
        <AttendanceSubjectCollaps/>
      </DegreeLevelCollaps>
    </Collaps>
  </>
  );
};

export default SeeAllAttendance;
