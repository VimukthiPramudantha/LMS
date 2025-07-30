const AddAcademic = () => {
    return (
      <>
        <div className="form-bg-image">
          <div className="col-12 d-flex justify-content-center mt-4">
            <div className="row col-lg-6 shadow-lg m-3 rounded-3 h-auto mt-4 p-3 formColour border border-3 border-end-0 border-start-0 border-primary">
              <h4 className="fw-bold text-black-50 mt-3 mb-4">Add New Academic Officer</h4>
              {/* Form Group */}
              <div className="col-12 col-xl-6">
                <div className="input-group mb-3">
                  <span className="input-group-text fw-bold" id="basic-addon3">
                    Academic ID&nbsp;:
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    id="basic-url"
                    value="25sasf5"
                    aria-describedby="basic-addon3"
                  />
                </div>
              </div>
              <div className="col-12 col-xl-6">
                <div className="input-group mb-3">
                  <span className="input-group-text fw-bold" id="basic-addon3">
                    Password&nbsp;&nbsp;:
                  </span>
                  <input
                    type="Password"
                    className="form-control"
                    id="basic-url"
                    value="25sasf5"
                    aria-describedby="basic-addon3"
                  />
                </div>
              </div>
              <div className="input-group mb-3">
                <label className="input-group-text fw-bold" for="inputGroupSelect01">
                Academic Name&nbsp;&nbsp;:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="basic-url"
                  placeholder="Enter Student Name"
                  aria-describedby="basic-addon3"
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text fw-bold" id="basic-addon3">
                  Refference No&nbsp;&nbsp;:
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="basic-url"
                  placeholder="Enter Student Refference No"
                  aria-describedby="basic-addon3"
                />
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text fw-bold" id="basic-addon3">
                  Contact No&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="basic-url"
                  placeholder="Enter Mobile No"
                  aria-describedby="basic-addon3"
                />
              </div>
  
              <div className="col-12 text-end">
                <div className="col-12 text-end">
                  <button type="button" className="btn btn-primary m-2">
                    Add
                  </button>
                  <button type="button" className="btn btn-dark py-0 m-2">
                    Cancel
                  </button>
                </div>
              </div>
              {/* Form Group */}
            </div>
          </div>
        </div>
      </>
    );
  };
  
  export default AddAcademic;
  