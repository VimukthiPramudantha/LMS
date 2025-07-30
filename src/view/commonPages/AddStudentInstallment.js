import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const AddStudentInstallment = () => {
  const location = useLocation();
  const student = location.state;
  const [CourseFee, setCourseFee] = useState("");

  const [Installments, setInstallments] = useState([
    {
      installmentNumber: 1,
      installmentAmount: "",
      dueDate: "",
      paymentStatus: "Pending",
    },
  ]);
  const [courses, setCourses] = useState([]);
  const [PaymentAmount, setPaymentAmount] = useState("");
  const [remainingPayable, setRemainingPayable] = useState(0); // Add this to track remaining amount
  const [filteredCourses, setFilteredCourses] = useState([]);
  const token = localStorage.getItem("token");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [editingIndex, setEditingIndex] = useState(null); // Track the installment being edited
  const [selectedStatus, setSelectedStatus] = useState(""); // Track the selected status

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
  });

  const navigate = useNavigate();

  const handleOnCancel = () => {
    const selectedCourse = courses.find(
      (course) => course._id === selectedCourseId
    );

    if (selectedCourse) {
      // console.log("Selected Course:", selectedCourse);
      // console.log("Total Course Fee:", selectedCourse.totalCourseFee); // Assuming totalCourseFee is the property name
    } else {
      // console.log("No course selected or course not found.");
    }

    navigate(-1);
  };

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
          setFilteredCourses(filtered); // Set filtered courses based on campus
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

  // Handle adding a new installment
  const handleAddInstallment = () => {
    setInstallments([
      ...Installments,
      {
        installmentNumber: Installments.length + 1,
        installmentAmount: "",
        dueDate: "",
        paymentStatus: "Pending",
      },
    ]);
  };

  // Handle course selection
  const handleCourseSelect = (courseId) => {
    setSelectedCourseId(courseId);

    // Find the selected course and set its fee
    const selectedCourse = courses.find((course) => course._id === courseId);
    if (selectedCourse) {
      setCourseFee(selectedCourse.totalCourseFee); // Assuming `totalCourseFee` is the property name for the course fee
    } else {
      setCourseFee(""); // Reset if no course is found
    }
  };

  // Handle installment input change and recalculate remaining payable
  const handleInstallmentChange = (index, field, value) => {
    const newInstallments = [...Installments];
    newInstallments[index][field] = value;

    const totalInstallments = newInstallments.reduce(
      (sum, inst) => sum + (parseFloat(inst.installmentAmount) || 0),
      0
    );

    if (totalInstallments > PaymentAmount) {
      alert("Installment total cannot exceed the payment amount!");
      return;
    }

    setInstallments(newInstallments);
    calculateRemainingPayable(newInstallments);
  };

  // Handle removing an installment and recalculate remaining payable
  const handleRemoveInstallment = (index) => {
    const newInstallments = Installments.filter((_, i) => i !== index);
    setInstallments(newInstallments);
    calculateRemainingPayable(newInstallments);
  };

  const calculatePaymentAmount = (fee, discount) => {
    const feeValue = parseFloat(fee) || 0;
    const discountValue = parseFloat(discount) || 0;
    const totalPayable = Math.max(feeValue - discountValue, 0); // Prevent negative values
    setPaymentAmount(totalPayable.toFixed(2));
    setRemainingPayable(totalPayable.toFixed(2));
  };

  // Calculate the remaining payable amount by subtracting installment totals
  const calculateRemainingPayable = (
    newInstallments,
    totalPayable = PaymentAmount
  ) => {
    const totalInstallments = newInstallments.reduce(
      (sum, installment) =>
        sum + (parseFloat(installment.installmentAmount) || 0),
      0
    );
    const remaining = (totalPayable - totalInstallments).toFixed(2);
    setRemainingPayable(remaining);
  };

  const handleOnAddInstallent = async () => {
    try {
      const data = {
        StudentId: student._id,
        StudentName: student.studentName,
        Course: selectedCourseId,
        CourseFee,
        Discount: student.disCount,
        PaymentPlan: student.paymentPlan,
        PaymentAmount,
        Installments,
      };

      const response = await axios.post(
        "https://primelms-server.netlify.app/api/coordinatorAddStudent/addStudentInstallent",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        alert("Student installment added successfully!");
        navigate("/academic/manage-student");
      }
    } catch (error) {
      console.error("Failed to add installment student:", error);
      alert("Failed to add installment student. Please try again.");
    }
  };

  useEffect(() => {
    calculatePaymentAmount(CourseFee, student.disCount);
  }, [CourseFee, student.disCount]);

  const course = student?.courseTitle?.[0];
  const paymentPlan = student?.paymentPlan;

  // Parse the paymentPlan string into an array of installments
  const installments = paymentPlan
    ? paymentPlan.split('\n').reduce((acc, line) => {
      if (line.includes('Installment Number')) {
        const installmentNumber = line.split(': ')[1]?.trim();
        acc.push({ installmentNumber });
      } else if (line.includes('Amount')) {
        acc[acc.length - 1].amount = line.split(': ')[1]?.trim();
      } else if (line.includes('Due Date')) {
        acc[acc.length - 1].dueDate = line.split(': ')[1]?.trim();
      } else if (line.includes('Status')) {
        acc[acc.length - 1].status = line.split(': ')[1]?.trim();
      }
      return acc;
    }, [])
    : [];

  // Handle updating installment status
  const handleUpdateStatus = (index, status) => {
    const newInstallments = [...Installments];
    newInstallments[index].paymentStatus = status;
    setInstallments(newInstallments);
    setEditingIndex(null); // Exit editing mode
  };

  return (
    <>
      <div className="form-bg-image">
        <div className="col-12 d-flex justify-content-center mt-4">
          <div className="row col-lg-6 shadow-lg m-3 rounded-3 h-auto mt-4 p-3 formColour border border-3 border-end-0 border-start-0 border-primary">
            <h4 className="fw-bold text-black-50 mt-3 mb-4">
              Add Student Installment
            </h4>
            {/* Form Group */}
            <div className="col-12 col-xl-6">
              <div className="input-group mb-3">
                <span className="input-group-text fw-bold" id="basic-addon3">
                  Student ID&nbsp;:
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="basic-url"
                  value={student.studentID}
                  disabled
                  aria-describedby="basic-addon3"
                />
              </div>
            </div>

            <div className="col-12 col-xl-6">
              <div className="input-group mb-3">
                <span className="input-group-text fw-bold" id="basic-addon3">
                  Student Name&nbsp;:
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="basic-url"
                  value={student.studentName}
                  aria-describedby="basic-addon3"
                  disabled
                />
              </div>
            </div>
            {/* Course Selection Dropdown */}
            <div className="col-12 col-xl-6">
              <select
                className="form-select"
                onChange={(e) => handleCourseSelect(e.target.value)}
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.courseTitle}
                  </option>
                ))}
              </select>
            </div>
            {/* Display Course Fee */}
            <div className="col-12 col-xl-6">
              <div className="input-group mb-3">
                <span className="input-group-text fw-bold" id="basic-addon3">
                  Course Fee&nbsp;:
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="basic-url"
                  value={CourseFee}
                  aria-describedby="basic-addon3"
                  disabled // Disable input to make it read-only
                />
              </div>
            </div>
            <div className="col-12 col-xl-6">
              <div className="input-group mb-3">
                <span className="input-group-text fw-bold" id="basic-addon3">
                  Discount&nbsp;:
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="basic-url"
                  value={student.disCount}
                  onChange={(e) =>
                    setFormData({ ...formData, disCount: e.target.value })
                  }
                  aria-describedby="basic-addon3"
                />
              </div>
            </div>
            <div className="col-12 col-xl-6">
              <div className="input-group mb-3">
                <label
                  className="input-group-text fw-bold"
                  htmlFor="inputGroupSelect01"
                >
                  Payment Amount&nbsp;&nbsp;:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="basic-url"
                  placeholder="Enter Payment Amount"
                  value={PaymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  aria-describedby="basic-addon3"
                />
              </div>
            </div>

            <div className="col-12 mt-4 shadow">
              <div className="table-responsive CourseAndPaymentCardTableHight">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Installment</th>
                      <th scope="col" className="text-end">Amount (Rs)</th>
                      <th scope="col" className="text-end">Due Date</th>
                      <th scope="col" className="text-end">Status</th>
                      <th scope="col" className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {installments.length > 0 ? (
                      installments.map((installment, index) => (
                        <tr key={index}>
                          <td>{installment.installmentNumber || 'N/A'}</td>
                          <td className="text-end">{installment.amount || 'N/A'}</td>
                          <td className="text-end">{installment.dueDate || 'N/A'}</td>
                          <td className="text-end">
                            {editingIndex === index ? (
                              <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Paid">Paid</option>
                                <option value="Unpaid">Unpaid</option>
                              </select>
                            ) : (
                              installment.paymentStatus || 'N/A'
                            )}
                          </td>
                          <td className="text-end">
                            {editingIndex === index ? (
                              <button
                                className="btn btn-primary"
                                onClick={() => handleUpdateStatus(index, selectedStatus)}
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                className="btn btn-success"
                                onClick={() => {
                                  setEditingIndex(index);
                                  setSelectedStatus(installment.paymentStatus);
                                }}
                              >
                                Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">No Installment Data Available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="col-12 text-end">
              <div className="col-12 text-end">
                <button
                  onClick={handleOnAddInstallent}
                  type="button"
                  className="btn btn-primary m-2"
                >
                  Add
                </button>
                <button
                  onClick={handleOnCancel}
                  type="button"
                  className="btn btn-dark m-2"
                >
                  Cancel
                </button>
              </div>
            </div>
            {/* Form Group */}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddStudentInstallment;