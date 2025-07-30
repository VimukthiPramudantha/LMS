import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ManageCourse = () => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [selectedCampusId, setSelectedCampusId] = useState("");
  const [editedCourse, setEditedCourse] = useState({
    courseTitle: "",
    courseLevel: "",
    courseDuration: "",
    totalCourseFee: "",
    subject: "",
    campus: "",
    language: "",
  });

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        "https://lmsacademicserver.netlify.app/api/course/getAllCourses"
      );
      const coursesData = response.data.courses || [];
      setCourses(coursesData);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError("Error fetching courses");
    }
  };

  // Fetch all subjects
  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        "https://lmsacademicserver.netlify.app/api/subject/getAllSubjects"
      );
      setSubjects(response.data.subjects || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      setError("Error fetching subjects");
    }
  };

  // Fetch all campuses
  const fetchCampuses = async () => {
    try {
      const response = await axios.get(
        "https://lmsacademicserver.netlify.app/api/campus/getAllCampuses"
      );
      if (Array.isArray(response.data)) {
        setCampuses(response.data);
      } else if (response.data && Array.isArray(response.data.campus)) {
        setCampuses(response.data.campus);
      } else {
        console.error("Unexpected response format for campus:", response.data);
        setCampuses([]);
      }
    } catch (err) {
      console.error("Error fetching campus:", err);
      setError("Failed to load campus.");
      setCampuses([]);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchSubjects();
    fetchCampuses();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle campus selection and filter courses by selected campus
  const handleCampusSelect = (e) => {
    setSelectedCampusId(e.target.value);
  };

  // Filter courses based on search term and selected campus ID
  const filteredCourses = courses.filter((course) => {
    const matchesSearchTerm = course.courseTitle
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSelectedCampus = selectedCampusId
      ? course.campus.some((camp) => camp._id === selectedCampusId)
      : true;
    return matchesSearchTerm && matchesSelectedCampus;
  });

  // Start editing a course
  const handleEditClick = (course) => {
    setEditingCourseId(course._id);
    setEditedCourse({
      courseTitle: course.courseTitle,
      courseLevel: course.courseLevel,
      courseDuration: course.courseDuration,
      totalCourseFee: course.totalCourseFee,
      subject: course.subject[0] || "",
      campus: course.campus[0] || "",
      language: course.language,
    });
  };

  // Save changes to the course
  const handleSaveClick = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `https://lmsacademicserver.netlify.app/api/course/updateCourse/${editingCourseId}`,
        editedCourse,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditingCourseId(null);
      setEditedCourse({
        courseTitle: "",
        courseLevel: "",
        courseDuration: "",
        totalCourseFee: "",
        subject: "",
        campus: "",
        language: "",
      });

      fetchCourses();
    } catch (error) {
      console.error("Error updating course:", error);
      setError("Error updating course");
    }
  };

  // Cancel editing mode
  const handleCancelClick = () => {
    setEditingCourseId(null);
    setEditedCourse({
      courseTitle: "",
      courseLevel: "",
      courseDuration: "",
      totalCourseFee: "",
      subject: "",
      campus: "",
      language: "",
    });
  };

  return (
    <div className="col-12 bg-light">
      <div className="row">
        <h2 className="fw-bold mt-5">Manage Courses</h2>

        <div className="col-12 col-lg-4 offset-0 offset-lg-8 d-flex gap-2 mt-4">
          <input
            className="form-control"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />

          <Link to="add-course" type="button" className="btn btn-primary">
            Create New Course
          </Link>
        </div>

        <div className="col-12 col-lg-4 mt-4">
          <select
            className="form-select"
            value={selectedCampusId}
            onChange={handleCampusSelect}
          >
            <option value="" disabled>
              Select Campus
            </option>
            {campuses.map((campus) => (
              <option key={campus._id} value={campus._id}>
                {campus.campusName}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="text-danger mt-3">{error}</p>}

        <div className="col-12 overflow-x-auto">
          <div className="m-1 table-responsive">
            <div className="p-2">
              <p className="fw-bold fs-5 text-black-50">All Courses</p>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Course Title</th>
                  <th scope="col">Course Level</th>
                  <th scope="col">Course Duration</th>
                  <th scope="col">Course Subject</th>
                  <th scope="col">Orientation Day</th>
                  <th scope="col">Campus</th>
                  <th scope="col">Total Course Fee</th>
                  <th scope="col">Language</th>
                  <th scope="col">Created Date</th>
                  <th scope="col">Updated Date</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <tr key={course._id}>
                      <td>
                        {editingCourseId === course._id ? (
                          <input
                            type="text"
                            value={editedCourse.courseTitle}
                            onChange={(e) =>
                              setEditedCourse({
                                ...editedCourse,
                                courseTitle: e.target.value,
                              })
                            }
                          />
                        ) : (
                          course.courseTitle
                        )}
                      </td>
                      <td>
                        {editingCourseId === course._id ? (
                          <input
                            type="text"
                            value={editedCourse.courseLevel}
                            onChange={(e) =>
                              setEditedCourse({
                                ...editedCourse,
                                courseLevel: e.target.value,
                              })
                            }
                          />
                        ) : (
                          course.courseLevel
                        )}
                      </td>
                      <td>
                        {editingCourseId === course._id ? (
                          <input
                            type="text"
                            value={editedCourse.courseDuration}
                            onChange={(e) =>
                              setEditedCourse({
                                ...editedCourse,
                                courseDuration: e.target.value,
                              })
                            }
                          />
                        ) : (
                          course.courseDuration
                        )}
                      </td>
                      <td>
                        {editingCourseId === course._id ? (
                          <select
                            value={editedCourse.subject}
                            onChange={(e) =>
                              setEditedCourse({
                                ...editedCourse,
                                subject: e.target.value,
                              })
                            }
                            className="form-control"
                          >
                            <option value="">Select Subject</option>
                            {subjects.map((subject) => (
                              <option key={subject._id} value={subject._id}>
                                {subject.subjectName}
                              </option>
                            ))}
                          </select>
                        ) : (
                          course.subject
                            .map((sub) => sub.subjectName)
                            .join(", ")
                        )}
                      </td>
                      <td>
                        {editingCourseId === course._id ? (
                          <input
                            type="text"
                            value={editedCourse.orientationDay}
                            onChange={(e) =>
                              setEditedCourse({
                                ...editedCourse,
                                orientationDay: e.target.value,
                              })
                            }
                          />
                        ) : (
                          course.orientationDay
                        )}
                      </td>
                      <td>
                        {editingCourseId === course._id ? (
                          <select
                            value={editedCourse.campus}
                            onChange={(e) =>
                              setEditedCourse({
                                ...editedCourse,
                                campus: e.target.value,
                              })
                            }
                            className="form-control"
                          >
                            <option value="">Select Campus</option>
                            {campuses.map((campus) => (
                              <option key={campus._id} value={campus._id}>
                                {campus.campusName}
                              </option>
                            ))}
                          </select>
                        ) : (
                          course.campus
                            .map((camp) => camp.campusName)
                            .join(", ")
                        )}
                      </td>
                      <td>
                        {editingCourseId === course._id ? (
                          <input
                            type="text"
                            value={editedCourse.totalCourseFee}
                            onChange={(e) =>
                              setEditedCourse({
                                ...editedCourse,
                                totalCourseFee: e.target.value,
                              })
                            }
                          />
                        ) : (
                          course.totalCourseFee
                        )}
                      </td>
                      <td>
                        {editingCourseId === course._id ? (
                          <input
                            type="text"
                            value={editedCourse.language}
                            onChange={(e) =>
                              setEditedCourse({
                                ...editedCourse,
                                language: e.target.value,
                              })
                            }
                          />
                        ) : (
                          course.language
                        )}
                      </td>
                      <td>{new Date(course.createdAt).toLocaleDateString()}</td>
                      <td>{new Date(course.updatedAt).toLocaleDateString()}</td>
                      <td>
                        {editingCourseId === course._id ? (
                          <>
                            <button
                              className="btn btn-success"
                              onClick={handleSaveClick}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={handleCancelClick}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn btn-primary"
                            onClick={() => handleEditClick(course)}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10">No courses found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCourse;
