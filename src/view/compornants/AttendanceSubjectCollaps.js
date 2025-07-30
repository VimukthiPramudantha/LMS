import { Link } from "react-router-dom";

const AttendanceSubjectCollaps = () => {
  return (
    <>
      {/* collaps 1 */}
      <div className="col-12 border border-2 p-2 mt-2">
        <p className="">
          <button
            className="btn btn-outline-primary w-100 text-start mt-3"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseExample1"
            aria-expanded="false"
            aria-controls="collapseExample1"
          >
            Java Programming
          </button>
        </p>
        <div className="collapse overflow-auto" id="collapseExample1">
          <div className="card card-body">
            {/* Section 01 */}
            <div className="col-12">
              <div className="row">
                <div className="col-12">
                  <p className="fw-bold text-success">Current Assignments</p>
                </div>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Lecture ID</th>
                        <th scope="col">Subject ID</th>
                        <th scope="col">Lesson</th>
                        <th scope="col">Held Date</th>
                        <th scope="col">Time</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>#213482</td>
                        <td>#213482</td>
                        <td>OOP Concept II</td>
                        <td>2024-08-25</td>
                        <td>8:00 AM - 12:00 PM</td>
                        <td>
                          <Link
                            to="#"
                            type="button"
                            className="btn btn-success m-0 py-0 px-2 disabled"
                          >
                            Present
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">2</th>
                        <td>#213483</td>
                        <td>#213485</td>
                        <td>Fundementals</td>
                        <td>2024-08-27</td>
                        <td>8:00 AM - 12:00 PM</td>
                        <td>
                          <Link
                            to="#"
                            type="button"
                            className="btn btn-danger m-0 py-0 px-2 disabled"
                          >
                            Absense
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* Section 01 */}
          </div>
        </div>
      </div>
      {/* collaps 1 */}
    </>
  );
};

export default AttendanceSubjectCollaps;
