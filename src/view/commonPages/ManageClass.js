/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from "react";
import { Modal } from "bootstrap";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const ManageClass = ({
  paramDate = new Date(),
  paramDay = paramDate.toLocaleDateString("en-US", { weekday: "long" }),
  paramDevice = 1,
}) => {
  const [device, setDevice] = useState("1");
  const location = useLocation();
  const modalRef = useRef(null);
  const [bsModal, setBsModal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [error, setError] = useState("");
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [date, setDateInput] = useState(formatDateForInput(new Date()));
  const [todayDate, setTodayDate] = useState(formatDateForInput(new Date()));
  const [clickClassDay, setClickClassDay] = useState(paramDay);
  const [showZoomForm, setShowZoomForm] = useState(false);
  const [zoomMeeting, setZoomMeeting] = useState({
    topic: "",
    duration: "1440",
    password: "",
    agenda: "Lms Academic Meeting",
  });
  const [zoomDate, setZoomDate] = useState("");
  const [zoomTime, setZoomTime] = useState("");
  const [meetingResponse, setMeetingResponse] = useState(null);

  function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const [day, setDaySelect] = useState(
    new Date().toLocaleDateString("en-US", { weekday: "long" })
  );

  // Get the clicked day from navigation state
  useEffect(() => {
    if (location.state?.day) {
      setClickClassDay(location.state.day);
      setDaySelect(location.state.day);
    }
  }, [location.state]);

  // Initialize with location state if available
  useEffect(() => {
    if (location.state) {
      setDateInput(location.state.date || formatDateForInput(new Date()));
      setDaySelect(location.state.day || new Date().toLocaleDateString("en-US", { weekday: "long" }));
      setDevice(location.state.device || "1");
    }
  }, []);

  // Filter subjects by clickClassDay
  useEffect(() => {
    if (subjects.length > 0) {
      const filtered = subjects.filter(
        (subject) => subject.classDay === clickClassDay
      );
      setFilteredSubjects(filtered);
    }
  }, [subjects, clickClassDay]);

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const hourNum = parseInt(hours, 10);
    const isPM = hourNum >= 12;
    const adjustedHour = hourNum % 12 || 12;
    const period = isPM ? "PM" : "AM";
    return `${adjustedHour}:${minutes} ${period}`;
  };

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        "https://lmsacademicservervb.netlify.app/api/subject/getAllSubjectsNoLimit"
      );
      if (Array.isArray(response.data)) {
        setSubjects(response.data);
      } else if (response.data?.subjects) {
        setSubjects(response.data.subjects);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (err) {
      console.error("Error fetching subjects:", err.message);
      setError("Error fetching subjects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  function getNextDateForDay(currentDate, targetDay) {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayIndex = daysOfWeek.indexOf(targetDay);
    const date = new Date(currentDate);
    const currentDayIndex = date.getDay();

    let daysToAdd = dayIndex - currentDayIndex;

    if (daysToAdd === 0) {
      return date;
    }

    if (daysToAdd < 0) {
      daysToAdd += 7;
    }

    date.setDate(date.getDate() + daysToAdd);
    return date;
  }

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `https://lmsacademicservervb.netlify.app/api/subject/updateSubject/${selectedSubject._id}`,
        selectedSubject
      );
  
      if (response.status === 200 && response.data?.updatedSubject) {
        alert("Subject updated successfully!");
        closeModal();
        fetchSubjects();
      } else {
        throw new Error(`Unexpected response format: ${JSON.stringify(response.data)}`);
      }
    } catch (err) {
      console.error("Error updating subject:", err.message);
      alert("Error updating subject: " + err.message);
    }
  };

  const handleDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setDateInput(formatDateForInput(newDate));
    setDaySelect(newDate.toLocaleDateString("en-US", { weekday: "long" }));
  };

  const handleDeviceChange = (e) => {
    const selectedDevice = e.target.value;
    setDevice(selectedDevice);
    console.log("Selected Device:", selectedDevice);
  };

  const handleDayChange = (e) => {
    const newDay = e.target.value;
    setDaySelect(newDay);
    setClickClassDay(newDay);
    const nextDate = getNextDateForDay(new Date(date), newDay);
    setDateInput(formatDateForInput(nextDate));
  };

  const showModal = (subject) => {
    setSelectedSubject(subject);
    const modalElement = modalRef.current;
    const modalInstance = new Modal(modalElement);
    setBsModal(modalInstance);
    modalInstance.show();
  };

  const closeModal = () => {
    if (bsModal) {
      bsModal.hide();
    }
  };

  // Zoom Meeting Functions
  const handleZoomChange = (e) => {
    const { name, value } = e.target;
    setZoomMeeting({ ...zoomMeeting, [name]: value });
  };

  const handleZoomDateChange = (e) => setZoomDate(e.target.value);
  const handleZoomTimeChange = (e) => setZoomTime(e.target.value);

  const isZoomFormValid =
    Object.values(zoomMeeting).every((value) => value.trim() !== "") &&
    zoomDate.trim() !== "" &&
    zoomTime.trim() !== "";

    const createMeeting = async () => {
      if (!zoomDate || !zoomTime) {
        alert("Please select both date and time.");
        return;
      }
    
      const start_time = `${zoomDate}T${zoomTime}:00`;
    
      try {
        const response = await axios.post("https://lmsacademicserver.netlify.app/api/zoom/create", {
          ...zoomMeeting,
          start_time,
        });
        
        const meetingDetails = response.data.meetingDetails;
        setMeetingResponse(meetingDetails);
        
        // Auto-fill the selected subject with the meeting details
        if (selectedSubject) {
          setSelectedSubject({
            ...selectedSubject,
            zoomId: meetingDetails.id,
            zoomPassword: meetingDetails.password,
            classLink: meetingDetails.join_url
          });
        }
    
        // Clear form after successful creation
        setZoomMeeting({
          topic: "",
          duration: "1440",
          password: "",
          agenda: "Lms Academic Meeting",
        });
        setZoomDate("");
        setZoomTime("");
      } catch (error) {
        console.error("Error creating meeting:", error);
        alert("Error creating meeting: " + error.message);
      }
    };

const toggleZoomForm = () => {
  setShowZoomForm(!showZoomForm);
  setMeetingResponse(null);
  
  // Ensure the modal is open when showing the form
  if (!showZoomForm && !bsModal) {
    const modalElement = modalRef.current;
    const modalInstance = new Modal(modalElement);
    setBsModal(modalInstance);
    modalInstance.show();
  }
};

  return (
    <>
      <div className="col-12 bg-light mt-5"></div>
      <div className="text-center py-4">
        <h4 className="py-3">Today's Date: {todayDate}</h4>
        <h3>Showing classes for: {clickClassDay}</h3>
      </div>

      <div className="col-12 bg-light">
        <div className="row">
          <h2 className="fw-bold mt-2">Manage Classes</h2>

          <div className="col-12 offset-0 col-lg-8 offset-lg-4 p-3">
            <div className="row shadow m-3 p-2">


              <div className="col-12 col-lg-4 p-2">
                <p className="mb-2 fw-semibold">Day</p>
                <select
                  className="form-select"
                  value={day}
                  onChange={handleDayChange}
                >
                  <option value="Sunday">Sunday</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                </select>
              </div>
              <div className="row-6 col-lg-4 p-2">
                <p className="mb-2 fw-semibold">Device</p>
                <select
                  className="form-select"
                  value={device}
                  onChange={handleDeviceChange}
                >
                  <option value="1">Lap 04</option>
                  <option value="2">Lap 06</option>
                </select>
                <div className="text-end mt-3">
                  <button className="btn btn-warning mx-2">Reset</button>
                  <button className="btn btn-primary mx-2">Search</button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-3 col-12">
            <div className="row gap-5 d-flex justify-content-center">
              <div className="col-12 overflow-x-auto">
                <div className="m-1">
                  <div className="p-2">
                    <p className="fw-bold fs-5 text-black-50">
                      Current Classes for {clickClassDay}
                    </p>
                  </div>
                  <div className="col-12 table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Time</th>
                          <th scope="col">Subject</th>
                          <th scope="col">Lecture</th>
                          <th scope="col">Zoom ID</th>
                          <th scope="col">Zoom Password</th>
                          <th scope="col">Zoom Link</th>
                          <th scope="col">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loading ? (
                          <tr>
                            <td colSpan="8" className="text-center">
                              Loading classes...
                            </td>
                          </tr>
                        ) : error ? (
                          <tr>
                            <td colSpan="8" className="text-center text-danger">
                              {error}
                            </td>
                          </tr>
                        ) : filteredSubjects.length > 0 ? (
                          filteredSubjects.map((subject, index) => (
                            <tr key={subject._id}>
                              <th scope="row">{index + 1}</th>
                              <td>
                                {formatTime(subject.sessionStartTime)} -{" "}
                                {formatTime(subject.sessionEndTime)}
                              </td>
                              <td>{subject.subjectName || "N/A"}</td>
                              <td>{subject.lectureName || "N/A"}</td>
                              <td>{subject.zoomId || "N/A"}</td>
                              <td>{subject.zoomPassword || "N/A"}</td>
                              <td>{subject.classLink || "N/A"}</td>
                              <td>
                                <button
                                  onClick={() => showModal(subject)}
                                  type="button"
                                  className="btn btn-dark py-0"
                                >
                                  Update
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="8" className="text-center">
                              No classes found for {clickClassDay}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="exampleModal"
        ref={modalRef}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Update Zoom Details
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {selectedSubject && (
                <>
                  <div className="col-12">
                    <p className="p-2 fw-bold text-black-50">Class Details</p>
                  </div>

                  <div className="col-12">
                    <div className="input-group mb-3">
                      <span className="input-group-text fw-bold">Time Slot:</span>
                      <input
                        type="text"
                        className="form-control"
                        value={`${formatTime(selectedSubject.sessionStartTime)} - ${formatTime(selectedSubject.sessionEndTime)}`}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="input-group mb-3">
                      <span className="input-group-text fw-bold">Subject:</span>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedSubject.subjectName || "N/A"}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="input-group mb-3">
                      <span className="input-group-text fw-bold">Lecture:</span>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedSubject.lectureName || "N/A"}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <p className="p-2 fw-bold text-black-50">Zoom Details</p>
                  </div>

                  <div className="col-12">
                    <div className="input-group mb-3">
                      <span className="input-group-text fw-bold">Meeting ID:</span>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedSubject.zoomId || ""}
                        onChange={(e) =>
                          setSelectedSubject({
                            ...selectedSubject,
                            zoomId: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="input-group mb-3">
                      <span className="input-group-text fw-bold">Password:</span>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedSubject.zoomPassword || ""}
                        onChange={(e) =>
                          setSelectedSubject({
                            ...selectedSubject,
                            zoomPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="input-group mb-3">
                      <span className="input-group-text fw-bold">Meeting Link:</span>
                      <input
                        type="text"
                        className="form-control"
                        value={selectedSubject.classLink || ""}
                        onChange={(e) =>
                          setSelectedSubject({
                            ...selectedSubject,
                            classLink: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdate}
              >
                Save Changes
              </button>
              <div className="d-flex justify-content-between align-items-center">
               
                <button 
                  onClick={toggleZoomForm}
                  className="btn btn-primary"
                >
                  {showZoomForm ? "Hide Form" : "Create New Meeting"}
                </button>
              </div>
            </div>


              {showZoomForm && (
                <div className="col-12 mt-3 p-3 border rounded">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Meeting Topic *</label>
                    <input
                      type="text"
                      name="topic"
                      className="form-control"
                      placeholder="Enter topic"
                      onChange={handleZoomChange}
                      value={zoomMeeting.topic}
                      required
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        onChange={handleZoomDateChange}
                        value={zoomDate}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Time *</label>
                      <input
                        type="time"
                        className="form-control"
                        onChange={handleZoomTimeChange}
                        value={zoomTime}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Duration (mins) *</label>
                    <input
                      type="number"
                      name="duration"
                      className="form-control"
                      placeholder="Enter duration"
                      onChange={handleZoomChange}
                      min="1"
                      max="1440"
                      value={zoomMeeting.duration || 1440}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password *</label>
                    <input
                      type="text"
                      name="password"
                      className="form-control"
                      placeholder="Enter password"
                      onChange={handleZoomChange}
                      value={zoomMeeting.password}
                      required
                    />
                  </div>

                  <button
                    onClick={createMeeting}
                    disabled={!isZoomFormValid}
                    className={`btn btn-primary w-100 py-2 ${isZoomFormValid ? "btn-hover" : "disabled"}`}
                  >
                    🚀 Create Meeting
                  </button>

                  {meetingResponse && (
                    <div className="alert alert-info mt-4 text-center">
                      <h5 className="fw-bold">🎉 Meeting Created!</h5>
                      <p className="mb-2">Meeting ID: <strong>{meetingResponse.id}</strong></p>
                      <p className="mb-2">Meeting Password: <strong>{meetingResponse.password}</strong></p>
                      <a
                        href={meetingResponse.join_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-success btn-sm"
                      >
                        🔗 Join Meeting
                      </a>
                      <button
                        onClick={() => navigator.clipboard.writeText(meetingResponse.join_url)}
                        className="btn btn-secondary btn-sm mt-2"
                      >
                        📋 Copy Link
                      </button>
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageClass;