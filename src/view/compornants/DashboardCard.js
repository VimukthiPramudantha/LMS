import "../../css/student.css"; // Make sure this path is correct

const DashboardCard = ({ cardTitle }) => {
  const {card_1,card_2,card_3} = cardTitle;
  return (
    <>
      {/* Container Main start */}
      {/* Card Container */}
      <div className="pt-2 bg-light">
        <div className="w-100 d-flex flex-column flex-lg-row justify-content-center">
          {/* card */}
          <div className="card m-2 card-color1 text-white border-0 shadow-lg flex-grow-1">
            <div className="card-body p-3">
              <p className="card-title rounded-5 fs-6 fw-semibold">
                {card_1}
              </p>
              <div className="col-12 d-flex align-items-baseline">
                <div className="col-6">
                  <p>
                    <i className="bi bi-bookmark-check-fill fs-1"></i>
                  </p>
                </div>
                <div className="col-6 text-end">
                  <p className="fs-2">328</p>
                </div>
              </div>
            </div>
          </div>
          {/* card */}
          {/* card */}
          <div className="card m-2 card-color2 text-white border-0 shadow-lg flex-grow-1">
            <div className="card-body p-3">
              <p className="card-title rounded-5 fs-6 fw-semibold">
                {card_2}
              </p>
              <div className="col-12 d-flex align-items-baseline">
                <div className="col-6">
                  <p>
                    <i className="bi bi-bookmark-check-fill fs-1"></i>
                  </p>
                </div>
                <div className="col-6 text-end">
                  <p className="fs-2">328</p>
                </div>
              </div>
            </div>
          </div>
          {/* card */}
          {/* card */}
          <div className="card m-2 card-color3 text-white border-0 shadow-lg flex-grow-1">
            <div className="card-body p-3">
              <p className="card-title rounded-5 fs-6 fw-semibold">
                {card_3}
              </p>
              <div className="col-12 d-flex align-items-baseline">
                <div className="col-6">
                  <p>
                    <i className="bi bi-bookmark-check-fill fs-1"></i>
                  </p>
                </div>
                <div className="col-6 text-end">
                  <p className="fs-2">328</p>
                </div>
              </div>
            </div>
          </div>
          {/* card */}
        </div>
      </div>
      {/* Card Container */}
    </>
  );
};

export default DashboardCard;
