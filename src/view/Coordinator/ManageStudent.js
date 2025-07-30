import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageStudent = () => {
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
  const [showManageStudentsModal, setShowManageStudentsModal] = useState(false);
  const navigate = useNavigate();

  // Existing useEffect hooks remain unchanged
  useEffect(() => {
    const assignedCampusId = localStorage.getItem("assignCampus");
    if (assignedCampusId) {
      setUserCampus({ campusName: assignedCampusId.replace(/[\[\]"]/g, "") });
    }
    const fetchCampusDetails = async (campusId) => {
      try {
        const response = await axios.get(
          `https://primelms-server.netlify.app/api/campus/getCampusById/${campusId}`
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
          "https://primelms-server.netlify.app/api/coordinatorAddStudent/getAllStudents"
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
          "https://primelms-server.netlify.app/api/campus/getAllCampuses"
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

  const handleEditClick = (student) => {
    navigate("add-student-installment", { state: student });
  };

  const handleCampusSelect = (e) => {
    const campusId = e.target.value;
    setSelectedCampusId(campusId);

    if (campusId) {
      const filtered = students.filter(
        (student) => student.campusName === campusId
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  };

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    const filtered = students.filter((student) =>
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const handleCreateNewStudentClick = async () => {
    if (!userCampus?._id) {
      alert("Campus information not available");
      return;
    }

    setLoadingCourses(true);
    setShowCourseModal(true);

    try {
      const response = await axios.get(
        `https://primelms-server.netlify.app/api/course/getCoursesByCampus/${userCampus._id}`
      );
      setCourses(response.data.courses || response.data);
      console.log("Courses for campus:", response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      alert("Failed to fetch courses for this campus");
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setShowCourseModal(false);
  };

  const handleRegisterNewStudent = () => {
    navigate("add-student", { state: { selectedCourse } });
  };

  // Updated handleManageStudents to fetch students by course ID
  const handleManageStudents = async () => {
    if (!selectedCourse?._id) {
      alert("Please select a course first");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://primelms-server.netlify.app/api/coordinatorAddStudent/getStudentbycourse/${selectedCourse._id}`
      );
      setFilteredStudents(response.data); // Update filteredStudents with API response
      setShowManageStudentsModal(true);
    } catch (error) {
      console.error("Error fetching students by course:", error);
      alert("Failed to fetch students for this course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetStudents = () => {
    const campusStudents = students.filter(
      (student) => student.campusName === userCampus?.campusName
    );
    setFilteredStudents(campusStudents);
    setShowManageStudentsModal(false);
  };

  if (loading) {
    return <div>Loading students...</div>;
  }

  return (
    <div className="col-12 bg-light">
      <div className="row">
        <h2 className="fw-bold mt-5">
          Select Course - {userCampus?.campusName}
        </h2>
        <div
          className="m-2 shadow-sm p-4"
          style={{ border: "3px solid #059888", borderRadius: "10px" }}
        >
          {selectedCourse ? (
            <div className="d-flex flex-column gap-3 mt-3">
              <h5>
                Selected Course: {selectedCourse.courseTitle} -{" "}
                {selectedCourse.orientationDay}
              </h5>
              <div className="d-flex gap-3">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleRegisterNewStudent}
                >
                  Register New Student for This Course
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleManageStudents}
                >
                  Manage Registered Students
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setSelectedCourse(null);
                    const campusStudents = students.filter(
                      (student) => student.campusName === userCampus?.campusName
                    );
                    setFilteredStudents(campusStudents);
                  }}
                >
                  Change Course
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCreateNewStudentClick}
            >
              Select Course
            </button>
          )}
        </div>

        {/* Course Selection Modal */}
        {showCourseModal && (
          <div
            className="modal"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Select a Course</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCourseModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  {loadingCourses ? (
                    <div>Loading courses...</div>
                  ) : courses.length > 0 ? (
                    <div className="list-group">
                      {courses.map((course) => (
                        <button
                          key={course._id}
                          type="button"
                          className="list-group-item list-group-item-action"
                          onClick={() => handleCourseSelect(course)}
                        >
                          {course.courseTitle} - {course.orientationDay} -{" "}
                          {course.language}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div>No courses available for this campus</div>
                  )}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCourseModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manage Students Modal */}
        {showManageStudentsModal && (
          <div
            className="modal"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    Students for {selectedCourse?.courseTitle}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowManageStudentsModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div
                    className="col-12 m-2 overflow-x-auto"
                    style={{ border: "3px solid #059888", borderRadius: "10px" }}
                  >
                    <div className="m-1 table-responsive">
                      <div className="p-2">
                        <p className="fw-bold fs-5 text-black-50">
                          Students for {selectedCourse?.courseTitle}
                        </p>
                      </div>

                      <table className="table">
                        <thead>
                          <tr>
                            <th scope="col">Index No</th>
                            <th scope="col">Campus Name</th>
                            <th scope="col">Student ID</th>
                            <th scope="col">Student Name</th>
                            <th scope="col">Whatsapp Number</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.length > 0 ? (
                            filteredStudents.map((student, index) => (
                              <tr key={student._id}>
                                <td>{index + 1}</td>
                                <td>{student.campusName}</td>
                                <td>{student.studentID}</td>
                                <td>{student.studentName}</td>
                                <td>{student.whatsAppMobileNo1}</td>
                                <td>
                                  <button
                                    type="button"
                                    className="btn btn-warning py-0"
                                    onClick={() => handleEditClick(student)}
                                  >
                                    Pay Installment
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center">
                                No students found for this course.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowManageStudentsModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageStudent;