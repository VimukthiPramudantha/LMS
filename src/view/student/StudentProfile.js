import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "../../css/student.css"; // Ensure this path is correct
import "bootstrap/dist/css/bootstrap.min.css";
import EducationStudent from "./EducationStudent";
import AddStudentEduction from "./AddStudentEduction";
/*import AddStudentEducation from "./AddStudentEduction";
import AddStudentEduction from "./AddStudentEduction"; // Correct spelling*/

const StudentProfile = () => {
    const [isNavVisible, setIsNavVisible] = useState(true);
    const [activeLink, setActiveLink] = useState("Dashboard");

    const handleNavToggle = () => {
        setIsNavVisible(!isNavVisible);
    };

    const handleLinkClick = (name) => {
        setActiveLink(name);
    };

    const iconMapping = {
        Dashboard: "bi bi-app-indicator",
    };

    useEffect(() => {
        // Cleanup function if needed
        return () => {
            // Cleanup code if necessary
        };
    }, [isNavVisible]);

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
                            {/* Uncomment if you want to show Student ID */}
                            {/* <span className="nav_logo-name text-light fs-6">
                                Student ID: <span>NCR-2175</span>
                            </span> */}
                        </div>
                    </div>
                </header>
                <div
                    className={`l-navbar ${isNavVisible ? "" : "showDiv"}`}
                    id="nav-bar"
                >
                    <nav className="nav">
                        <div>
                            <Link to="/profile/dashboard" className="nav_logo">
                                <i className="bi bi-shop-window nav_logo-icon"></i>
                                <span className="nav_logo-name">
                                    Student <br /> Details
                                </span>
                            </Link>
                            <div className="nav_list">
                                {[
                                    "Dashboard",
                                ].map((name) => (
                                    <Link
                                        to={name.toLowerCase().replace(" ", "-")}
                                        key={name}
                                        className={`nav_link ${
                                            activeLink === name ? "active" : ""
                                        }`}
                                        onClick={() => handleLinkClick(name)}
                                    >
                                        <i className={`${iconMapping[name]} nav_icon`}></i>
                                        <span className="nav_name">{name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <Link to="/authLoginStudent" className="nav_link a">
                <i className="bi bi-box-arrow-left fs-5"></i>
                <span className="nav_name">SignOut</span>
              </Link>
                    </nav>
                </div>

                {/* Routing Student Pages */}
                <Routes>
                    <Route path="dashboard" element={<EducationStudent />} />
                    <Route path="manage-education" element={<AddStudentEduction />} />
                </Routes>
                {/* End of Routing */}
            </section>
        </>
    );
};

export default StudentProfile;
