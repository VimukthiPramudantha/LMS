import { Link } from "react-router-dom";
import "../../css/student.css"; // Make sure this path is correct

const AcademicClassCard = () => {
  return (
    <>
      <div className="col-11 col-xl-3 shadow rounded border border-4 border-end-0 border-start-0 border-primary">
        <div className="bg-success mt-4 w-50 p-2 rounded-end-2 shadow-sm text-white fw-semibold">
          2003/12/25
        </div>
        <div className="card my-2 border border-0">
          <div className="card-body">
            {/* <h5 className="card-title fs-6 fw-bold"><i className="bi bi-globe"></i>&nbsp;&nbsp;OOPC</h5> */}
            <p className="card-text fw-bold">
              <i className="bi bi-journal-text fs-6 fw-bold"></i>
              &nbsp;&nbsp;OOPC <br />
              <i className="bi bi-stopwatch fs-6 fw-bold"></i>&nbsp;&nbsp;8:00 AM to
              10:00 AM <br />
              <i className="bi bi-person-add fs-6 fw-bold"></i>
              &nbsp;&nbsp;Sanchitha Heshan <br />
              <i className="bi bi-geo-alt-fill fs-6 fw-bold"></i>
              &nbsp;&nbsp;Head Office Online <br />
            </p>
            <div className="col-12 text-end fw-bold text-success">
              <p>Held</p>
            </div>
            <Link to="./manage-class/update-class" className="btn btn-primary w-100 ">
              Update Class
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AcademicClassCard;
