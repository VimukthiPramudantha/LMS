import { Link } from "react-router-dom";

const AssignmentSubjectCollaps = () => {
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
                        <th scope="col">Assignment ID</th>
                        <th scope="col">Assignment Name</th>
                        <th scope="col">Start Date</th>
                        <th scope="col">End Date</th>
                        <th scope="col">Download</th>
                        <th scope="col">Upload</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>#213482</td>
                        <td>OOP Concept II</td>
                        <td>2024-08-25</td>
                        <td>2024-08-27</td>
                        <td>
                          <Link
                            to="#"
                            type="button"
                            className="btn btn-secondary m-0 py-0 px-2"
                          >
                            Download
                          </Link>
                        </td>
                        <td>
                          <Link
                            to="#"
                            type="button"
                            className="btn btn-success m-0 py-0 px-2"
                          >
                            Upload
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* Section 01 */}
            {/* Section 02 */}
            <div className="col-12 mt-3">
              <div className="row">
                <div className="col-12">
                  <p className="fw-bold text-success">All Assignments</p>
                </div>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Assignment ID</th>
                        <th scope="col">Assignment Name</th>
                        <th scope="col">Submitted Date</th>
                        <th scope="col">Submitted Time</th>
                        <th scope="col">View</th>
                        <th scope="col">Status</th>
                        <th scope="col">Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>#124681</td>
                        <td>OOP Concept I</td>
                        <td>2024-08-25</td>
                        <td>9:30 AM</td>
                        <td>
                          <Link
                            to="#"
                            type="button"
                            className="btn btn-dark py-0 m-0 py-0 px-2"
                          >
                            View
                          </Link>
                        </td>
                        <td>
                          <Link
                            to="#"
                            type="button"
                            className="btn btn-success m-0 py-0 px-2 disabled"
                          >
                            Submitted
                          </Link>
                        </td>
                        <td>30</td>
                      </tr>
                      <tr>
                        <th scope="row">1</th>
                        <td>#124647</td>
                        <td>Java Fundementals</td>
                        <td>2024-08-23</td>
                        <td>8:54 AM</td>
                        <td>
                          <Link
                            to="#"
                            type="button"
                            className="btn btn-dark py-0 m-0 py-0 px-2"
                          >
                            View
                          </Link>
                        </td>
                        <td>
                          <Link
                            to="#"
                            type="button"
                            className="btn btn-danger m-0 py-0 px-2 disabled"
                          >
                            N/S
                          </Link>
                        </td>
                        <td>0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Section 02 */}
          </div>
        </div>
      </div>
      {/* collaps 1 */}
    </>
  );
};

export default AssignmentSubjectCollaps;
