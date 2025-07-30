import "../../css/student.css"; // Make sure this path is correct
import "bootstrap/dist/css/bootstrap.min.css";

const AcademicManagerDashboard = () => {
  const day = new Date().toLocaleString('en-us', { weekday: 'long' });

  return (
    <><br/>
      <div className="container mt-5 pb-5">
        <div className="row justify-content-center">
          <div className="col-12 mt-5 ">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h2 className="welcome-message text-success">Welcome to Accountant Head Dashboard</h2>
              </div>
            </div>
            <div className="col-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h5 className="card-title text-primary">Today's Date</h5>
                <p className="card-text text-secondary">{new Date().toLocaleDateString()} - {day}</p>
              </div>
            </div>
          </div>
          </div>

          {/* <DayCardCompornant /> */}
        </div>
      </div>
    </>
  );
};

export default AcademicManagerDashboard;