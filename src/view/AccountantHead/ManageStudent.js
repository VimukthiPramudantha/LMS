import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageStudent = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [accountant, setAccountant] = useState(null);
  const [selectedCampus, setSelectedCampus] = useState("all"); // New state for campus filter
  const [uniqueCampuses, setUniqueCampuses] = useState([]); // Store unique campus names

  useEffect(() => {
    // Get logged-in accountant details from localStorage
    const loggedInAccountant = {
      name: localStorage.getItem("name"),
      id: localStorage.getItem("_id"),
      AccountID: localStorage.getItem("AccountID"),
      AccountantIsDirector: localStorage.getItem("AccountantIsDirector") === "true",
    };

    console.log("Logged-in Accountant:", loggedInAccountant);
    setAccountant(loggedInAccountant);

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://primelms-server.netlify.app/api/coordinatorAddStudent/getAllStudents",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setStudents(response.data);
        setFilteredStudents(response.data);
        
        // Extract unique campus names
        const campuses = [...new Set(response.data.map(student => student.campusName))];
        setUniqueCampuses(campuses);
      } catch (error) {
        console.error("Error fetching students:", error);
        alert("Failed to fetch students. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Filter students by campus
  useEffect(() => {
    if (selectedCampus === "all") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student => 
        student.campusName === selectedCampus
      );
      setFilteredStudents(filtered);
    }
  }, [selectedCampus, students]);

  const handleEditClick = (student) => {
    navigate("add-student-installment", { state: student });
  };

  const handleCampusChange = (e) => {
    setSelectedCampus(e.target.value);
  };

  if (loading) {
    return <div>Loading students...</div>;
  }

  const showStudent = () => {
    return (
      <div className="m-1 table-responsive">
        <div className="p-2 d-flex justify-content-between align-items-center">
          <p className="fw-bold fs-5 text-black-50">All Students</p>
          <div className="form-group">
            <select 
              className="form-select" 
              value={selectedCampus}
              onChange={handleCampusChange}
            >
              <option value="all">All Campuses</option>
              {uniqueCampuses.map((campus, index) => (
                <option key={index} value={campus}>
                  {campus}
                </option>
              ))}
            </select>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
            <th scope="col">Index No</th>
              <th scope="col">Campus Name</th>
              <th scope="col">Student ID</th>
              <th scope="col">Student Name</th>
              <th scope="col">Whatsapp Number</th>
              {/* <th scope="col">Paid Amount</th> */}
              {/* <th scope="col">First Due Payment</th> */}
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student,index) => (
                <tr key={student._id}>
                   <td>{index + 1}</td>
                  <td>{student.campusName}</td>
                  <td>{student.studentID}</td>
                  <td>{student.studentName}</td>
                  <td>{student.whatsAppMobileNo1}</td>
                  {/* <td>{student.paidAmount || "N/A"}</td> */}
                  {/* <td>{student.firstDuePayment || "N/A"}</td> */}
                  <td>
                    <button
                      type="button"
                      className="btn btn-warning py-0"
                      onClick={() => handleEditClick(student)}
                    >
                      Check Payments
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No students found{selectedCampus !== "all" ? ` in ${selectedCampus}` : ""}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="col-12 bg-light">
      <div className="row">
        <h2 className="fw-bold mt-5">Manage Students</h2>

        {/* Display accountant info (optional) */}
        {accountant && (
          <div className="alert alert-info">
            Logged in as: {accountant.name} ({accountant.AccountID})
            {accountant.AccountantIsDirector && " - Director"}
          </div>
        )}

        <div
          className="col-12 m-2 overflow-x-auto"
          style={{ border: "3px solid #059888", borderRadius: "10px" }}
        >
          {showStudent()}
        </div>
      </div>
    </div>
  );
};

export default ManageStudent;