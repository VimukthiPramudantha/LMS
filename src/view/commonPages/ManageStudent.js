import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ManageCampus = () => {
  const [students, setStudents] = useState([]);
  const [editStudentId, setEditStudentId] = useState(null);
  const [editStudentData, setEditStudentData] = useState({
    campusName: "",
    courseTitle: [],
    paymentPlan: "",
    studentID: "",
    studentName: "",
    StudentNIC: "",
    childHoodNIC: "",
    password: "",
    whatsAppMobileNo1: "",
    disCount: "",
    paymentAmount: "",
    paidAmount: "",
    firstDuePayment: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true); // Set loading state
      try {
        const response = await axios.get(
          "https://primelms-server.netlify.app/api/coordinatorAddStudent/getAllStudents"
        );
        setStudents(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
        alert("Failed to fetch students. Please try again.");
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    fetchStudents();
  }, []);

  const navigate = useNavigate();

  const handleEditClick = (student) => {
    navigate("add-student-installment", { state: student });
  };
  

  const handleSaveClick = async () => {
    try {
      console.log("Student ID being updated:", editStudentId);
      console.log("Data being sent:", editStudentData);

      // Make a PUT request to update the student data
      const response = await axios.put(
        `https://primelms-server.netlify.app/api/coordinatorAddStudent/updateStudent/${editStudentId}`,
        editStudentData
      );

      console.log("Response from update:", response);

      if (response.status === 200) {
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === editStudentId
              ? { ...student, ...editStudentData }
              : student
          )
        );
        resetEditState();
      } else {
        throw new Error("Update failed with status: " + response.status);
      }
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update student. Please try again.");
    }
  };

  const resetEditState = () => {
    setEditStudentId(null); // Exit edit mode
    setEditStudentData({
      campusName: "",
      courseTitle: [],
      paymentPlan: "",
      studentID: "",
      studentName: "",
      StudentNIC: "",
      childHoodNIC: "",
      password: "",
      whatsAppMobileNo1: "",
      disCount: "",
      paymentAmount: "",
      paidAmount: "",
      firstDuePayment: "",
    });
  };

  const handleCancelClick = () => {
    resetEditState();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditStudentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (loading) {
    return <div>Loading students...</div>; // Loading state message
  }

  return (
    <div className="col-12 bg-light">
      <div className="row">
        <h2 className="fw-bold mt-5">Manage Students</h2>
        <div className="col-12 col-lg-4 offset-0 offset-lg-8 d-flex gap-2 mt-4">
          <input
            className="form-control"
            list="datalistOptions"
            id="exampleDataList"
            placeholder="Type to search..."
          />
          <datalist id="datalistOptions">
            {students.map((student) => (
              <option key={student._id} value={student.studentName} />
            ))}
          </datalist>
          <Link to="add-student" type="button" className="btn btn-primary">
            Create New Student
          </Link>
        </div>

        <div className="col-12 overflow-x-auto">
          <div className="m-1 table-responsive">
            <div className="p-2">
              <p className="fw-bold fs-5 text-black-50">All Students</p>
            </div>

            <table className="table">
              <thead>
                <tr>
                  {/* <th scope="col">Campus Name</th> */}
                  <th scope="col">Course Name</th>
                  <th scope="col">Student ID</th>
                  <th scope="col">Student Name</th>
                  <th scope="col">Whatsapp Number</th>
                  <th scope="col">Paid Amount</th>
                  <th scope="col">First Due Payment</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.campusName}</td>
                      <td>
                        {editStudentId === student._id ? (
                          <input
                            type="text"
                            name="studentID"
                            value={editStudentData.studentID}
                            onChange={handleInputChange}
                          />
                        ) : (
                          student.studentID
                        )}
                      </td>
                      <td>
                        {editStudentId === student._id ? (
                          <input
                            type="text"
                            name="studentName"
                            value={editStudentData.studentName}
                            onChange={handleInputChange}
                          />
                        ) : (
                          student.studentName
                        )}
                      </td>
                      <td>
                        {editStudentId === student._id ? (
                          <input
                            type="text"
                            name="whatsAppMobileNo1"
                            value={editStudentData.whatsAppMobileNo1}
                            onChange={handleInputChange}
                          />
                        ) : (
                          student.whatsAppMobileNo1
                        )}
                      </td>
                      <td>
                        {editStudentId === student._id ? (
                          <input
                            type="text"
                            name="paidAmount"
                            value={editStudentData.paidAmount}
                            onChange={handleInputChange}
                          />
                        ) : (
                          student.paidAmount || "N/A"
                        )}
                      </td>
                      <td>
                        {editStudentId === student._id ? (
                          <input
                            type="text"
                            name="firstDuePayment"
                            value={editStudentData.firstDuePayment}
                            onChange={handleInputChange}
                          />
                        ) : (
                          student.firstDuePayment || "N/A"
                        )}
                      </td>
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
                    <td colSpan="10" className="text-center">
                      No students found.
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

export default ManageCampus;
