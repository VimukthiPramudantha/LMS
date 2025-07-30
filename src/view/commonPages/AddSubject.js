import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddSubject = () => {
  const [subjectId, setSubjectId] = useState("");
  const [subjectName, setSubjectName] = useState("");  // Single subject name
  const [classDay, setClassDay] = useState("");
  const [lectureName, setlecture] = useState("");
  const [sessionStartTime, setSessionStartTime] = useState("");
  const [sessionEndTime, setSessionEndTime] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token"); // Get the token from localStorage

  const handleAddSubject = async () => {
    // Simple validation
    if (!subjectId || !subjectName || !classDay || !lectureName || !sessionStartTime || !sessionEndTime) {
      setError("Please fill in all the fields.");
      return;
    }

    const newSubject = {
      subjectId,
      subjectName,  // Single subject name
      classDay,
      lectureName,
      sessionStartTime,
      sessionEndTime,
    };

    try {
      // Send the request with the token included in the Authorization header
      await axios.post(
          "https://primelms-server.netlify.app/api/subject/create",
          newSubject,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the headers
            },
          }
      );
      alert("Subject added successfully!");
      navigate(-1); // Redirect to the subjects list or another route
    } catch (err) {
      setError("Failed to add the subject.");
    }
  };

  return (
      <>
        <div className="form-bg-image">
          <div className="col-12 d-flex justify-content-center mt-4">
            <div className="row col-lg-6 shadow-lg m-3 rounded-3 h-auto mt-4 p-3 formColour border border-3 border-end-0 border-start-0 border-primary">
              <h4 className="fw-bold text-black-50 mt-3 mb-4">Create New Subject</h4>

              {error && <div className="alert alert-danger">{error}</div>}

              {/* Form Group */}
              <div className="col-12">
                <div className="input-group mb-3">
                  <span className="input-group-text fw-bold">Subject Code&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
                  <input
                      type="text"
                      className="form-control"
                      value={subjectId}
                      onChange={(e) => setSubjectId(e.target.value)}
                      required
                  />
                </div>
              </div>

              <div className="col-12">
                <div className="input-group mb-3">
                  <span className="input-group-text fw-bold">Subject Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
                  <input
                      type="text"
                      className="form-control"
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)} // Single subject name
                      required
                  />
                </div>
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text fw-bold">Class Day&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
                <select
                    className="form-control"
                    value={classDay}
                    onChange={(e) => setClassDay(e.target.value)}
                    required
                >
                  <option value="">Select Day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text fw-bold">Lecture Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
                <input
                    type="text"
                    className="form-control"
                    value={lectureName}
                    onChange={(e) => setlecture(e.target.value)}
                    required
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text fw-bold">Session Start Time&nbsp;:</span>
                <input
                    type="time"
                    className="form-control"
                    value={sessionStartTime}
                    onChange={(e) => setSessionStartTime(e.target.value)}
                    required
                />
              </div>

              <div className="input-group mb-3">
                <span className="input-group-text fw-bold">Session End Time&nbsp;&nbsp;&nbsp;&nbsp;:</span>
                <input
                    type="time"
                    className="form-control"
                    value={sessionEndTime}
                    onChange={(e) => setSessionEndTime(e.target.value)}
                    required
                />
              </div>

              <div className="col-12 text-end">
                <button type="button" className="btn btn-primary m-2" onClick={handleAddSubject}  style={{backgroundColor:"rgb(13, 13, 175)"}}>
                  Save
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
      </>
  );
};

export default AddSubject;
