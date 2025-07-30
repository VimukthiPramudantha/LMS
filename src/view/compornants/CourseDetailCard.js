import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CourseDetailCard = () => {
  const [student, setStudent] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
    const [installments, setInstallments] = useState([]);
  const navigate = useNavigate();

  const okOrNot = installments.some((installment) => {
    if (installment.paymentStatus === "Paid") {
      const lastPaidDate = new Date(installment.formattedDueDate);
      return lastPaidDate >= new Date();
    }
  })
    ? "OK"
    : "not OK";

      // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate due dates based on student creation date and installment due days
  const calculateDueDates = (installments, createdAt) => {
    if (!createdAt || !installments.length) return installments;

    const createdDate = new Date(createdAt);
    let previousDueDate = new Date(createdDate); // Start with creation date

    return installments.map((installment) => {
      // Convert dueDate from string to number (e.g., "5" becomes 5)
      const dueDays = parseInt(installment.dueDate) || 0;

      // Calculate new due date by adding days to previous due date
      const newDueDate = new Date(previousDueDate);
      newDueDate.setDate(previousDueDate.getDate() + dueDays);

      // Update previousDueDate for next iteration
      previousDueDate = new Date(newDueDate);

      return {
        ...installment,
        dueDate: newDueDate.toISOString().split("T")[0],
        formattedDueDate: formatDate(newDueDate.toISOString()),
        dueDays, // Keep original due days value for reference
      };
    });
  };
  // Fetch student details
  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const storedStudentId = localStorage.getItem("studentID");
        if (!storedStudentId) {
          console.error("No studentID found in localStorage");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "https://lmsacademicserver.netlify.app/api/coordinatorAddStudent/getAllStudents"
        );
        const studentData = response.data.find(
          (student) => student.studentID === decodeURIComponent(storedStudentId)
        );

        if (studentData) {
          setStudent(studentData);
          await fetchInstallments(studentData._id, studentData.createdAt);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    };


    // Fetch installments from backend
    const fetchInstallments = async (studentId, createdAt) => {
      try {
        const response = await axios.get(
          `https://lmsacademicserver.netlify.app/api/coordinatorAddStudent/getStudent/${studentId}`
        );
        if (response.data.Installments) {
          const formattedInstallments = calculateDueDates(
            response.data.Installments.map((installment) => ({
              ...installment,
              paymentStatus: installment.paymentStatus || "Pending",
            })),
            createdAt
          );
          setInstallments(formattedInstallments);
        }
      } catch (error) {
        console.error("Error fetching installments:", error);
      }
    };

    fetchStudentDetails();
  }, []);

  const handleJoinClick = (subject) => {
    // Check payment compliance before allowing join
    if (okOrNot === "not OK") {
      alert('Access denied: Please complete all outstanding payments to attend classes');
      return;
    }
    navigate("/student/join-class", { state: { subject } });
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

        const response = await axios.get(
          "https://lmsacademicserver.netlify.app/api/coordinatorAddStudent/getAllStudents"
        );
        const studentData = response.data.find(
          (student) => student.studentID === decodeURIComponent(storedStudentId)
        );

        if (studentData) {
          setStudent(studentData);

          // Fetch subjects by subject IDs if available
          const subjectIds = studentData.courseTitle.flatMap(
            (course) => course.subject
          );
          if (subjectIds.length > 0) {
            try {
              const subjectResponse = await axios.get(
                `https://lmsacademicserver.netlify.app/api/subject/getAllSubjects?ids=${subjectIds.join(
                  ","
                )}`
              );
              setSubjects(subjectResponse.data.subjects || []);
            } catch (subjectError) {
              console.error(
                "Error fetching subjects:",
                subjectError.response
                  ? subjectError.response.data
                  : subjectError.message
              );
            }
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

  if (loading) {
    return <div className="text-center py-5">Loading course details...</div>;
  }
  
  if (!student) {
    return <div className="text-center py-5">No student data found</div>;
  }

  return (
    <div className="col-12 col-lg-6 p-3 mb-2">
      <div className="shadow p-3 rounded CourseAndPaymentCardHight">
        <h3 className="fw-bold text-primary mb-4">Course Details</h3>

        {okOrNot === "not OK" && (
          <div className="alert alert-danger mb-4">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Your access to classes is restricted due to outstanding payments.
            Please complete all installments to continue attending classes.
          </div>
        )}

        <div className="col-12 mt-4 fw-semibold">
          {student.courseTitle.length > 0 && (
            <>
              <p className="text-primary" style={{fontWeight:"700"}}>
                Course Name:{" "}
                <span className="text-black ">
                  {student.courseTitle[0].courseLevel}
                  &nbsp;in&nbsp;
                  {student.courseTitle[0].courseTitle}
                </span>
              </p>
              <p className="text-primary" style={{fontWeight:"700"}}>
                Duration &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                <span className="text-black">
                  {student.courseTitle[0].courseDuration}
                </span>
              </p>
              <p className=" text-primary mt-4 pb-3"style={{fontWeight:"700"}}>
                Start Date&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                <span className="text-black">
                  {new Date(student.courseTitle[0].createdAt).toLocaleDateString()}
                </span>
              </p>
            </>
          )}
        </div>

        <div
          className="col-12 fw-semibold">
          <div
            className="table-responsive CourseAndPaymentCardTableHight mt-5">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Subject ID</th>
                  <th scope="col">Subject Name</th>
                  <th scope="col">Class Day</th>
                  <th scope="col">Start Time</th>
                  <th scope="col">End Time</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.length > 0 ? (
                  subjects.map((subject, index) => (
                    <tr key={index}>
                      <td>{subject.subjectId}</td>
                      <td>{subject.subjectName}</td>
                      <td>{subject.classDay}</td>
                      <td>{subject.sessionStartTime}</td>
                      <td>{subject.sessionEndTime}</td>
                      <td>
                        <div className="col-6 text-end">
                          <button
                            onClick={() => handleJoinClick(subject)}
                            className={`btn ${
                              okOrNot === "OK" ? "btn-primary" : "btn-secondary"
                            }`}
                            disabled={okOrNot !== "OK"}
                            title={
                              okOrNot !== "OK"
                                ? "Complete your payments to join classes"
                                : ""
                            }
                          >
                            {okOrNot === "OK" ? "Join" : "Payment Due"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      No subjects found for your course
                    </td>
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

export default CourseDetailCard;