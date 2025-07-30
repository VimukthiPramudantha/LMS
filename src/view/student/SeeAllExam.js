import Collaps from "../compornants/Collaps";
import ExamSubjectCollaps from "../compornants/ExamSubjectCollaps";
import DegreeLevelCollaps from "../compornants/DegreeLevelCollaps";

const SeeAllExams = () => {
  return (
    <>
      <div className="col-12 mt-5 py-5">
        <h3 className="fw-bold text-black-50">
          Exams
        </h3>
      </div>
      <Collaps>
        <DegreeLevelCollaps>
          <ExamSubjectCollaps />
          <ExamSubjectCollaps />
          <ExamSubjectCollaps />
        </DegreeLevelCollaps>
      </Collaps>
    </>
  );
};

export default SeeAllExams;
