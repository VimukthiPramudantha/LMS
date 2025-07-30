import "../../css/student.css"; // Make sure this path is correct
import "bootstrap/dist/css/bootstrap.min.css";
// import DayCardCompornant from "../compornants/DayCardCompornant";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

const AcademicManagerDashboard = () => {
  const day = new Date().toLocaleString("en-us", { weekday: "long" });
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [selectedCampusId, setSelectedCampusId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [userCampus, setUserCampus] = useState(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const assignedCampusId = localStorage.getItem("assignCampus");
    console.log(assignedCampusId);
    if (assignedCampusId) {
      setUserCampus({ campusName: assignedCampusId.replace(/[\[\]"]/g, "") });
    }
    const fetchCampusDetails = async (campusId) => {
      try {
        const response = await axios.get(
          `https://lmsacademicserver.netlify.app/api/campus/getCampusById/${campusId}`
        );
        setUserCampus(response.data);
      } catch (error) {
        console.error("Error fetching campus details:", error);
        alert("Failed to fetch campus details. Please try again.");
      }
    };

    if (assignedCampusId) {
      fetchCampusDetails(assignedCampusId.replace(/[\[\]"]/g, ""));
    }
  }, []);

  useEffect(() => {
    const loggedInUser = {
      name: localStorage.getItem("name"),
      role: localStorage.getItem("role"),
      token: localStorage.getItem("token"),
      id: localStorage.getItem("id"),
      coordID: localStorage.getItem("coordID"),
      assignCampus: localStorage.getItem("assignCampus"),
    };

    console.log("Logged-in User Data:", loggedInUser);

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://lmsacademicserver.netlify.app/api/coordinatorAddStudent/getAllStudents"
        );
        setStudents(response.data);
        setFilteredStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
        alert("Failed to fetch students. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCampuses = async () => {
      try {
        const response = await axios.get(
          "https://lmsacademicserver.netlify.app/api/campus/getAllCampuses"
        );
        setCampuses(response.data.campus || response.data);
      } catch (error) {
        console.error("Error fetching campuses:", error);
        alert("Failed to fetch campuses. Please try again.");
      }
    };

    fetchStudents();
    fetchCampuses();
  }, []);

  return (
    <>
      <br />
      <div className="container mt-5 pb-5">
        <div className="row justify-content-center">
          <div className="col-12 mt-5 ">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h2 className="welcome-message text-success">
                  Welcome to Coordinator Dashboard
                </h2>
              </div>
            </div>
            <div className="col-12 mb-4">
              <div className="card shadow-sm">
                <div className="card-body text-center">
                  <h5 className="card-title text-primary">Today's Date</h5>
                  <p className="card-text text-secondary">
                    {new Date().toLocaleDateString()} - {day}
                  </p>
                </div>
              </div>
              -
            </div>

          </div>

          {/* <DayCardCompornant /> */}
        </div>
      </div>
    </>
  );
};

export default AcademicManagerDashboard;
