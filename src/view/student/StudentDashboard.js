import "../../css/student.css"; // Ensure the path is correct
import "bootstrap/dist/css/bootstrap.min.css";
import CourseDetailCard from "../compornants/CourseDetailCard";
import PaymentDetailCard from "../compornants/PaymentDetailCard";
import { useEffect, useState } from "react";

const StudentDashboard = () => {
  // State to manage the student's name and coordinate news
  const [studentName, setStudentName] = useState("");
  const [coordinateNews, setCoordinateNews] = useState("Hello, alert!..");

  useEffect(() => {
    // Retrieve the student name from localStorage when the component mounts
    const storedName = localStorage.getItem("studentName");
    if (storedName) {
      setStudentName(decodeURIComponent(storedName));
    }
  }, []); // Empty dependency array ensures this runs only once

  return (
    <>
      {/* Coordinate News Section */}
      {/* <div className="col-12 pt-5 d-flex justify-content-center">
        <p className="fs-5 text-primary">
          <span className="text-secondary">{coordinateNews}</span> coordinateNews
        </p>
      </div> */}

      {/* Welcome Section */}
      <div className="col-12 pt-4">
        <p className="fw-bold fs-3 text-secondary">
          Hi, <span className="text-primary">{studentName}</span>
        </p>
      </div>

      {/* Cards Section */}
      <div className="pt-4 d-flex flex-column flex-lg-row">
        <CourseDetailCard />
        <PaymentDetailCard />
        {/* <StudentProfile/> */}

      </div>

      {/* Classes Section */}
      <div className="mt-5 rounded-3 col-12">
        <div className="row gap-5 d-flex justify-content-center">
          {/* <div className="ms-4">
            Uncomment if you need a heading for the classes
            <h2 className="fw-semibold text-secondary">Today Classes</h2>
            <hr className="border border-3 w-50 border-primary" />
          </div> */}
{/* 
          Placeholder for Class Cards
          Uncomment when ClassCard component is ready */}
          {/* {/* <ClassCard /> */}
          {/* <ClassCard />
          <ClassCard />
          <ClassCard /> */}
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
