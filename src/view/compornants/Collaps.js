
const Collaps = ({ children }) => {
  return (
    <>
      <div className="col-12">
        <div className="row">
          {/* Main Collaps */}
          <div className="col-12 mt-2">
            <p className="">
              <button
                className="btn btn-secondary w-100 text-start mt-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#MaincollapseExample1"
                aria-expanded="false"
                aria-controls="MaincollapseExample1"
              >
                Software Engineering
              </button>
            </p>
            <div className="collapse show overflow-auto" id="MaincollapseExample1">
              {/* Course Levels */}
              {children}
              {/* Course Levels */}
            </div>
          </div>
          {/* Main Collaps */}
        </div>
      </div>
    </>
  );
};

export default Collaps;
