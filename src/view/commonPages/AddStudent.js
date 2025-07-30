import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const AddStudent = () => {
  const [file, setFile] = useState(null); // State for payment slip
  const [uploadedSlipUrl, setUploadedSlipUrl] = useState(""); // URL for uploaded file
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [studentId, setStudentId] = useState(""); // Auto-generated Student ID
  const [paymentPlans, setPaymentPlans] = useState([]);
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState(null);
  const [campusName, setCampusName] = useState("No campus assigned");
  const [formData, setFormData] = useState({
    courseTitle: "",
    paymentPlan: "",
    studentId: "",
    studentName: "",
    studentNIC: "",
    childhoodNIC: "",
    password: "",
    campusName: "",
    whatsAppMobileNo1: "",
    disCount: 0,
    paymentAmount: 0,
    paidAmount: 0,
    installments: [], // Ensure installments is initialized as an empty array
  });
  const navigate = useNavigate();

  useEffect(() => {
    const generateStudentID = async () => {
      try {
        // Fetch the selected course
        const selectedCourse = courses.find(
          (course) => course._id === formData.courseTitle
        );
  
        if (!selectedCourse) {
          // If no course is selected, set a default ID
          setFormData((prevData) => ({
            ...prevData,
            studentId: "UNASSIGNED-0001",
          }));
          return;
        }
  
        const courseCode = selectedCourse.courseCode; // Get the course code
        const initialStudentNumber = selectedCourse.initialStudentNumber || 0; // Get the initial student number (default to 0 if not provided)
  
        // Fetch all students for the selected course
        const response = await axios.get(
          `https://lmsacademicserver.netlify.app/api/coordinatorAddStudent/getAllStudents?courseTitle=${formData.courseTitle}`
        );
        const students = response.data;
  
        // Extract existing student IDs
        const existingStudentIDs = students.map((student) => student.studentID);
  
        // Generate a unique student ID
        let newStudentNumber = initialStudentNumber + 1;
        let newStudentID = `${courseCode}-${String(newStudentNumber).padStart(
          4,
          "0"
        )}`;
  
        // Check if the generated ID already exists
        while (existingStudentIDs.includes(newStudentID)) {
          newStudentNumber += 1; // Increment the student number
          newStudentID = `${courseCode}-${String(newStudentNumber).padStart(
            4,
            "0"
          )}`;
        }
  
        // Update the form data with the new student ID
        setFormData((prevData) => ({
          ...prevData,
          studentId: newStudentID,
        }));
      } catch (error) {
        console.error("Error generating ID:", error);
        // Fallback to a default ID if there's an error
        setFormData((prevData) => ({
          ...prevData,
          studentId: "UNASSIGNED-0001",
        }));
      }
    };
  
    if (formData.courseTitle) {
      generateStudentID();
    }
  }, [formData.courseTitle, courses]);
  

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "https://lmsacademicserver.netlify.app/api/course/getAllCourses"
        );
        if (Array.isArray(response.data.courses)) {
          const campusData = localStorage.getItem("assignCampus");
          const campusArray = JSON.parse(campusData) || [];
          const filtered = response.data.courses.filter((course) =>
            course.campus.some((campus) =>
              campusArray.includes(campus._id.toString())
            )
          );
          setCourses(response.data.courses);
          setFilteredCourses(filtered);
        } else {
          console.error(
            "Unexpected response format for courses:",
            response.data
          );
        }
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchPaymentPlans = async () => {
      try {
        const response = await axios.get(
          "https://lmsacademicserver.netlify.app/api/payment/getAllPaymentPlans"
        );
        if (Array.isArray(response.data)) {
          setPaymentPlans(response.data);
        } else {
          console.error(
            "Unexpected response format for payment plans:",
            response.data
          );
        }
      } catch (err) {
        console.error("Error fetching payment plans:", err);
      }
    };
    fetchPaymentPlans();
  }, []);

  const handlePaymentPlanSelect = (selectedPlanId) => {
    const plan = paymentPlans.find((p) => p._id === selectedPlanId);
    if (plan) {
      setSelectedPaymentPlan(plan);

      // Calculate payment amount
      const paymentAmount = plan.totalCourseFee - plan.disCount;

      // Initialize installments array
      const installments = plan.paymentPlan.map((installment, index) => ({
        installmentNumber: index + 1, // Assign installment number based on index
        amount: installment.installmentAmount, // Use the actual amount from the installment
        dueDate: installment.dueDate, // Use the actual due date from the installment
        status: installment.paymentStatus || "Pending", // Default status if not provided
      }));

      // Get the first installment amount (for paidAmount)
      const firstInstallmentAmount = installments[0]?.amount || 0;

      // Get the second installment amount (for firstDuePayment)
      const secondInstallmentAmount = installments[1]?.amount || 0;

      // Update formData with payment plan details, installments, paidAmount, and firstDuePayment
      setFormData((prevData) => ({
        ...prevData,
        paymentPlan: plan.paymentTitle, // Use the payment plan title or format it as needed
        disCount: plan.disCount,
        paymentAmount: paymentAmount,
        installments: installments, // Ensure installments array is set
        paidAmount: firstInstallmentAmount, // Set paidAmount to the first installment's amount
        firstDuePayment: secondInstallmentAmount, // Set firstDuePayment to the second installment's amount
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCourseSelect = (courseId) => {
    setFormData({ ...formData, courseTitle: courseId });
    setSelectedCourseId(courseId);
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "https://lmsacademicserver.netlify.app/api/coordinatorAddStudent/addStudent",
        {
          campusName: campusName,
          courseTitle: formData.courseTitle,
          paymentPlan: formData.paymentPlan,
          studentID: formData.studentId,
          studentName: formData.studentName,
          StudentNIC: formData.studentNIC,
          childHoodNIC: formData.childhoodNIC,
          password: formData.password,
          whatsAppMobileNo1: formData.whatsAppMobileNo1,
          disCount: formData.disCount,
          paymentAmount: formData.paymentAmount,
          paidAmount: formData.paidAmount,
          firstDuePayment: formData.firstDuePayment,
        }
      );
      if (response.status === 201) {
        alert("Student added successfully!");
        navigate(-1);
      }
    } catch (error) {
      console.error("Failed to add student:", error);
      alert("Failed to add student. Please try again.");
    }
  };

  useEffect(() => {
    const campusData = localStorage.getItem("assignCampus");
    if (campusData && courses.length > 0) {
      const campusArray = JSON.parse(campusData);
      if (campusArray.length > 0) {
        const matchingCampus = courses.find((course) =>
          course.campus.some((courseCampus) =>
            campusArray.includes(courseCampus._id.toString())
          )
        );
        if (matchingCampus) {
          const matchedCampus = matchingCampus.campus.find((campus) =>
            campusArray.includes(campus._id.toString())
          );
          if (matchedCampus) {
            setCampusName(matchedCampus.campusName);
          }
        } else {
          setCampusName("No matching campus found");
        }
      } else {
        setCampusName("No campus assigned");
      }
    }
  }, [courses]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadSlip = async () => {
    if (!file) {
      alert("Please select a file to upload");
      return;
    }
    const formData = new FormData();
    formData.append("paymentSlip", file);
    try {
      const response = await axios.post(
        "https://lmsacademicserver.netlify.app/api/uploadPaymentSlip",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploadedSlipUrl(response.data.filePath);
      alert("Payment slip uploaded successfully!");
    } catch (error) {
      console.error("Failed to upload payment slip:", error);
      alert("Failed to upload payment slip. Please try again.");
    }
  };

  return (
    <div className="form-bg-image">
      <div className="col-12 d-flex justify-content-center mt-4">
        <div className="row col-lg-6 shadow-lg m-3 rounded-3 h-auto mt-4 p-3 formColour border border-3 border-end-0 border-start-0 border-primary">
          <h4 className="fw-bold text-black-50 mt-3 mb-4">
            Create New Student
          </h4>

          <div className="col-12 ">
            <div className="input-group mb-3 ">
              <span className="input-group-text fw-bold">
                Campus Name&nbsp;&nbsp;&nbsp;&nbsp;:
              </span>
              <input
                type="text"
                className="form-control col-12 "
                name="campusName"
                value={campusName}
                readOnly
              />
            </div>
          </div>

          <div className="col-12">
            <div className="input-group mb-3">
              <span className="input-group-text fw-bold">
                Course Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
              </span>

              <select
                className="form-select"
                name="courseTitle"
                value={formData.courseTitle}
                onChange={(e) => handleCourseSelect(e.target.value)} // Update on course selection
                required
              >
                <option value="">Select Course</option>
                {filteredCourses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseTitle}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text fw-bold">
              Student
              Id&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </span>
            <input
              type="text"
              className="form-control"
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text fw-bold">
              Student Name&nbsp;&nbsp;&nbsp;&nbsp;:
            </span>
            <input
              type="text"
              className="form-control"
              name="studentName"
              value={formData.studentName}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="input-group mb-3">
            <span className="input-group-text fw-bold">
              Student WhatsApp No&nbsp;:&nbsp;&nbsp;&nbsp;&nbsp;
              <PhoneInput
                country={"lk"} // Default country
                value={formData.whatsAppMobileNo1} // Bind to formData
                onChange={(phone) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    whatsAppMobileNo1: phone, // Update formData with phone value
                  }))
                }
                inputStyle={{ width: "100%" }} // Adjust input width
                required
              />
            </span>
          </div>

          <div className="col-12">
            <div className="input-group mb-3">
              <span className="input-group-text fw-bold">
                Payment Plan&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
              </span>
              <select
                className="form-select"
                name="paymentPlan"
                value={selectedPaymentPlan ? selectedPaymentPlan._id : ""} // Use selectedPaymentPlan's ID
                onChange={(e) => handlePaymentPlanSelect(e.target.value)} // Call handlePaymentPlanSelect on change
              >
                <option value="">Select a payment plan</option>
                {paymentPlans.map((plan) => (
                  <option key={plan._id} value={plan._id}>
                    {plan.paymentTitle}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="col-12 col-xl-6">
            <div className="input-group mb-3">
              <span className="input-group-text fw-bold">
                Total Course Fee&nbsp;:
              </span>
              <input
                type="text"
                className="form-control"
                name="disCount"
                value={formData.paymentAmount + formData.disCount}
                readOnly
              />
            </div>
          </div>

          <div className="col-12 col-xl-6">
            <div className="input-group mb-3">
              <span className="input-group-text fw-bold">
                Discount&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
              </span>
              <input
                type="text"
                className="form-control"
                name="disCount"
                value={formData.disCount}
                readOnly
              />
            </div>
          </div>

          <div className="col-12 col-xl-6">
            <div className="input-group mb-3">
              <span className="input-group-text fw-bold">
                Payable Amount&nbsp;:
              </span>
              <input
                type="text"
                className="form-control"
                name="paymentAmount"
                value={formData.paymentAmount}
                readOnly
              />
            </div>
          </div>
          <div className="col-12 col-xl-6">
            <div className="input-group mb-3">
              <span className="input-group-text fw-bold">
                First Due Payment&nbsp;:
              </span>
              <input
                type="number"
                className="form-control"
                name="firstDuePayment"
                value={formData.firstDuePayment}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="col-12 col-xl-6">
            <div className="input-group mb-3">
              <span className="input-group-text fw-bold">
                Paid Amount&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
              </span>
              <input
                type="number"
                className="form-control"
                name="paidAmount"
                value={formData.paidAmount}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="col-12 col-xl-6">
            <label className="form-label fw-bold">Upload Payment Slip:</label>
            <input
              type="file"
              className="form-control"
              onChange={handleFileChange}
            />

            {uploadedSlipUrl && (
              <p
                className="mt-2"
                style={{ backgroundColor: "rgb(900, 0, 55)" }}
              >
                Uploaded File: {uploadedSlipUrl}
              </p>
            )}
          </div>

          <div className="col-12 text-end mt-3 ">
            <button
              type="button"
              className="btn btn-primary m-2"
              onClick={handleSubmit}
              style={{ backgroundColor: "rgb(13, 13, 175)" }}
            >
              Save
            </button>
            <button
              type="button"
              className="btn btn-dark py-0 m-2"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
