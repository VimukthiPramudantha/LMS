import { Link } from "react-router-dom";

const ManageStudent = () => {
  return (
    <>
      <div className="col-12 bg-light">
        <div className="row">
          <h2 className="fw-bold mt-5">Manage Student</h2>
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
            <Link to="add-student" type="button" className="btn btn-primary">
              Add New Student
            </Link>
          </div>

          <div className="col-12 mt-4">
            <div className="m-1">
                <div className="p-2">
                   <p className="fw-bold fs-5 text-black-50">All Students</p> 
                </div>
            
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Student ID</th>
                  <th scope="col">Student Name</th>
                  <th scope="col">Refference No</th>
                  <th scope="col">Contact No</th>
                  <th scope="col">Created At</th>
                  <th scope="col">Updated At</th>
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
                  <td>08:00 AM</td>
                  <td>12:00 PM</td>
                  <td>Active</td>
                  <td><Link to="update-student" type="button" className="btn btn-dark">Update</Link></td>
                </tr>
                <tr>
                  <th scope="row">1</th>
                  <td>#231287</td>
                  <td>Pasindu Peris</td>
                  <td>xxxxxxxxxxx</td>
                  <td>07xxxxxxxx</td>
                  <td>08:00 AM</td>
                  <td>12:00 PM</td>
                  <td>Active</td>
                  <td><Link to="update-student" type="button" className="btn btn-dark">Update</Link></td>
                </tr>
                <tr>
                  <th scope="row">1</th>
                  <td>#231467</td>
                  <td>Supun Madushan</td>
                  <td>xxxxxxxxxxx</td>
                  <td>07xxxxxxxx</td>
                  <td>08:00 AM</td>
                  <td>12:00 PM</td>
                  <td>Active</td>
                  <td><Link to="update-student" type="button" className="btn btn-dark">Update</Link></td>
                </tr>
                <tr>
                  <th scope="row">1</th>
                  <td>#231157</td>
                  <td>Kasun Kalhara</td>
                  <td>xxxxxxxxxxx</td>
                  <td>07xxxxxxxx</td>
                  <td>08:00 AM</td>
                  <td>12:00 PM</td>
                  <td>Active</td>
                  <td><Link to="update-student" type="button" className="btn btn-dark">Update</Link></td>
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

export default ManageStudent;
