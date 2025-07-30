const StudentJoinClass = () => {
  const handleJoinClass = () => {
    // console.log("Joining Lecture Meeting");
    
    
  
    // Redirects to zoom class
    // window.location.href = "https://zoomapi.netlify.app/start-meeting";
    // console.log("clicked")

    
  };
  return (
    <>
      <div className="col-12 d-flex justify-content-center">
        <div className="row col-lg-6 shadow-lg m-3 rounded-3 h-auto mt-4 p-3 formColour border border-3 border-end-0 border-start-0 border-primary">
          <h4 className="fw-bold text-black-50 my-2">Join Lecture Meeting</h4>
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
                aria-describedby="basic-addon3"
              />
            </div>
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text fw-bold" id="basic-addon3">
              Subject&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </span>
            <input
              type="text"
              className="form-control"
              id="basic-url"
              aria-describedby="basic-addon3"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text fw-bold" id="basic-addon3">
              lecture&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </span>
            <input
              type="text"
              className="form-control"
              id="basic-url"
              aria-describedby="basic-addon3"
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text fw-bold" id="basic-addon3">
              Location&nbsp;&nbsp;&nbsp;&nbsp;:
            </span>
            <input
              type="text"
              className="form-control"
              id="basic-url"
              aria-describedby="basic-addon3"
            />
          </div>
          <div className="col-12 col-xl-6">
            <div className="input-group mb-3">
              <span className="input-group-text fw-bold" id="basic-addon3">
                Start At&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
              </span>
              <input
                type="text"
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
                type="text"
                className="form-control"
                id="basic-url"
                aria-describedby="basic-addon3"
              />
            </div>
          </div>
          <div className="col-12 col-xl-6">
            <div className="input-group mb-3">
              <span className="input-group-text fw-bold" id="basic-addon3">
                Lesson&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
              </span>
              <input
                type="text"
                className="form-control"
                id="basic-url"
                aria-describedby="basic-addon3"
              />
            </div>
          </div>

          <div className="col-12 col-xl-6">
            <div className="input-group mb-3">
              <span className="input-group-text fw-bold" id="basic-addon3">
                Paid&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
              </span>
              <input
                type="text"
                className="form-control"
                id="basic-url"
                aria-describedby="basic-addon3"
              />
            </div>
          </div>
          {/* Fail Alert */}
          <div
            className="alert alert-danger d-flex align-items-center border border-3 border-danger border-top-0 border-bottom-0"
            role="alert"
          >
            <i className="bi bi-shield-fill-x fs-4">&nbsp;&nbsp;</i>
            <div>
              You Can't Join The Lecture Today. Please Pay Your Due Immediately
              ....
            </div>
          </div>
          {/* Fail Alert */}
          <div className="col-12 text-end">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleJoinClass}
            >
              Join
            </button>
          </div>
          {/* Form Group */}
        </div>
      </div>
    </>
  );
};

export default StudentJoinClass;
