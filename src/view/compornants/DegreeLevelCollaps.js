const DegreeLevelCollaps = ({ children }) => {
  return (
    <>
      {/* Diploma */}
      <div className="col-12 border border-2 p-2 mt-2">
        <p className="">
          <button
            className="btn btn-outline-primary w-100 text-start mt-3"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#DiplomaCollaps"
            aria-expanded="false"
            aria-controls="DiplomaCollaps"
          >
            Diploma In Software Engineering
          </button>
        </p>
        <div className="collapse overflow-auto" id="DiplomaCollaps">
         
              {/* ExamSubject Collaps */}
              {children}
              {/* ExamSubject Collaps */}
           
        </div>
      </div>
      {/* Diploma */}
    </>
  );
};

export default DegreeLevelCollaps;
