import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "../../css/student.css"; // Make sure this path is correct
import "bootstrap/dist/css/bootstrap.min.css";
import ManageClass from "../commonPages/ManageClass";
import ManageStudent from "../commonPages/ManageStudent";
import AddStudent from "../commonPages/AddStudent";
import UpdateStudent from "../commonPages/UpdateStudent";
import ManageTeacher from "../commonPages/ManageTeacher";
import AddTeacher from "../commonPages/AddTeacher";
import UpdateTeacher from "../commonPages/UpdateTeacher";
import ManageSubject from "../commonPages/ManageSubject";
import AddSubject from "../commonPages/AddSubject";
import UpdateSubject from "../commonPages/UpdateSubject";
import Assignment from "../commonPages/Assignment";
import ManageAssignment from "../commonPages/ManageAssignment";
import Exams from "../commonPages/Exam";
import ManageExams from "../commonPages/ManageExams";
import AddExam from "../commonPages/AddExam";
import UpdateExam from "../commonPages/updateExam";
import UpdateClass from "../commonPages/UpdateClass";
import AddClass from "../commonPages/AddClass";
import AddAssignment from "../commonPages/AddAssignment";
import UpdateAssignment from "../commonPages/UpdateAssignment";
import DirectorDashboard from "./DirectorDashoard";
import ManageAdmin from "../commonPages/ManageAdmin";
import AddAdmin from "../commonPages/AddAdmin";
import UpdateAdmin from "../commonPages/UpdateAdmin";
import ManageAcademic from "../commonPages/ManageAcademic";
import AddAcademic from "../commonPages/AddAcademic";
import UpdateAcademic from "../commonPages/UpdateAcademic";
import ManageCampus from "../commonPages/ManageCampus";
import ManageCourse from "../commonPages/ManageCourse";
import AddPayment from "../commonPages/AddPayment";
import ManagePayment from "../commonPages/ManagePayment";
import ManageDirectorCoordinate from "../commonPages/ManageDirectorCoordinate";
// import DirectorDashboard from './DirectorDashoard';

const AdminDashboardMain = () => {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [activeLink, setActiveLink] = useState("Dashboard");
  const [selectedOption, setSelectedOption] = useState("defaultOption");

  const handleNavToggle = () => {
    setIsNavVisible(!isNavVisible);
  };

  const handleLinkClick = (name) => {
    setActiveLink(name);
    const section = document.getElementById(name.toLowerCase().replace(" ", "-"));
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const iconMapping = {
    Dashboard: "bi bi-app-indicator",
    "Manage Class": "bi bi-calendar2",
    "Manage Admin": "bi bi-clipboard-check",
    "Manage Campus": "bi bi-clipboard-check",
    "Manage Course": "bi bi-clipboard-check",
    "Manage Academic": "bi bi-clipboard-check",
    "Manage Student": "bi bi-clipboard-check",
    "Manage Teacher": "bi bi-clipboard-check",
    "Manage Subject": "bi bi-clipboard-check",
    "Manage Assignments": "bi bi-file-earmark-text",
    "Manage Exams": "bi bi-pencil-square",
    "Manage Payments": "bi bi-credit-card",
    "Reports": "bi bi-credit-card",
  };

  useEffect(() => {
    return () => {
      // Cleanup code if necessary
    };
  }, [isNavVisible]);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
      <>
        <section
            id="body-pd"
            className={`body ${isNavVisible ? "body-pd" : ""} bg-light mb-5`}
        >
          <header
              className={`header ${isNavVisible ? "body-pd" : ""}`}
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
            <div className="">
              <div className="ps-3 d-flex align-items-center">
                <span className="nav_logo-name text-light">Hi, Sanchitha Heshan</span>
              </div>
            </div>
            <div className="d-flex">
              <select
                  value={selectedOption}
                  onChange={handleChange}
                  className="form-select"
              >
                <option value="defaultOption">Select Institute To Manage</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
              </select>
            </div>
          </header>
          <div
              className={`l-navbar ${isNavVisible ? "showDiv" : ""} `}
              id="nav-bar"
          >
            <nav className="nav overflow-y-auto">
              <div>
                <Link to="#" className="nav_logo a">
                  <i className="bi bi-shop-window nav_logo-icon"></i>
                  <span className="nav_logo-name">
                  ACADEMIC <br /> DIVISION
                </span>
                </Link>
                <Link to="#" className="nav_logo a">
                  <i className="bi bi-person-circle nav_logo-icon"></i>
                  <span className="nav_logo-name">Admin ID:<br /> 22305</span>
                </Link>
                <div className="nav_list">
                  {[
                    "Dashboard",
                    "Manage Class",
                    "Manage Admin",
                    "Manage Campus",
                    "Manage Course",
                    "Manage Academic",
                    "Manage Student",
                    "Manage Teacher",
                    "Manage Subject",
                    "Manage Assignments",
                    "Manage Exams",
                    "Manage Payments",
                    "Reports",
                  ].map((name) => (
                      <Link
                          to={name.toLowerCase().replace(" ", "-")}
                          id={name.toLowerCase().replace(" ", "-")}
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
              <Link to="#" className="nav_link a">
                <i className="bi bi-box-arrow-left fs-5"></i>
                <span className="nav_name">SignOut</span>
              </Link>
            </nav>
          </div>
          {/* Routing Academic Pages */}
          <Routes>
            <Route path="dashboard" element={<DirectorDashboard />} />
            <Route path="manage-class" element={<ManageClass />} />
            <Route path="manage-admin" element={<ManageAdmin />} />
            <Route path="manage-admin/add-admin" element={<ManageAdmin />} />
            <Route path="manage-campus" element={<ManageCampus />} />
            <Route path="manage-campus/add-campus" element={<ManageCampus />} />
            <Route path="manage-course" element={<ManageCourse />} />
            <Route path="manage-course/add-course" element={<ManageCampus />} />
            <Route path="manage-student" element={<ManageStudent />}/>
            <Route path="manage-student/add-student" element={<AddStudent />} />
            <Route path="manage-coordinate" element={<ManageDirectorCoordinate />}/>
            <Route path="manage-student/update-student" element={<UpdateStudent />} />
            <Route path="manage-teacher" element={<ManageTeacher />} />
            <Route path="manage-teacher/add-teacher" element={<AddTeacher />} />
            <Route path="manage-teacher/update-teacher" element={<UpdateTeacher />} />
            <Route path="manage-subject" element={<ManageSubject />} />
            <Route path="manage-subject/add-subject" element={<AddSubject />} />
            <Route path="manage-subject/update-subject" element={<UpdateSubject />} />
            <Route path="manage-payments" element={<ManagePayment/>} />
            <Route path="manage-payments/add-paymnet" element={<AddPayment/>} />
            <Route path="manage-Assignments" element={<Assignment />} />
            <Route path="manage-Assignments/manage" element={<ManageAssignment />} />
            <Route path="manage-Assignments/manage/add" element={<AddAssignment />} />
            <Route path="manage-Assignments/manage/update" element={<UpdateAssignment />} />
            <Route path="manage-exams" element={<Exams />} />
            <Route path="manage-exams/manage" element={<ManageExams />} />
            <Route path="manage-exams/manage/add" element={<AddExam />} />
            <Route path="manage-exams/manage/update" element={<UpdateExam />} />
            <Route path="manage-class/add-class" element={<AddClass />} />
            <Route path="manage-class/update-class" element={<UpdateClass />} />
            <Route path="manage-admin/add-admin" element={<AddAdmin />} />
            <Route path="manage-admin/update-admin" element={<UpdateAdmin />} />
            <Route path="manage-academic" element={<ManageAcademic />} />
            <Route path="manage-academic/add-academic" element={<AddAcademic />} />
            <Route path="manage-academic/update-academic" element={<UpdateAcademic />} />
          </Routes>
          {/* Routing Academic Pages */}
        </section>
      </>
  );
};

export default AdminDashboardMain;
