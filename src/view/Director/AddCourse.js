import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [orientationDay, setOrientationDay] = useState("");
  const [courseLevel, setCourseLevel] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [totalCourseFee, setTotalCourseFee] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [campus, setCampus] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState("");
  const [language, setLanguage] = useState("");
  const [backendWhatsappNumber, setBackendWhatsappNumber] = useState("");
  const [initialStudentNumber, setInitialStudentNumber] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const incrementValue = () => {
    setTotalCourseFee((prevValue) => prevValue + 1000);
  };

  const decrementValue = () => {
    setTotalCourseFee((prevValue) =>
      prevValue - 1000 < 0 ? "" : prevValue - 1000
    );
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(
          "https://lmsacademicserver.netlify.app/api/subject/getAllSubjectsNoLimit"
        );
        console.log("Fetched subjects:", response.data);

        if (Array.isArray(response.data)) {
          setSubjects(response.data);
        } else if (response.data && Array.isArray(response.data.subjects)) {
          setSubjects(response.data.subjects);
        } else {
          console.error(
            "Unexpected response format for subjects:",
            response.data
          );
          setSubjects([]);
        }
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setError("Failed to load subjects.");
        setSubjects([]);
      }
    };

    fetchSubjects();
  }, []);

  useEffect(() => {
    const fetchCampus = async () => {
      try {
        const response = await axios.get(
          "https://lmsacademicserver.netlify.app/api/campus/getAllCampuses"
        );
        console.log("Fetched campus:", response.data);

        if (Array.isArray(response.data)) {
          setCampus(response.data);
        } else if (response.data && Array.isArray(response.data.campus)) {
          setCampus(response.data.campus);
        } else {
          console.error(
            "Unexpected response format for campus:",
            response.data
          );
          setCampus([]);
        }
      } catch (err) {
        console.error("Error fetching campus:", err);
        setError("Failed to load campus.");
        setCampus([]);
      }
    };

    fetchCampus();
  }, []);

  const handleAddCourse = async () => {
    if (
      !courseTitle ||
      !courseLevel ||
      !orientationDay ||
      !courseDuration ||
      !totalCourseFee ||
      selectedSubjects.length === 0 ||
      !selectedCampus
    ) {
      setError(
        "Please fill in all the fields and select at least one subject and campus."
      );
      return;
    }

    const newCourse = {
      courseTitle,
      courseLevel,
      courseDuration,
      orientationDay,
      totalCourseFee: parseFloat(totalCourseFee.toString().replace(/,/g, "")),
      subject: selectedSubjects,
      campus: selectedCampus, // Add the selected campus
      language,
      backendWhatsappNumber,
      initialStudentNumber: parseInt(initialStudentNumber, 10),
      courseCode,
    };

    setLoading(true);

    try {
      const response = await axios.post(
        "https://lmsacademicserver.netlify.app/api/course/create",
        newCourse,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("Course added successfully!");
        setCourseTitle("");
        setCourseLevel("");
        setCourseDuration("");
        setTotalCourseFee("");
        setSelectedSubject("");
        setSelectedSubjects([]);
        setBackendWhatsappNumber("");
        setInitialStudentNumber("");
        setCourseCode("");
        setError("");
        navigate(-1);
      }
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Failed to add the course. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSelect = () => {
    if (selectedSubject) {
      setSelectedSubjects((prevSubjects) => [...prevSubjects, selectedSubject]);
      setSelectedSubject("");
    }
  };

  const handleRemoveSubject = (subjectId) => {
    setSelectedSubjects(selectedSubjects.filter((id) => id !== subjectId));
  };

  return (
    <div className="form-bg-image">
      <div className="col-12 d-flex justify-content-center mt-4">
        <div className="row col-lg-6 shadow-lg m-3 rounded-3 h-auto mt-4 p-3 formColour border border-3 border-end-0 border-start-0 border-primary">
          <h4 className="fw-bold text-black-50 mt-3 mb-4">Create New Course</h4>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="input-group mb-3">
            <span className="input-group-text fw-bold">
              Course Title&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </span>
            <input
              type="text"
              className="form-control"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              placeholder="Enter Course Title"
              aria-label="Course Title"
              required
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text fw-bold">
              Orientation Day&nbsp;&nbsp;&nbsp;:
            </span>
            <select
              className="form-select"
              value={orientationDay}
              onChange={(e) => setOrientationDay(e.target.value)}
              aria-label="Select Orientation Day"
              required
            >
              <option value="">Select a Day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>

          {/* Add ot</div>her fields like campus, course level, duration, subjects, and fee */}
          <div className="input-group mb-3">
            <span className="input-group-text fw-bold">
              Select Campus&nbsp;&nbsp;&nbsp;:
            </span>
            <select
              className="form-select"
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              aria-label="Select Campus"
              required
            >
              <option value="">Select a Campus</option>
              {campus.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.campusName}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text fw-bold">
              Language&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </span>
            <select
              className="form-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Course Language"
              required
            >
              <option value="">Select a Language</option>
              <option value="Sinhala">Sinhala</option>
              <option value="English">English</option>
            </select>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text fw-bold">
              Course Level&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </span>
            <select
              className="form-select"
              value={courseLevel}
              onChange={(e) => setCourseLevel(e.target.value)}
              aria-label="Course Level"
              required
            >
              <option value="">Select a Level</option>
              <option value="Foundation">Foundation</option>
              <option value="Foundation">Certificate</option>
              <option value="Diploma">Diploma</option>
              <option value="Higher Diploma">Higher Diploma</option>
              <option value="General Degree">General Degree</option>
              <option value="Special Degree">Special Degree</option>
              <option value="Postgraduate Diploma">Postgraduate Diploma</option>
              <option value="Master">Master</option>
              <option value="PHD">PHD</option>
            </select>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text fw-bold">
              Course Duration&nbsp;:
            </span>
            <select
              className="form-select"
              value={courseDuration}
              onChange={(e) => setCourseDuration(e.target.value)}
              aria-label="Course Duration"
              required
            >
              <option value="">Select a Duration</option>
              <option value="1 Months">1 Months</option>
              <option value="2 Months">2 Months</option>
              <option value="3 Months">3 Months</option>
              <option value="4 Months">4 Months</option>
              <option value="6 Months">6 Months</option>
              <option value="1 Years">1 Years</option>
              <option value="1 1/2 Years">1 1/2 Years</option>
              <option value="2 Years">2 Years</option>
              <option value="3 Years">3 Years</option>
              <option value="4 Years">4 Years</option>
            </select>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text fw-bold">
              Backend WhatsApp Number&nbsp;:
            </span>
            <input
              type="text"
              className="form-control"
              value={backendWhatsappNumber}
              onChange={(e) => setBackendWhatsappNumber(e.target.value)}
              placeholder="Enter WhatsApp Number"
              required
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text fw-bold">
              Initial Student
              Number&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </span>
            <input
              type="number"
              className="form-control"
              value={initialStudentNumber}
              onChange={(e) => setInitialStudentNumber(e.target.value)}
              placeholder="Enter Initial Student Number"
              required
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text fw-bold">
              Course
              Code&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </span>
            <input
              type="text"
              className="form-control"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="Enter Course Code"
              required
            />
          </div>

          <div className="input-group mb-3 gap-2">
            <span className="input-group-text fw-bold">
              Total Course
              Fee&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </span>
            {/* <input
                            type="text"
                            className="form-control"
                            value={totalCourseFee.toLocaleString()}
                            onChange={(e) => {
                                const parsedValue = Number(e.target.value.replace(/,/g, ''));
                                setTotalCourseFee(isNaN(parsedValue) ? "" : parsedValue);
                            }}
                            placeholder="Enter Total Course Fee"
                            aria-label="Total Course Fee"
                            required
                        />
                        <button
                            type="button"
                            className="btn btn-primary ms-2"
                            onClick={() => setTotalCourseFee(prevFee => prevFee + 1000)}
                        >
                            Add 1000
                        </button> */}
            <input
              type="number"
              className="form-control col-1"
              value={totalCourseFee}
              min="0" // Set minimum value to 0
              onChange={(e) => {
                const value = Number(e.target.value);
                setTotalCourseFee(value >= 0 ? value : ""); // Prevent values below 0
              }}
              placeholder="Enter Total Course Fee"
              aria-label="Total Course Fee"
              required
            />
            <div className="gap-4">
              <button
                type="button"
                className=" btn btn-primary"
                style={{ margin: "2px" }}
                onClick={incrementValue}
              >
                + 1000
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={decrementValue}
              >
                - 1000
              </button>
            </div>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text fw-bold">
              Select a Subject with
              Day&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </span>
            <select
              className="form-select"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              aria-label="Select Subject"
              required
            >
              <option value="">Select a Subject with Day</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.subjectName} {subject.classDay}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-primary ms-2"
              onClick={handleSubjectSelect}
            >
              Add
            </button>
          </div>

          {selectedSubjects.length > 0 && (
            <div className="mb-3">
              <h5>Selected Subjects</h5>
              <ul className="list-group">
                {selectedSubjects.map((subjectId) => {
                  const subject = subjects.find((s) => s._id === subjectId);
                  return (
                    <li
                      key={subjectId}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      {subject ? subject.subjectName : "Unknown Subject"}
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveSubject(subjectId)}
                      >
                        Remove
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/*select subject Name table View on display Class Day, Session Start Time, Session End Time only View*/}

          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Class Day</th>
                <th>Session Start Time</th>
                <th>Session End Time</th>
              </tr>
            </thead>
            <tbody>
              {selectedSubjects.map((subjectId) => {
                const subject = subjects.find((sub) => sub._id === subjectId);
                return subject ? (
                  <tr key={subject._id}>
                    <td>
                      {Array.isArray(subject.subjectName)
                        ? subject.subjectName.join(", ")
                        : subject.subjectName || "N/A"}
                    </td>
                    <td>{subject.classDay || "N/A"}</td>
                    <td>{subject.sessionStartTime || "N/A"}</td>
                    <td>{subject.sessionEndTime || "N/A"}</td>
                  </tr>
                ) : null;
              })}
            </tbody>
          </table>

          <div className="col-12 text-end">
            <button
              type="button"
              className="btn btn-primary m-2"
              onClick={handleAddCourse}
              disabled={loading}
              style={{ backgroundColor: "rgb(13, 13, 175)" }}
            >
              {loading ? "Saving..." : "Save Course"}
            </button>
            <button
              type="button"
              className="btn btn-dark py-0 m-2"
              onClick={() => navigate(-1)} // Navigate to the previous page
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
