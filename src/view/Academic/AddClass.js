

const AddClass = () => {
  return (
    <>
      <div className="form-bg-image">
        <div className="col-12 d-flex justify-content-center mt-4">
          <div className="row col-lg-6 shadow-lg m-3 rounded-3 h-auto mt-4 p-3 formColour border border-3 border-end-0 border-start-0 border-primary">
            <h4 className="fw-bold text-black-50 mt-3 mb-4">Add New Class</h4>
            {/* Form Group */}
            <div className="col-12 col-xl-6">
              <div className="input-group mb-3">
                <span className="input-group-text fw-bold" id="basic-addon3">
                  Lecture ID&nbsp;:
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
                  Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="basic-url"
                  value="2024-08-07"
                  aria-describedby="basic-addon3"
                />
              </div>
            </div>
            <div className="input-group mb-3">
              <label className="input-group-text fw-bold" for="inputGroupSelect01">
                Subject&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
              </label>
              <select className="form-select" id="inputGroupSelect01">
                <option selected>Select Subject</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
            <div className="input-group mb-3">
              <label className="input-group-text fw-bold" for="inputGroupSelect01">
                Lecture&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
              </label>
              <select className="form-select" id="inputGroupSelect01">
                <option selected>Select Lecture</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text fw-bold" id="basic-addon3">
                Lesson&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
              </span>
              <input
                type="text"
                className="form-control"
                id="basic-url"
                placeholder="Enter Lecture Lesson"
                aria-describedby="basic-addon3"
              />
            </div>
            <div className="col-12 col-xl-6">
              <div className="input-group mb-3">
                <span className="input-group-text fw-bold" id="basic-addon3">
                  Start At&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                </span>
                <input
                  type="time"
                  className="form-control"
                  id="basic-url"
                  aria-describedby="basic-addon3"
                />
              </div>
            </div>

            <div className="col-12 col-xl-6">
              <div className="input-group mb-3">
                <span className="input-group-text fw-bold" id="basic-addon3">
                  End At&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                </span>
                <input
                  type="time"
                  className="form-control"
                  id="basic-url"
                  aria-describedby="basic-addon3"
                />
              </div>
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text fw-bold" id="basic-addon3">
                URL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
              </span>
              <input
                type="text"
                className="form-control"
                id="basic-url"
                placeholder="Enter Meeting URL"
                aria-describedby="basic-addon3"
              />
            </div>
            <div className="col-12 col-xl-6">
              <div className="input-group mb-3">
                <span className="input-group-text fw-bold" id="basic-addon3">
                  Location&nbsp;&nbsp;&nbsp;&nbsp;:
                </span>
                <input
                  type="text"
                  className="form-control"
                  value="Online"
                  id="basic-url"
                  aria-describedby="basic-addon3"
                />
              </div>
            </div>

            <div className="col-12 col-xl-6">
              <div className="input-group mb-3">
                <span className="input-group-text fw-bold" id="basic-addon3">
                  Passcord&nbsp;&nbsp;&nbsp;&nbsp;:
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="basic-url"
                  aria-describedby="basic-addon3"
                />
              </div>
            </div>
            <div className="col-12 text-end">
              <div className="col-12 text-end">
                <button type="button" className="btn btn-primary m-2">
                  Add
                </button>
                <button type="button" className="btn btn-dark m-2">
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

export default AddClass;
