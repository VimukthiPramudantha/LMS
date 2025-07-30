import { Link } from "react-router-dom";

const ManageAcademic = () => {
  return (
      <>
        <div className="col-12 bg-light">
          <div className="row">
            <h2 className="fw-bold mt-5">Manage Academic Officer</h2>
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
              <Link to="add-academic" type="button" className="btn btn-primary">
                New
              </Link>
            </div>

            <div className="col-12 overflow-x-auto">
              <div className="m-1 table-responsive">
                <div className="p-2">
                  <p className="fw-bold fs-5 text-black-50">All Officers</p>
                </div>

                <table className="table">
                  <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Academic ID</th>
                    <th scope="col">Academic Name</th>
                    <th scope="col">Refference No</th>
                    <th scope="col">Contact No</th>
                    <th scope="col">Created Date</th>
                    <th scope="col">Updated Date</th>
                    <th scope="col">Status</th>
                    <th scope="col">Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <th scope="row">1</th>
                    <td>#231347</td>
                    <td>Sadun Akalanka</td>
                    <td>xxxxxxxxxxx</td>
                    <td>07xxxxxxxx</td>
                    <td>2024-08-13</td>
                    <td>2024-08-13</td>
                    <td>
                      <div className="form-check form-switch">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="flexSwitchCheckDefault"
                        />
                      </div>
                    </td>
                    <td>
                      <Link
                          to="update-academic"
                          type="button"
                          className="btn btn-dark py-0 py-0"
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
      </>
  );
};

export default ManageAcademic;
