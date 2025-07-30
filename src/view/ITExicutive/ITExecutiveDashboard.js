import "../../css/student.css"; // Make sure this path is correct
import "bootstrap/dist/css/bootstrap.min.css";
// import DashboardCard from "../compornants/DashboardCard";
// import ClassCard from "../compornants/ClassCard";
import DayCardCompornant from "../compornants/DayCardCompornant";

const ITExicutiveDashboard = () => {
  // const cardTitle = {
  //   card_1: "All Lectures",
  //   card_2: "Weekly Lectures",
  //   card_3: "Today Lectures",
  // }
  return (
    <>
      {/* Card Container */}
      {/* <DashboardCard cardTitle={cardTitle} /> */}
      {/* Card Container */}

      <div className="mt-5 rounded-3 col-12">
        <div className="row gap-5 d-flex justify-content-center">
          {/* class Card */}
          <DayCardCompornant/>

          {/* class Card */}
        </div>
      </div>
    </>
  );
};

export default ITExicutiveDashboard;
