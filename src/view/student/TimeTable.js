import ClassCard from "../compornants/ClassCard";

const TimeTable = () => {
  return (
    <>
      <div className="col-12 bg-light">
        <div className="row">
          <h2 className="fw-bold mt-5">Sheduled Classes</h2>
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
              {/* class Card */}
              <ClassCard />
              <ClassCard />
              <ClassCard />
              <ClassCard />
              <ClassCard />
              <ClassCard />
              {/* class Card */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TimeTable;
