import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dropzone from "../compornants/ImageDropzone";

const AddStudentEduction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    certificateName: "",
    addressStudent: "",
    postAddressStudent: "",
    dob: "",
    gender: "",
    whatsappMobileNo1: "",
    whatsappMobileNo2: "",
  });

  const [companyName, setCompanyName] = useState("");
  const [jobPosition, setJobPosition] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobStartDate, setJobStartDate] = useState("");

  const [schoolName, setSchoolName] = useState("");
  const [startGrade, setSchoolStartGrade] = useState("");
  const [startYear, setSchoolStartYear] = useState("");
  const [endGrade, setSchoolEndGrade] = useState("");
  const [endYear, setSchoolEndYear] = useState("");

  const [universityInstitutionName, setUniversityInstitutionName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [courseLevel, setCourseLevel] = useState("");
  const [startYearUni, setStartYearUni] = useState("");
  const [endYearUni, setYEndYearUni] = useState("");



  const regName = localStorage.getItem("studentName");
  const studentObjectId = localStorage.getItem("studentObjectId");

  console.log("studentObjectId", studentObjectId);
  
  
  useEffect(() => {
    const storedWhatsAppMobileNo1 = localStorage.getItem("whatsAppMobileNo1");
    const storedWhatsApdfdpMobileNo1 = localStorage.getItem("whatsAppMobileNo1");
    if (storedWhatsAppMobileNo1) {
      setFormData((prevData) => ({
        ...prevData,
        whatsappMobileNo1: JSON.parse(storedWhatsAppMobileNo1),
      }));
    } else {
      axios
        .get(
          "https://primelms-server.netlify.app/api/coordinatorAddStudent/getAllStudents"
        )
        .then((response) => {
          const loginStudent = response.data[0];
          if (loginStudent) {
            const mobileNumber = loginStudent.whatsappMobileNo1 || "";
            setFormData((prevData) => ({
              ...prevData,
              whatsappMobileNo1: mobileNumber,
            }));
          }
      
        })
        .catch((error) => {
          console.error("Error fetching student details:", error);
        });
    }
  }, []);


  const [isCurrentlyStudyingUni, setIsCurrentlyStudyingUni] = useState(false);

const handleCurrentlyStudyingUniChange = (e) => {
  setIsCurrentlyStudyingUni(e.target.checked);
  if (e.target.checked) {
    setYEndYearUni("2025");
  } else {
    setYEndYearUni("");
  }
};
  const [isCurrentlyStudyingSchool, setIsCurrentlyStudyingSchool] = useState(false);

const handleCurrentlyStudyingSchoolChange = (e) => {
  setIsCurrentlyStudyingSchool(e.target.checked);
  if (e.target.checked) {
    setSchoolEndYear("2025");
  } else {
    setSchoolEndYear("");
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
        !formData.fullName ||
        !formData.certificateName ||
        !formData.addressStudent ||
        !formData.dob ||
        !formData.gender ||
        !formData.whatsappMobileNo2
    ) {
        alert("Please fill in all required fields.");
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        alert("No token found. Please log in.");
        navigate("/login");
        return;
    }

    // Format the data to match backend schema
    const formattedData = {
        portalAccess: true,
        whatsAppMobileNo1: localStorage.getItem("studentWP"),
        studentDetails: {
            fullName: formData.fullName,
            fullNameCertificate: formData.certificateName,
            addressNICStudent: formData.addressStudent,
            AddressPostStudent: formData.postAddressStudent,
            dob: new Date(formData.dob).toISOString(),
            gender: formData.gender,
            whatsAppMobileNo2: formData.whatsappMobileNo2
        },
        addSchoolDetails: {
            schoolName,
            startGrade,
            startYear,
            endGrade,
            endYear
        },
        addUniversityInstitution: {
            universityInstitutionName,
            courseName,
            courseLevel,
            startYear: startYearUni,
            endYear: endYearUni
        },
        workPlaceDetails: {
            companyName,
            jobPosition,
            jobLocation,
            jobStartDate
        }
    };

    try {
        const response = await axios.put(
            "https://primelms-server.netlify.app/api/coordinatorAddStudent/updateStudentDetails/" + studentObjectId,
            formattedData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        if (response.data.success) {
            alert("Student details updated successfully");
            navigate("/profile");
        } else {
            alert(`Update failed: ${response.data.message}`);
        }
    } catch (error) {
        console.error('Update error:', error);
        if (error.response) {
            console.log('Error response data:', error.response.data);
            alert(`Error: ${error.response.data.message || JSON.stringify(error.response.data)}`);
        } else {
            alert("Error updating data, please try again.");
        }
    }
};

  return (
    <div className="container-fluid form-bg-image">
      <div className="row d-flex justify-content-center mt-4">
        <div className="col-12 col-lg-6 shadow-lg rounded-3 formColour border border-primary p-4">
          <h4 className="fw-bold text-secondary text-center mb-4">
            Fill Your Personal Details
          </h4>

          {/* Display Registered Name */}
          <div className="mb-3">
            <label className="form-label fw-bold">
              ශිෂ්‍යයා ලබා දී ඇති නම:
            </label>
            <input
              type="text"
              className="form-control"
              value={regName}
              disabled
            />
          </div>

          {/* Full Name */}
                <div className="mb-3">
                <label className="form-label fw-bold">
                <span className="text-danger">*</span> සම්පූර්ණ නම: 
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="fullName"
                  placeholder="Full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
                </div>

                {/* Certificate Name */}
          <div className="mb-3">
            <label className="form-label fw-bold">
            <span className="text-danger">*</span>
              සහතිකපත්‍රයට යෙදිය යුතු නම:
            </label>
            <input
              type="text"
              className="form-control"
              name="certificateName"
              placeholder="Name to be applied to certificate"
              value={formData.certificateName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Student Address Name */}
          <div className="mb-3">
            <label className="form-label fw-bold">
            <span className="text-danger">*</span>
              ජාතික හැඳුනුම්පතේ සඳහන් ලිපිනය :
            </label>
            <input
              type="text"
              className="form-control"
              name="addressStudent"
              placeholder="NIC Address"
              value={formData.addressStudent}
              onChange={handleChange}
              required
            />
          </div>
          {/* Student Address2 Name */}
          <div className="mb-3">
          <span className="text-danger">*</span>
            <label className="form-label fw-bold">ලිපි ලැබෙන ලිපිනය :</label>
            
            <input
              type="text"
              className="form-control"
              name="postAddressStudent"
              placeholder="Postle Address"
              value={formData.postAddressStudent}
              onChange={handleChange}
            />
          </div>

          {/* Date of Birth */}
          <div className="mb-3">
          <span className="text-danger">*</span>
            <label className="form-label fw-bold">උපන්දිනය:</label>
            <input
              type="date"
              className="form-control"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>

          {/* Gender */}
          <div className="mb-3">
          <span className="text-danger">*</span>
            <label className="form-label fw-bold">ස්ත්‍රී පුරුෂ:</label>
            <div>
              <input
                type="radio"
                id="male"
                name="gender"
                value="Male"
                className="form-check-input me-2"
                onChange={handleChange}
                checked={formData.gender === "Male"}
              />
              <label className="form-check-label me-4" htmlFor="male">
                Male
              </label>
              <input
                type="radio"
                id="female"
                name="gender"
                value="Female"
                className="form-check-input me-2"
                onChange={handleChange}
                checked={formData.gender === "Female"}
              />
              <label className="form-check-label" htmlFor="female">
                Female
              </label>
            </div>
          </div>

          {/* WhatsApp Number */}
          <div className="mb-3">
            <label className="form-label fw-bold">
            
              මුලින් සම්බන්ද වු WhatsApp දුරකථන අංකය:
            </label>
            <input
              type="text"
              className="form-control"
              value={localStorage.getItem("studentWP")}
              disabled
            />
          </div>

          {/* Additional Contact */}
          <div className="mb-3">
            <label className="form-label fw-bold">
            <span className="text-danger">*</span>
              සිසුවා සම්බන්ද කර ගත හැකි වෙනත් දුරකථන අංකයක්:
            </label>
            <input
              type="text"
              className="form-control"
              name="whatsappMobileNo2"
              placeholder="Enter another contact number"
              value={formData.whatsappMobileNo2}
              onChange={handleChange}
              required
            />
          </div>

          {/* Dropzone for Profile Image Upload */}
          <Dropzone studentIde={studentObjectId}
          />
          
          <h4 className="fw-bold text-secondary text-center mb-4">
            Add Education Details
          </h4>

          {/* ///////////        Add Schools Section      //////////// */}
          <h5 className="fw-bold text-primary mb-3">Add School</h5>

          <div className="border rounded p-3 mb-3">
            <div className="mb-3">
              <label className="form-label fw-bold">School Name:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter school name"
                value={schoolName}
                onChange={(e)=>setSchoolName(e.target.value)}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Start Grade:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter start grade"
                  value={startGrade}
                onChange={(e)=>setSchoolStartGrade(e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Start Year:</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter start year"
                  min="1950"
                  max={new Date().getFullYear()}
                  value={startYear}
                onChange={(e)=>setSchoolStartYear(e.target.value)}
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
                  value={endGrade}
                onChange={(e)=>setSchoolEndGrade(e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">End Year:</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter end year"
                  min="1950"
                  max={new Date().getFullYear()}
                  value={endYear}
                onChange={(e)=>setSchoolEndYear(e.target.value)}
                />
              </div>
            </div>

            <div className="form-check mb-3">
              <input type="checkbox" className="form-check-input" 
              checked={isCurrentlyStudyingSchool}
              onChange={handleCurrentlyStudyingSchoolChange}
              />
              <label className="form-check-label">Currently Studying</label>
            </div>

          </div>

          {/* ///////////////////Add Universities Section ////////////////// */}
          <h5 className="fw-bold text-primary mb-3">
            Add Universities/Institutions
          </h5>

          <div className="border rounded p-3 mb-3">
            {/* University/Institution Name */}
            <div className="mb-3">
              <label className="form-label fw-bold">
                University/Institution Name:
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter university/institution name"
                value={universityInstitutionName}
                onChange={(e)=>setUniversityInstitutionName(e.target.value)}
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
                  value={courseName}
                onChange={(e)=>setCourseName(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Course Level:</label>
                <select
                  className="form-select"
                  value={courseLevel}
                  onChange={(e) => setCourseLevel(e.target.value)}
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
                  value={startYearUni}
                onChange={(e)=>setStartYearUni(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">End Year:</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter end year (e.g., 2025)"
                  min="1950"
                  max="2100"
                  value={endYearUni}
                  onChange={(e)=>setYEndYearUni(e.target.value)}
                />
              </div>
            </div>
            <div className="form-check mb-3">
  <input
    type="checkbox"
    className="form-check-input"
    checked={isCurrentlyStudyingUni}
    onChange={handleCurrentlyStudyingUniChange}
  />
  <label className="form-check-label">Currently Studying</label>
</div>
          </div>

          <h4 className="fw-bold text-secondary text-center mb-4">
            Add Job Details
          </h4>

          {/* Form Group */}
          
          <div className="border rounded p-3 mb-3">
          <div className="col-12">
            <div className="input-group mb-3">
              <span className="input-group-text fw-bold">
                Company Name&nbsp;&nbsp;:
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text fw-bold">
              Job Position&nbsp;&nbsp;:
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Job Position"
              value={jobPosition}
              onChange={(e) => setJobPosition(e.target.value)}
            />
          </div>

          <div className="input-group mb-3">
            <label className="input-group-text fw-bold">
              Job Location&nbsp;&nbsp;:
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Job Location"
              value={jobLocation}
              onChange={(e) => setJobLocation(e.target.value)}
            />
          </div>
          <div className="input-group mb-3">
            <span className="input-group-text fw-bold">
              Job Start Date&nbsp;&nbsp;:
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Job Start Date"
              value={jobStartDate}
              onChange={(e) => setJobStartDate(e.target.value)}
            />
          </div>
          </div>
          {/* Action Buttons */}
          <div className="text-end">
            <button className="btn btn-primary me-2" onClick={handleSubmit}>
              Save Personal Details
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

export default AddStudentEduction;
