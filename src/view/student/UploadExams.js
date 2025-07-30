import { Link } from "react-router-dom";

const UploadExams = () => {
  return (
    <>
      <div className="col-12 bg-light">
        <div className="row">
          <h2 className="fw-bold mt-5">JAVA PROGRAMMING</h2>
          <div className="col-12 col-lg-4 offset-0 offset-lg-8 d-flex gap-2 mt-4">
            <input
              className="form-control"
              list="datalistOptions"
              id="exampleDataList"
              placeholder="Type to search..."
            />
            <datalist id="datalistOptions">
              <option value="San Francisco" />
              <option value="New York" />
              <option value="Seattle" />
              <option value="Los Angeles" />
              <option value="Chicago" />
            </datalist>
          </div>

          <div className="mt-5 rounded-3 col-12">
            <div className="row gap-5 d-flex justify-content-center">
              <div className="col-12 overflow-x-auto">
                <div className="m-1">
                  <div className="p-2">
                    <p className="fw-bold fs-5 text-black-50">
                      Pending Exams
                    </p>
                  </div>

                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Subject ID</th>
                        <th scope="col">Exam ID</th>
                        <th scope="col">Title</th>
                        <th scope="col">Start Date</th>
                        <th scope="col">Start Time</th>
                        <th scope="col">End Date</th>
                        <th scope="col">End Time</th>
                        <th scope="col">Uploaded At</th>
                        <th scope="col">Download</th>
                        <th scope="col">Upload</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>#231347</td>
                        <td>#231749</td>
                        <td>OOP Concept</td>
                        <td>2024-08-20</td>
                        <td>08:00</td>
                        <td>2024-08-22</td>
                        <td>00:00</td>
                        <td>2024-08-10</td>
                        <td>
                          <Link
                            to="#"
                            type="button"
                            className="btn btn-dark py-0 m-0 py-0 px-2"
                          >
                            Download
                          </Link>
                        </td>
                        <td>
                          <Link
                            to="#"
                            type="button"
                            className="btn btn-primary m-0 py-0 px-2"
                          >
                            upload
                          </Link>
                        </td>
                      </tr>
                    
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadExams;
