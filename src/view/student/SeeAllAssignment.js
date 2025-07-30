import Collaps from "../compornants/Collaps";
import DegreeLevelCollaps from "../compornants/DegreeLevelCollaps";
import AssignmentSubjectCollaps from "../compornants/AssignmentSubjectCollaps";

const SeeAllAssignments = () => {
  return (
    <>
    <div className="col-12 mt-5 py-5">
        <h3 className="fw-bold text-black-50">
          Assignments
        </h3>
      </div>
      <Collaps>
        <DegreeLevelCollaps>
          <AssignmentSubjectCollaps/>
        </DegreeLevelCollaps>
      </Collaps>
    </>
  );
};

export default SeeAllAssignments;
