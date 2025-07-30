import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddStudentEducation2 = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [universities, setUniversities] = useState([]);

  // Add a new school form
  const addSchool = () => {
    setSchools([
      ...schools,
      {
        schoolName: "",
        startGrade: "",
        endGrade: "",
        currentlyStudying: false,
        startYear: "",
        endYear: "",
      },
    ]);
  };

  // Add a new university form
  const addUniversity = () => {
    setUniversities([
      ...universities,
      {
        universityName: "",
        courseName:"",
        courseLevel:"",
        startYear: "",
        currentlyStudying: false,
        endYear: "",
      },
    ]);
  };

  // Handle school input changes
  const handleSchoolChange = (index, field, value) => {
    const updatedSchools = [...schools];
    updatedSchools[index][field] =
      field === "currentlyStudying" ? !updatedSchools[index][field] : value;
    setSchools(updatedSchools);
  };

  // Handle university input changes
  const handleUniversityChange = (index, field, value) => {
    const updatedUniversities = [...universities];
    updatedUniversities[index][field] =
      field === "currentlyStudying" || field === "notUniversity"
        ? !updatedUniversities[index][field]
        : value;
    setUniversities(updatedUniversities);
  };

  // Remove a school form
  const removeSchool = (index) => {
    const updatedSchools = schools.filter((_, i) => i !== index);
    setSchools(updatedSchools);
  };

  // Remove a university form
  const removeUniversity = (index) => {
    const updatedUniversities = universities.filter((_, i) => i !== index);
    setUniversities(updatedUniversities);
  };

  // Submit the form
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in.");
      navigate("/login");
      return;
    }

    const payload = {
      schools,
      universities,
    };

    try {
      const response = await axios.post(
        "https://primelms-server.netlify.app/api/StudentEducationDetailRoute/addEducationDetails",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Education details added successfully");
      navigate("/profile");
    } catch (error) {
      if (error.response) {
        alert(`Error: ${error.response.data.message || "Failed to save data"}`);
      } else {
        alert("Error saving data, please try again.");
      }
    }
  };

  return (
    <div className="container-fluid form-bg-image">
      <div className="row d-flex justify-content-center mt-4">
        <div className="col-12 col-lg-10 shadow-lg rounded-3 formColour border border-primary p-4">
          <h4 className="fw-bold text-secondary text-center mb-4">
            Add Education Details
          </h4>

          {/* Add Schools Section */}
          <h5 className="fw-bold text-primary mb-3">Add School</h5>
          {schools.map((school, index) => (
            <div key={index} className="border rounded p-3 mb-3">
              <div className="mb-3">
                <label className="form-label fw-bold">School Name:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter school name"
                  value={school.schoolName}
                  onChange={(e) =>
                    handleSchoolChange(index, "schoolName", e.target.value)
                  }
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Start Grade:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter start grade"
                    value={school.startGrade}
                    onChange={(e) =>
                      handleSchoolChange(index, "startGrade", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">Start Year:</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter start year"
                    value={school.startYear}
                    onChange={(e) =>
                      handleSchoolChange(index, "startYear", e.target.value)
                    }
                    min="1950"
                    max={new Date().getFullYear()}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">End Grade:</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter end grade"
                    value={school.endGrade}
                    onChange={(e) =>
                      handleSchoolChange(index, "endGrade", e.target.value)
                    }
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-bold">End Year:</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter end year"
                    value={school.endYear}
                    onChange={(e) =>
                      handleSchoolChange(index, "endYear", e.target.value)
                    }
                    min="1950"
                    max={new Date().getFullYear()}
                    disabled={school.currentlyStudying} // Disable if Currently Studying is checked
                  />
                </div>
              </div>

              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={school.currentlyStudying}
                  onChange={() =>
                    handleSchoolChange(
                      index,
                      "currentlyStudying",
                      !school.currentlyStudying
                    )
                  }
                />
                <label className="form-check-label">Currently Studying</label>
              </div>

              <button
                className="btn btn-danger"
                onClick={() => removeSchool(index)}
              >
                Remove School
              </button>
            </div>
          ))}
          <button className="btn btn-primary mb-4" onClick={addSchool}>
            Add School
          </button>

         {/* Add Universities Section */}
<h5 className="fw-bold text-primary mb-3">Add Universities/Institutions</h5>
{universities.map((university, index) => (
  <div key={index} className="border rounded p-3 mb-3">
    {/* University/Institution Name */}
    <div className="mb-3">
      <label className="form-label fw-bold">University/Institution Name:</label>
      <input
        type="text"
        className="form-control"
        placeholder="Enter university/institution name"
        value={university.universityName}
        onChange={(e) =>
          handleUniversityChange(index, "universityName", e.target.value)
        }
      />
    </div>

    {/* Course Name and Course Level in One Row */}
    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label fw-bold">Course Name:</label>
        <input
          type="text"
          className="form-control"
          placeholder="Enter course name"
          value={university.courseName || ""}
          onChange={(e) =>
            handleUniversityChange(index, "courseName", e.target.value)
          }
        />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-bold">Course Level:</label>
        <select
          className="form-select"
          value={university.courseLevel || ""}
          onChange={(e) =>
            handleUniversityChange(index, "courseLevel", e.target.value)
          }
        >
          <option value="" disabled>
            Select course level
          </option>
          <option value="Undergraduate">Undergraduate</option>
          <option value="Postgraduate">Postgraduate</option>
          <option value="Diploma">Diploma</option>
          <option value="Certification">Certification</option>
          <option value="Bachelor's">Bachelor's</option>
          <option value="Master's">Master's</option>
          <option value="PhD">PhD</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>

    {/* Start Year and End Year in One Row */}
    <div className="row mb-3">
      <div className="col-md-6">
        <label className="form-label fw-bold">Start Year:</label>
        <input
          type="number"
          className="form-control"
          placeholder="Enter start year (e.g., 2020)"
          min="1950"
          max={new Date().getFullYear()}
          value={university.startYear}
          onChange={(e) =>
            handleUniversityChange(index, "startYear", e.target.value)
          }
        />
      </div>
      <div className="col-md-6">
        <label className="form-label fw-bold">End Year:</label>
        <input
          type="number"
          className="form-control"
          placeholder="Enter end year (e.g., 2024)"
          min="1950"
          max="2100"
          value={university.endYear}
          disabled={university.currentlyStudying}
          onChange={(e) =>
            handleUniversityChange(index, "endYear", e.target.value)
          }
        />
      </div>
    </div>

    {/* Currently Studying */}
    <div className="form-check mb-3">
      <input
        type="checkbox"
        className="form-check-input"
        checked={university.currentlyStudying}
        onChange={() =>
          handleUniversityChange(index, "currentlyStudying")
        }
      />
      <label className="form-check-label">Currently Studying</label>
    </div>

    {/* Remove Button */}
    <button
      className="btn btn-danger"
      onClick={() => removeUniversity(index)}
    >
      Remove University/Institution
    </button>
  </div>
))}
<button className="btn btn-primary" onClick={addUniversity}>
  Add University/Institution
</button>


          {/* Action Buttons */}
          <div className="text-end mt-4">
            <button className="btn btn-success me-2" onClick={handleSubmit}>
              Save Education Details
            </button>
            <button
              className="btn btn-dark"
              onClick={() => navigate("/profile")}
            >
              Back to Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentEducation2;
