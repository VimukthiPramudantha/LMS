import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "../../css/student.css"; // Ensure this path is correct
import "bootstrap/dist/css/bootstrap.min.css";
import StudentJoinMeeting from "./StudentJoinMeeting";
import StudentDashboard from "./StudentDashboard";
import TimeTable from "./TimeTable";
import SeeAllAssignment from "./SeeAllAssignment";
import UploadAssignments from "./UploadAssignments";
import SeeAllExams from "./SeeAllExam";
import UploadExams from "./UploadExams";
import SeeAllAttendance from "./SeeAllAttendance";

const StudentDashboardMain = () => {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [activeLink, setActiveLink] = useState("Dashboard");
  const [studentId, setStudentId] = useState("User"); // Default value

  useEffect(() => {
    // Retrieve the student ID from localStorage when the component mounts
    const storedId = localStorage.getItem("studentID");
    if (storedId) {
      setStudentId(decodeURIComponent(storedId));
    }
  }, []); // Run once on mount

  const handleNavToggle = () => {
    setIsNavVisible(!isNavVisible);
  };

  const handleLinkClick = (name) => {
    setActiveLink(name);
  };

  const iconMapping = {
    Dashboard: "bi bi-app-indicator",
    "My Timetable": "bi bi-calendar2",
    Attendance: "bi bi-clipboard-check",
    Assignments: "bi bi-file-earmark-text",
    Exams: "bi bi-pencil-square",
    Payments: "bi bi-credit-card",
  };

  const handleSignOut = () => {
    // Clear localStorage
    localStorage.clear();
    // Redirect to login page or home page if needed
    // navigate('/login'); // Adjust the path based on your routing
  };

  return (
      <>
        <section
            id="body-pd"
            className={`body ${isNavVisible ? "" : "body-pd"} overflow-hidden mb-5`}
        >
          <header
              className={`header ${isNavVisible ? "" : "body-pd"} bg-primary`}
              id="header"
          >
            <div className="header_toggle" onClick={handleNavToggle}>
              <i
                  className={`bx text-light ${
                      isNavVisible ? "bi bi-list" : "bi bi-x"
                  }`}
                  id="header-toggle"
              ></i>
            </div>
            <div className="d-flex">
              <div>
                <i className="bi bi-person-circle fs-2 text-white"></i>
              </div>
              <div className="ps-3 d-flex align-items-center">
              <span className="nav_logo-name text-light fs-6">
                Student ID: <span>{localStorage.getItem("studentID")}</span>
              </span>
              </div>
            </div>
          </header>
          <div className={`l-navbar ${isNavVisible ? "" : "showDiv"}`} id="nav-bar">
            <nav className="nav">
              <div>
                <Link to="/authLoginStudent" className="nav_logo a">
                  <i className="bi bi-shop-window nav_logo-icon"></i>
                  <span className="nav_logo-name">
                  ACADEMIC <br /> DIVISION
                </span>
                </Link>
                <div className="nav_list">
                  {[
                    "Dashboard",
                    // "My Timetable",
                    // "Attendance",
                    // "Assignments",
                    // "Exams",
                    // "Payments",
                  ].map((name) => (
                      <Link
                          to={name.toLowerCase().replace(" ", "-")}
                          key={name}
                          className={`nav_link ${activeLink === name ? "active" : ""} a`}
                          onClick={() => handleLinkClick(name)}
                      >
                        <i className={`${iconMapping[name]} nav_icon`}></i>
                        <span className="nav_name">{name}</span>
                      </Link>
                  ))}
                </div>
              </div>
              <Link to="/authLoginStudent" onClick={handleSignOut} className="nav_link a">
                <i className="bi bi-box-arrow-left fs-5"></i>
                <span className="nav_name">SignOut</span>
              </Link>
            </nav>
          </div>
          {/* Routing Student Pages */}
          <Routes>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="join-class" element={<StudentJoinMeeting />} />
            <Route path="my-timetable" element={<TimeTable />} />
            <Route path="attendance" element={<SeeAllAttendance />} />
            <Route path="assignments" element={<SeeAllAssignment />} />
            <Route path="assignments/see" element={<UploadAssignments />} />
            <Route path="exams" element={<SeeAllExams />} />
            <Route path="exams/see" element={<UploadExams />} />
            <Route path="exams/see" element={<UploadExams />} />
            {/* <Route path="" element={<UploadExams />} /> */}
            {/* <Route path="manage-class/update-class" element={<UpdateClass />} /> */}

          </Routes>
          {/* Routing Student Pages */}
        </section>
      </>
  );
};

export default StudentDashboardMain;
