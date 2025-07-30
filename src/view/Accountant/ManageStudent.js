import React, { useEffect, useState } from "react";
import axios from "axios";
import {useNavigate } from "react-router-dom";

const ManageStudent = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [selectedCampus, setSelectedCampus] = useState("");
  const [loading, setLoading] = useState(false);
  const [accountant, setAccountant] = useState(null);

  useEffect(() => {
    // Get logged-in accountant details from localStorage
    const loggedInAccountant = {
      name: localStorage.getItem("name"),
      id: localStorage.getItem("_id"),
      AccountID: localStorage.getItem("AccountID"),
      AccountantIsDirector:
        localStorage.getItem("AccountantIsDirector") === "true",
      assignCampus: JSON.parse(localStorage.getItem("assignCampus") || "[]"), // Campus IDs
    };

    console.log("Logged-in Accountant:", loggedInAccountant);
    setAccountant(loggedInAccountant);

    const fetchCampuses = async () => {
      try {
        // Fetch details for all assigned campuses
        const campusDetails = await Promise.all(
          loggedInAccountant.assignCampus.map((campusId) =>
            axios.get(
              `https://primelms-server.netlify.app/api/campus/getCampusById/${campusId}`
            )
          )
        );

        // Extract campus names and IDs
        const campusList = campusDetails.map((response) => ({
          id: response.data._id,
          name: response.data.campusName,
        }));
        setCampuses(campusList);
      } catch (error) {
        console.error("Error fetching campus details:", error);
        alert("Failed to fetch campus details. Please try again.");
      }
    };

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
      } catch (error) {
        console.error("Error fetching students:", error);
        alert("Failed to fetch students. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampuses();
    fetchStudents();
  }, []);

  useEffect(() => {
    // Filter students based on the selected campus
    if (selectedCampus) {
      const filtered = students.filter(
        (student) => student.campusName === selectedCampus
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students); // Show all students if no campus is selected
    }
  }, [students, selectedCampus]);

  const handleEditClick = (student) => {
    navigate("add-student-installment", { state: student });
  };

  if (loading) {
    return <div>Loading students...</div>;
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
  className="col-md-12 m-2 shadow-sm p-4"
  style={{ border: "3px solid #059888", borderRadius: "10px" }}
>
  <div className="row align-items-center">
    {/* Search Student by Name */}
    <div className="col-12 col-md-4 col-lg-3 mb-2 mb-md-0">
      <input
        type="text"
        className="form-control"
        placeholder="Search by Student Name"
        onChange={(e) => {
          const searchQuery = e.target.value.toLowerCase();
          const filtered = students.filter((student) =>
            student.studentName.toLowerCase().includes(searchQuery)
          );
          setFilteredStudents(filtered);
        }}
      />
    </div>

    {/* Campus Dropdown */}
    <div className="col-12 col-md-4 col-lg-3 mb-2 mb-md-0">
      <select
        className="form-select"
        value={selectedCampus}
        onChange={(e) => setSelectedCampus(e.target.value)}
      >
        <option value="">All Campuses</option>
        {campuses.map((campus) => (
          <option key={campus.id} value={campus.name}>
            {campus.name}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>

        <div
          className="col-12 m-2 overflow-x-auto"
          style={{ border: "3px solid #059888", borderRadius: "10px" }}
        >
          <div className="m-1 table-responsive">
            <div className="p-2">
              <p className="fw-bold fs-5 text-black-50">Students</p>
            </div>

            <table className="table">
              <thead>
                <tr>
                <th scope="col">Index No</th>
                  <th scope="col">Campus Name</th>
                  <th scope="col">Student ID</th>
                  <th scope="col">Student Name</th>
                  <th scope="col">Whatsapp Number</th>
                  <th scope="col">Payable Amount</th>
                  {/* <th scope="col">Discount</th> */}
                  {/* <th scope="col">Paid Amount</th> */}
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
                      <td>{student.paymentAmount || "N/A"}</td>
                      {/* <td>{student.disCount || "N/A"}</td> */}
                      {/* <td>{student.paidAmount || "N/A"}</td> */}
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

export default ManageStudent;
