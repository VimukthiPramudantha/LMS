import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "../../css/student.css"; // Make sure this path is correct
import "bootstrap/dist/css/bootstrap.min.css";

import AccountantDashboard from "./AccountantDashboard";
import ManageStudent from "./ManageStudent";
import AddStudentInstallment from "./AddStudentInstallment";

const ITExicutiveDashboardMain = () => {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [activeLink, setActiveLink] = useState("Dashboard");

  const handleNavToggle = () => {
    setIsNavVisible(!isNavVisible);
  };

  const handleLinkClick = (name) => {
    setActiveLink(name);
  };

  const handleSignOut = () => {
    // Clear localStorage
    localStorage.clear();
  
    
    // Optionally, redirect to login page or home page
    //navigate('/login'); // Adjust the path based on your routing
  };

  const iconMapping = {
    "Dashboard": "bi bi-app-indicator",
    "Students": "bi bi-clipboard-check",
    "Subjects": "bi bi-clipboard-check",
    "Meeting": "bi bi-clipboard-check",
    "Manage Assignments": "bi bi-file-earmark-text",
    "Manage Exams": "bi bi-pencil-square",
    "Payments": "bi bi-credit-card",
    "Manage Campus": "bi bi-clipboard-check",
    "Manage Course": "bi bi-clipboard-check",
    "Show Coordinators": "bi bi-clipboard-check",
    "Manage IT": "bi bi-clipboard-check",
    "Manage Student": "bi bi-clipboard-check",
    "Manage Teacher": "bi bi-clipboard-check",
    "Manage Subject": "bi bi-clipboard-check",
    "Manage Payments": "bi bi-credit-card",
  };

  useEffect(() => {
    // You can add code here to handle any side effects if needed
    // For example, initializing libraries or event listeners

    // Cleanup function if needed
    return () => {
      // Cleanup code if necessary
    };
  }, [isNavVisible]); // Dependencies, if any

  const storedName = localStorage.getItem("name");
  const userName = storedName ? decodeURIComponent(storedName) : 'User';

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

          <div className="d-flex">
            <div>
              <i className="bi bi-person-circle fs-2 text-white"></i>
            </div>
            <div className="d-flex align-items-center">
                <span className="nav_logo-name text-light">Hi, {userName}</span>
              </div>
          </div>
        </header>
        <div className={`l-navbar ${isNavVisible ? "showDiv" : ""}`} id="nav-bar">
          <nav className="nav">
            <div className="overflow-x-auto">
              <Link to="#" className="nav_logo a">
                <i className="bi bi-shop-window nav_logo-icon"></i>
                <span className="nav_logo-name">
                  ACADEMIC <br /> DIVISION
                </span>
              </Link>
              <div className="nav_list overflow-auto">
                {[
                  "Dashboard",
                  // "Manage Subject",
                  "Manage Student",
                  // "Manage Course",
                  // "Manage Payments",
                  // "Show Coordinators",
                ].map((name) => (
                  <Link
                    to={name.toLowerCase().replace(" ", "-")}
                    key={name}
                    className={`nav_link ${
                      activeLink === name ? "active" : ""
                    } a`}
                    onClick={() => handleLinkClick(name)}
                  >
                    <i className={`${iconMapping[name]} nav_icon`}></i>
                    <span className="nav_name">{name}</span>
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/login" className="nav_link a d-flex align-items-center" onClick={handleSignOut}>
                <i className="bi bi-box-arrow-left fs-5 me-2"></i>
                <span className="nav_name">Sign Out</span>
              </Link>
          </nav>
        </div>
        {/* Routing Academic Pages */}
        <Routes>
          <Route path="dashboard" element={<AccountantDashboard />} />
          {/* Add other routes here */}
          <Route path="manage-student" element={<ManageStudent />} />
          <Route path="manage-student/add-student-installment" element={<AddStudentInstallment />} />


        


        </Routes>
      </section>
    </>
  );
};

export default ITExicutiveDashboardMain;
