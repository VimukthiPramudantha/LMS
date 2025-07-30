import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  FaUpload,
  FaSave,
  FaTimes,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa"; // Icons for buttons
import { useLocation } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";

const AddStudent = () => {
  const [file, setFile] = useState(null); // State for payment slip
  const [uploadedSlipUrl, setUploadedSlipUrl] = useState(""); // URL for uploaded file
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [studentId, setStudentId] = useState(""); // Auto-generated Student ID
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
    paymentSlipReference: "",
    portalAccess: false,
  });
  const navigate = useNavigate();

  const [isLoadingPaymentPlans, setIsLoadingPaymentPlans] = useState(false);
  const [userCampusId, setUserCampusId] = useState(null);
  const [paymentPlans, setPaymentPlans] = useState([]);

  const location = useLocation();
  const userName = localStorage.getItem("name");

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    // Basic validation before proceeding
    if (
      !formData.courseTitle ||
      !formData.studentName ||
      !formData.whatsAppMobileNo1
    ) {
      alert("Please fill all required student details before proceeding");
      return;
    }
    setCurrentStep(2);
    setShowPaymentModal(true);
  };

  const handleBack = () => {
    setCurrentStep(1);
    setShowPaymentModal(false);
  };
  // console.log("User Name:", userName);

  // Initialize with selected course from navigation state
  useEffect(() => {
    if (location.state?.selectedCourse) {
      const { selectedCourse } = location.state;
      console.log("Selected Course:", selectedCourse);

      setFormData((prev) => ({
        ...prev,
        courseTitle: selectedCourse._id, // Store the course ID
        courseName: selectedCourse.courseTitle, // Store the course name for display
      }));

      setSelectedCourseId(selectedCourse._id);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchPaymentPlansByCampus = async () => {
      if (!userCampusId) return; // Ensure campus ID is available

      setIsLoadingPaymentPlans(true);
      try {
        // Fetch payment plans for the specific campus
        const response = await axios.get(
          `https://primelms-server.netlify.app/api/payment/getPaymentPlansByCampus/${userCampusId}`
        );

        if (response.data) {
          setPaymentPlans(response.data); // Set campus-specific payment plans
          console.log("Fetched campus-specific payment plans:", response.data);
        }
      } catch (error) {
        console.error("Error fetching payment plans by campus:", error);
      } finally {
        setIsLoadingPaymentPlans(false);
      }
    };

    fetchPaymentPlansByCampus();
  }, [userCampusId]); // Run only when userCampusId changes

  useEffect(() => {
    const fetchUserCampus = async () => {
      const campusData = localStorage.getItem("assignCampus");
      if (campusData) {
        const campusArray = JSON.parse(campusData);
        if (campusArray.length > 0) {
          setUserCampusId(campusArray[0]); // Set the first campus ID
        }
      }
    };

    fetchUserCampus();
  }, []); // Run only once on mount

  // Update student ID generation to use the pre-selected course
  useEffect(() => {
    const generateStudentID = async () => {
      try {
        // Use the course from location.state if available
        const selectedCourse =
          location.state?.selectedCourse ||
          courses.find((course) => course._id === formData.courseTitle);

        if (!selectedCourse) {
          setFormData((prev) => ({ ...prev, studentId: "UNASSIGNED-0001" }));
          return;
        }

        const courseCode = selectedCourse.courseCode;
        const initialStudentNumber = selectedCourse.initialStudentNumber || 0;

        const response = await axios.get(
          `https://primelms-server.netlify.app/api/coordinatorAddStudent/getAllStudents?courseTitle=${selectedCourse._id}`
        );

        const existingStudentIDs = response.data.map(
          (student) => student.studentID
        );
        let newStudentNumber = initialStudentNumber + 1;
        let newStudentID = `${courseCode}-${String(newStudentNumber).padStart(
          4,
          "0"
        )}`;

        while (existingStudentIDs.includes(newStudentID)) {
          newStudentNumber += 1;
          newStudentID = `${courseCode}-${String(newStudentNumber).padStart(
            4,
            "0"
          )}`;
        }

        setFormData((prev) => ({ ...prev, studentId: newStudentID }));
      } catch (error) {
        console.error("Error generating ID:", error);
        setFormData((prev) => ({ ...prev, studentId: "UNASSIGNED-0001" }));
      }
    };

    if (formData.courseTitle || location.state?.selectedCourse) {
      generateStudentID();
    }
  }, [formData.courseTitle, courses, location.state]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "https://primelms-server.netlify.app/api/course/getAllCourses"
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

  const handlePaymentPlanSelect = (selectedPlanId) => {
    const plan = paymentPlans.find((p) => p._id === selectedPlanId);
    if (plan) {
      setSelectedPaymentPlan(plan);
      const firstInstallment = plan.paymentPlan[0];
      const paymentAmount = plan.totalCourseFee - (plan.disCount || 0);

      setFormData((prev) => ({
        ...prev,
        paymentPlan: plan._id,
        disCount: plan.disCount || 0,
        paymentAmount: paymentAmount,
        paidAmount: firstInstallment?.installmentAmount?.toString() || "0",
        firstDuePayment: firstInstallment?.installmentAmount || 0,
        Remaining: "0", // Initially no remaining since full amount is paid
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
      // Format installments
      const formattedInstallments =
        selectedPaymentPlan?.paymentPlan.map((installment, index) => {
          const paidAmount =
            index === 0 ? parseFloat(formData.paidAmount || 0) : 0;
          const remainingAmount = installment.installmentAmount - paidAmount;

          return {
            installmentNumber: index + 1,
            installmentAmount: installment.installmentAmount,
            PaidAmount: paidAmount.toString(),
            Remaining: remainingAmount.toFixed(2),
            PaidDate:
              index === 0 ? new Date().toISOString().split("T")[0] : null,
            OfficerName: userName,
            dueDate: installment.dueDate,
            paymentStatus: index === 0 ? "Pending" : "Pending",
            paymentSlipReference:
              index === 0 ? formData.paymentSlipReference : "",
            accApproval: "Pending",
            accHeadApproval: "Pending",
          };
        }) || [];

      // Create payment history if paidAmount > 0
      const paymentHistory = [];
      if (formData.paidAmount > 0) {
        paymentHistory.push({
          PaymentHistoryNumber: 1,
          PaymentHistoryPaidAmount: formData.paidAmount.toString(),
          PaymentHistoryPaidDate: new Date().toISOString().split("T")[0],
          PayHisSlipReference: formData.paymentSlipReference,
          payHisSlipRefCheck: formData.paymentSlipReference,
          payHisAccApproval: "Pending",
          payHisAccHeadApproval: "Pending",
          PayHisOfficerName: userName,
          PayHisPaymentStatus: "Pending",
          installmentNumber: "1", // Add installment number
          // coordinateAddStudentPay will be set by the backend
        });
      }

      // API call
      const response = await axios.post(
        "https://primelms-server.netlify.app/api/coordinatorAddStudent/addStudent",
        {
          campusName: campusName,
          courseTitle: formData.courseTitle,
          studentID: formData.studentId,
          studentName: formData.studentName,
          StudentNIC: formData.studentNIC,
          childHoodNIC: formData.childhoodNIC,
          password: formData.password,
          paymentSlipReference:
            uploadedSlipUrl || formData.paymentSlipReference,
          whatsAppMobileNo1: formData.whatsAppMobileNo1,
          disCount: formData.disCount,
          paymentAmount: formData.paymentAmount,
          paidAmount: formData.paidAmount,
          remainingAmount: formData.remainingAmount,
          firstDuePayment: formData.firstDuePayment,
          portalAccess: false,
          Installments: formattedInstallments,
          PaymentHistory: paymentHistory,
          paymentPlan: selectedPaymentPlan?._id || "", // Include paymentPlan ID
        }
      );

      if (response.status === 201) {
        alert("Student added successfully!");
        navigate(-1);
      }
    } catch (error) {
      console.error("Failed to add student:", error);
      alert(
        `Failed to add student. Error: ${
          error.response?.data?.message || error.message || "Please try again."
        }`
      );
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
        "https://primelms-server.netlify.app/api/coordinatorAddStudent/uploadPaymentSlip",
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

  const sendViaWhatsApp = (fileUrl) => {
    // Format the WhatsApp number (remove leading 0 if present and add international code)
    const phoneNumber = "94758495060"; // Sri Lanka number format

    // Create the message with the file URL
    const message = `Payment slip uploaded: ${fileUrl}`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);

    // Create WhatsApp share link
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Open in new tab
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-header bg-primary text-white">
              <h4 className="fw-bold mb-0">
                Create New Student (Step {currentStep} of 2)
              </h4>
            </div>

            <div className="card-body">
              {currentStep === 1 && (
                <>
                  <h3 className="mb-4">Student Details</h3>
                  <div className="row g-3">
                    {/* Campus Name */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Campus Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={campusName}
                        readOnly
                      />
                    </div>

                    {/* Course Selection */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Course Name*</label>
                      {location.state?.selectedCourse ? (
                        <input
                          type="text"
                          className="form-control"
                          value={location.state.selectedCourse.courseTitle}
                          readOnly
                        />
                      ) : (
                        <select
                          className="form-select"
                          value={formData.courseTitle}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              courseTitle: e.target.value,
                            });
                            setSelectedCourseId(e.target.value);
                          }}
                          required
                        >
                          <option value="">Select Course</option>
                          {filteredCourses.map((course) => (
                            <option key={course._id} value={course._id}>
                              {course.courseTitle}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>

                    {/* Student ID */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Student ID</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.studentId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            studentId: e.target.value,
                          })
                        }
                        readOnly
                      />
                    </div>

                    {/* Student Name */}
                    <div className="col-md-6">
                      <label className="form-label fw-bold">
                        Student Name*
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.studentName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            studentName: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    {/* WhatsApp Number */}
                    <div className="col-md-12">
                      <label className="form-label fw-bold">
                        WhatsApp Number*
                      </label>
                      <PhoneInput
                        country={"lk"}
                        value={formData.whatsAppMobileNo1}
                        onChange={(phone) =>
                          setFormData({ ...formData, whatsAppMobileNo1: phone })
                        }
                        inputStyle={{ width: "100%" }}
                        inputProps={{ required: true }}
                      />
                    </div>

                    <div className="col-12 mt-4 d-flex justify-content-end">
                      <button
                        className="btn btn-secondary me-2"
                        onClick={() => navigate(-1)}
                      >
                        <FaArrowLeft /> Back
                      </button>
                      <button className="btn btn-primary" onClick={handleNext}>
                        Next <FaArrowRight />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details Modal */}
      <Modal show={showPaymentModal} onHide={handleBack} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Payment Details (Step 2 of 2)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row g-3">
            {/* Payment Plan */}
            <div className="col-md-12">
              <label className="form-label fw-bold">Payment Plan*</label>

              <select
                className="form-select"
                value={selectedPaymentPlan ? selectedPaymentPlan._id : ""}
                onChange={(e) => handlePaymentPlanSelect(e.target.value)}
                disabled={isLoadingPaymentPlans}
                // defaultValue={paymentPlans.length ? paymentPlans[0]._id : ""}
                required
              >
                <option value="">
                  {isLoadingPaymentPlans
                    ? "Loading payment plans..."
                    : paymentPlans.length
                    ? "Select a payment plan"
                    : "No payment plans available"}
                </option>
                {paymentPlans.map((plan) => (
                  <option key={plan._id} value={plan._id}>
                    {plan.paymentTitle} (LKR {plan.totalCourseFee})
                  </option>
                ))}
              </select>
              <div className="d-flex align-items-center mt-2 mb-3">
                <button
                  className="btn btn-outline-info btn-sm"
                  type="button"
                  onClick={() => {
                    if (selectedPaymentPlan) {
                      alert(`
                        Payment Plan Details:
                        Title: ${selectedPaymentPlan.paymentTitle}
                        Total Fee: LKR ${selectedPaymentPlan.totalCourseFee}
                        Discount: LKR ${selectedPaymentPlan.disCount || 0}
                        Payable Amount: LKR ${
                          selectedPaymentPlan.totalCourseFee -
                          (selectedPaymentPlan.disCount || 0)
                        }
                        Installments: 
                        ${selectedPaymentPlan.paymentPlan
                          .map(
                            (installment, index) =>
                              `\n${index + 1}. LKR ${
                                installment.installmentAmount
                              } (Due: ${installment.dueDate} Days)`
                          )
                          .join("")}
                      `);
                    } else {
                      alert("Please select a payment plan to view details.");
                    }
                  }}
                >
                  View Plan Details
                </button>
              </div>
            </div>

            {/* Payment Information */}
            <div className="col-md-4">
              <label className="form-label fw-bold">First Due Payment</label>
              <input
                type="text"
                className="form-control"
                value={formData.firstDuePayment || 0}
                readOnly
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Paid Amount*</label>
              <input
                type="number"
                className="form-control"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paidAmount:
                      e.target.value === "" ? "" : Number(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Remaining Amount</label>
              <input
                type="text"
                className="form-control"
                value={formData.firstDuePayment - formData.paidAmount || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    remainingAmount: e.target.value,
                  })
                }
                readOnly
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Payment Reference</label>
              <input
                type="text"
                className="form-control"
                value={formData.paymentSlipReference}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    paymentSlipReference: e.target.value,
                  })
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-bold">Payment Slip</label>
              <div className="input-group mb-3">
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={uploadSlip}
                >
                  <FaUpload /> Upload
                </button>
              </div>
              {uploadedSlipUrl && (
                <div className="alert alert-success p-2">
                  File uploaded successfully!
                  <button
                    className="btn btn-sm btn-outline-primary ms-2"
                    onClick={() => sendViaWhatsApp(uploadedSlipUrl)}
                  >
                    <FaWhatsapp /> Share via WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleBack}>
            <FaArrowLeft /> Back
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            <FaSave /> Save Student
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddStudent;
