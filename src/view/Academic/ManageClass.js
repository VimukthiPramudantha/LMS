import { Link } from "react-router-dom";

const ManageClass = () => {
  return (
    <>
      <div className="col-12 bg-light">
        <div className="row">
          <h2 className="fw-bold mt-5">Manage Classes</h2>
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
            <Link to="add-class" type="button" className="btn btn-primary">
              Add New Class
            </Link>
          </div>

          <div className="mt-5 rounded-3 col-12">
            <div className="row gap-5 d-flex justify-content-center">
              <div className="col-12">
                <div className="m-1">
                  <div className="p-2">
                    <p className="fw-bold fs-5 text-black-50">Pending Classes</p>
                  </div>

                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Class ID</th>
                        <th scope="col">Subject</th>
                        <th scope="col">Lecture</th>
                        <th scope="col">Lesson</th>
                        <th scope="col">Date</th>
                        <th scope="col">Start At</th>
                        <th scope="col">End At</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>#231347</td>
                        <td>Java Programming</td>
                        <td>Sunil Edirisingha</td>
                        <td>OOP Concept</td>
                        <td>2024-08-08</td>
                        <td>08:00 AM</td>
                        <td>12:00 PM</td>
                        <td>Held</td>
                        <td>
                          <Link
                            to="update-class"
                            type="button"
                            className="btn btn-dark"
                          >
                            Update
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">1</th>
                        <td>#234647</td>
                        <td>PHP Programming</td>
                        <td>Pasindu Edirisingha</td>
                        <td>CRUD</td>
                        <td>2024-08-08</td>
                        <td>08:00 AM</td>
                        <td>12:00 PM</td>
                        <td>Held</td>
                        <td>
                          <Link
                            to="update-class"
                            type="button"
                            className="btn btn-dark"
                          >
                            Update
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">1</th>
                        <td>#231347</td>
                        <td>Angular Programming</td>
                        <td>Kasun Kalhara</td>
                        <td>SPA</td>
                        <td>2024-08-08</td>
                        <td>08:00 AM</td>
                        <td>12:00 PM</td>
                        <td>Held</td>
                        <td>
                          <Link
                            to="update-class"
                            type="button"
                            className="btn btn-dark"
                          >
                            Update
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">1</th>
                        <td>#231978</td>
                        <td>Software Engineering I</td>
                        <td>Pasindu Muthumina</td>
                        <td>OOSAD</td>
                        <td>2024-08-08</td>
                        <td>08:00 AM</td>
                        <td>12:00 PM</td>
                        <td>Held</td>
                        <td>
                          <Link
                            to="update-class"
                            type="button"
                            className="btn btn-dark"
                          >
                            Update
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">1</th>
                        <td>#231747</td>
                        <td>General English</td>
                        <td>Supun Madushan</td>
                        <td>Grammer</td>
                        <td>2024-08-08</td>
                        <td>08:00 AM</td>
                        <td>12:00 PM</td>
                        <td>Held</td>
                        <td>
                          <Link
                            to="update-class"
                            type="button"
                            className="btn btn-dark"
                          >
                            Update
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

export default ManageClass;
