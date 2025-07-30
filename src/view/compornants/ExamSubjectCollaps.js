import { Link } from "react-router-dom";

const ExamSubjectCollaps = () => {
  return (
    <>
      {/* collaps 1 */}
      <div className="w-100 border border-2 p-2 mt-2">
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
                  <p className="fw-bold text-success">Current Exams</p>
                </div>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Examination ID</th>
                        <th scope="col">Examination Name</th>
                        <th scope="col">Held Date</th>
                        <th scope="col">Start At</th>
                        <th scope="col">End At</th>
                        <th scope="col">Examination Center</th>
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
                        <td>8:00 AM</td>
                        <td>2:00 PM</td>
                        <td>Online</td>
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
                  <p className="fw-bold text-success">All Exams</p>
                </div>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Examination ID</th>
                        <th scope="col">Examination Name</th>
                        <th scope="col">Held Date</th>
                        <th scope="col">Examination Center</th>
                        <th scope="col">Marks</th>
                        <th scope="col">Status</th>
                        <th scope="col">Feedback</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>#124681</td>
                        <td>OOP Concept I</td>
                        <td>2024-08-25</td>
                        <td>Online</td>
                        <td>30</td>
                        <td>
                          <Link
                            to="#"
                            type="button"
                            className="btn btn-success m-0 py-0 px-2 disabled"
                          >
                            Attended
                          </Link>
                        </td>
                        <td>
                          <Link
                            to="#"
                            type="button"
                            className="btn btn-dark py-0 m-0 py-0 px-2"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">1</th>
                        <td>#124647</td>
                        <td>Java Fundementals</td>
                        <td>2024-08-23</td>
                        <td>Online</td>
                        <td>0</td>

                        <td>
                          <Link
                            to="#"
                            type="button"
                            className="btn btn-danger m-0 py-0 px-2 disabled"
                          >
                            N/A
                          </Link>
                        </td>
                        <td>
                          <Link
                            to="#"
                            type="button"
                            className="btn btn-dark py-0 m-0 py-0 px-2"
                          >
                            View
                          </Link>
                        </td>
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

export default ExamSubjectCollaps;
