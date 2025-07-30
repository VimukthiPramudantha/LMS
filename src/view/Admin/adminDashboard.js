import "../../css/student.css"; // Make sure this path is correct
import "bootstrap/dist/css/bootstrap.min.css";
import DashboardCard from "../compornants/DashboardCard";
import AcademicClassCard from "../compornants/AcademicClassCard";

const AdminDashboard = () => {
  const cardTitle = {
    card_1: "All Students",
    card_2: "All Lectures",
    card_3: "Today Lectures",
  }
  return (
    <>
      {/* Card Container */}
      <DashboardCard cardTitle={cardTitle}/>
      {/* Card Container */}

      <div className="mt-5 rounded-3 col-12">
        <div className="row gap-5 d-flex justify-content-center">
          <div className="ms-4">
            <h2 className="fw-semibold text-secondary">Today Classes</h2>
            <hr className="border border-3 w-50 border-primary"/>
          </div>

          {/* class Card */}
          <AcademicClassCard/>
          <AcademicClassCard/>
          <AcademicClassCard/>
          <AcademicClassCard/>
          <AcademicClassCard/>
          <AcademicClassCard/>
          {/* class Card */}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
