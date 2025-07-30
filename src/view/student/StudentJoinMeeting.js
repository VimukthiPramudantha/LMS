import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
// import { createMeeting } from "../../utils/zoomApi";

const StudentJoinMeeting = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { subject } = location.state || {};
  // console.log("Received Subject:", subject);

  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleJoinClick = async () => {
    console.log("Joining Meeting:", selectedSubject.classLink);
    window
      .open(selectedSubject.classLink, "_blank")
      .focus();

    // console.log("Joining Lecture Meeting");
    // Redirects to zoom class
    // window.location.href = "https://zoomapi.netlify.app/start-meeting";
    // console.log("clicked");


    // .................save class database part.............

    // try {
    //   // Prepare the data to send to the backend
    //   const meetingData = {
    //     studentId: student?.studentID,
    //     subject: selectedSubject?.subjectName,
    //     studentName: student?.studentName,
    //     startAt: selectedSubject?.sessionStartTime,
    //     endAt: selectedSubject?.sessionEndTime,
    //     classDay: selectedSubject?.classDay,
    //   };
  
    //   // console.log("Data to save:", meetingData);
  
    //   // Make a POST request to your backend API
    //   const response = await axios.post(
    //     "https://lmsacademicserver.netlify.app/api/studentDetails/addStudentJoinclass", // Replace with your backend endpoint
    //     meetingData,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the JWT token if required
    //       },
    //     }
    //   );
  
    //   // console.log("Meeting saved successfully:", response.data);
  
    //   // Redirect or show a success message after saving
    //   navigate("/student/dashboard");
    // } catch (error) {
    //   console.error(
    //     "Error saving meeting data:",
    //     error.response ? error.response.data : error.message
    //   );
    //   alert("Failed to save meeting data. Please try again.");
    //   // console.log(error);
    // }
  };

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const storedStudentId = localStorage.getItem("studentID");
        if (!storedStudentId) {
          console.error("No studentID found in localStorage");
          setLoading(false);
          return;
        }

        // console.log("Student ID retrieved from localStorage:", storedStudentId);

        const response = await axios.get(
          "https://lmsacademicserver.netlify.app/api/coordinatorAddStudent/getAllStudents"
        );
        // console.log("All Students Response:", response.data);

        const studentData = response.data.find(
          (student) => student.studentID === decodeURIComponent(storedStudentId)
        );

        if (studentData) {
          // console.log("Student Data:", studentData);
          setStudent(studentData);

          const subjectIds = studentData.courseTitle.flatMap(
            (course) => course.subject
          );
          // console.log("Extracted Subject IDs:", subjectIds);

          if (subjectIds.length > 0) {
            const subjectResponse = await axios.get(
              `https://lmsacademicserver.netlify.app/api/subject/getAllSubjects?ids=${subjectIds.join(
                ","
              )}`
            );
            // console.log("Subjects API Response:", subjectResponse.data);

            setSubjects(subjectResponse.data.subjects || []);
          } else {
            console.warn("No subjects found for this student");
          }
        } else {
          console.error("Student not found");
        }
      } catch (error) {
        console.error(
          "Error fetching student data:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudentDetails();
  }, []);

  const selectedSubject = subjects.find(
    (subj) =>
      subj.subjectName?.toLowerCase().trim() ===
    (subject?.subjectName?.toLowerCase().trim() || "")
  );

  // console.log("Fetched Subjects:", subjects);
  // console.log("Selected Subject:", selectedSubject);

  const handleCancel = () => {
    navigate("/student/dashboard");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!subject) {
    return (
      <div>
        <h3>No subject selected. Please go back and try again.</h3>
      </div>
    );
  }

  if (!selectedSubject) {
    return <div>No matching subject found for "{subject.subjectName}".</div>;
  }

  return (
    <div className="col-12 d-flex justify-content-center">
      <div className="row col-lg-6 shadow-lg m-3 rounded-3 h-auto mt-4 p-3 formColour border border-3 border-end-0 border-start-0 border-primary">
        <h4 className="fw-bold text-black-50 my-2">Join Student Meeting</h4>
        <hr />
        <p className="fw-semibold text-primary"style={{ fontSize: "1.25rem" }}>
                Course {" "}
                <span className="text-black">
                  {student.courseTitle[0].courseLevel}
                  &nbsp;in&nbsp;
                  {student.courseTitle[0].courseTitle}
                </span>
              </p>
        <p className="fw-semibold text-primary " style={{ fontSize: "1.25rem" }}>
                Class Date {" "}
                <span className="text-black">
                  {/* {selectedSubject.classDate} */}
                  2025-01-06 {/* Hardcoded date */ selectedSubject?.classDay}
                </span>
              </p>

        <div className="col-12 col-xl-6">
          <div className="input-group mb-3">
            <span className="input-group-text fw-bold">Display Name :</span>
            <input
              type="text"
              className="form-control"
              value={student?.studentID+" "+student?.studentName || ""}
              disabled
            />
          </div>
        </div>
        <div className="col-12 col-xl-6">
          <div className="input-group mb-3">
            <span className="input-group-text fw-bold">Subject&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
            <input
              type="text"
              className="form-control"
              value={selectedSubject?.subjectName || ""}
              disabled
            />
          </div>
        </div>

        <div className="col-12 col-xl-6">
          <div className="input-group mb-3">
            <span className="input-group-text fw-bold">Start At &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
            <input
              type="text"
              className="form-control"
              value={selectedSubject?.sessionStartTime || ""}
              disabled
            />
          </div>
        </div>
        <div className="col-12 col-xl-6">
          <div className="input-group mb-3">
            <span className="input-group-text fw-bold">End At&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
            <input
              type="text"
              className="form-control"
              value={selectedSubject?.sessionEndTime || ""}
              disabled
            />
          </div>
        </div>

        <div className="col-12 text-end mt-3">
          <button
            type="button"
            className="btn btn-primary m-2"
            onClick={handleJoinClick}
          >
            Join Meeting
          </button>
          <button
            type="button"
            className="btn btn-secondary m-2"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentJoinMeeting;
