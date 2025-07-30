import { Link } from "react-router-dom";
import React from "react";
import { useEffect } from "react";

const EducationStudent = () => {

    useEffect(() => {
        const reloadOnce = () => {
            if (!sessionStorage.getItem("reloaded")) {
                sessionStorage.setItem("reloaded", "true");
                window.location.reload();
            }
        };
        reloadOnce();
    }, []);
      
    const studentId = localStorage.getItem("studentID");
    const studentWP = localStorage.getItem("studentWP");
    // const studentPortalAccesslocal = localStorage.getItem("studentPortalAccess");
    const studentObjectId = localStorage.getItem("studentObjectId");
    const studentName = localStorage.getItem("studentName");
    
    const studentPortalAccess = localStorage.getItem("studentPortalAccess");

    //fetching student by id get details
    useEffect(() => {
        const fetchStudentPortalAccess = async () => {
            try {
                const response = await fetch(`https://primelms-server.netlify.app/api/coordinatorAddStudent/getStudent/${studentObjectId}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.portalAccess !== undefined) {
                        localStorage.setItem("studentPortalAccess", data.portalAccess.toString());
                    }
                } else {
                    console.error("Failed to fetch student data:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching student data:", error);
            }
        };

        if (studentObjectId) {
            fetchStudentPortalAccess();
        }
    }, [studentObjectId]);

    console.log(studentId, studentWP, studentPortalAccess, studentObjectId);
    return (
        
        <div className="container-fluid min-vh-80 bg-light d-flex align-items-center justify-content-center">
            <div className="row w-100 px-4">
                <div className="mt-2 col-12 text-center mb-4" style={{border: "2px solid rgb(19, 22, 194)", borderRadius: "10px" }}>
                    <h2 className="fw-bold mt-5 mb-4">Student Dashboard</h2>
                    <h3 className="fw-bold "style={{color:"#565999"}}>{studentId}-{studentName}</h3>
                </div>

                {/* Card for Personal Details */}
                <div className="col-md-6 col-sm-12 mb-4 d-flex justify-content-center">
                    <div className="card shadow-lg text-center p-4" style={{ width: "350px", border: "2px solid  rgb(19, 22, 194)", borderRadius: "10px" }}>
                        <div className="d-flex justify-content-center">
                            <img
                                src="https://img.freepik.com/free-vector/demand-insurance-service-digital-insurer-mobile-app-innovative-business-model-female-customer-ordering-insurance-policy-online_335657-1156.jpg?t=st=1732642055~exp=1732645655~hmac=7eb8d6badd54c99af320b1c36ddf153c3925dbb56d57eee69ad1c9eae6b3aca3&w=740"
                                alt="Personal Details"
                                className="card-img-top rounded"
                                style={{ height: "200px", width: "200px", objectFit: "cover" }}
                            />
                        </div>
                        <div className="card-body">
                            <h3 className="card-title mb-3">Personal Details</h3>
                            <p className="card-text text-muted">
                                Add or update your personal details.
                            </p>
                            {studentPortalAccess === "false" ? (
                                <Link
                                   to="/profile/manage-education"
                                    className="btn btn-primary"
                                    style={{ fontSize: "18px" }}
                                >
                                    Add Personal Details
                                </Link>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    style={{ fontSize: "18px", cursor: "not-allowed", opacity: 0.6 }}
                                    disabled
                                >
                                    Access Denied
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Card for Student Portal */}
                <div className="col-md-6 col-sm-12 mb-4 d-flex justify-content-center">
                    <div className="card shadow-lg text-center p-4" style={{ width: "350px", border: "2px solid  rgb(19, 22, 194)", borderRadius: "10px" }}>
                        <div className="d-flex justify-content-center">
                            <img
                                src="https://img.freepik.com/free-vector/virtual-graduation-ceremony_23-2148571392.jpg?t=st=1732641796~exp=1732645396~hmac=619fc260aa9f8b85f4b438b07b8a5f459f358e990d1875df908de98615535424&w=740"
                                alt="Student Portal"
                                className="card-img-top rounded"
                                style={{ height: "200px", width: "200px", objectFit: "cover" }}
                            />
                        </div>
                        <div className="card-body">
                            <h3 className="card-title mb-3">Student Portal</h3>
                            <p className="card-text text-muted">
                                Go back to your student portal for more details.
                            </p>
                            {studentPortalAccess === "true" ? (
                                <Link
                                    to="/student"
                                    className="btn btn-primary"
                                    style={{ fontSize: "18px" }}
                                >
                                    Go to Student Portal
                                </Link>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    style={{ fontSize: "18px", cursor: "not-allowed", opacity: 0.6 }}
                                    disabled
                                >
                                    Access Denied
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EducationStudent;