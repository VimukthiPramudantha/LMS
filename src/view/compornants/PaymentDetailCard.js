import React, { useEffect, useState } from "react";
import axios from "axios";

const PaymentDetailCard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [installments, setInstallments] = useState([]);

  const okOrNot = installments.some((installment) => {
    if (installment.paymentStatus === "Paid") {
      const lastPaidDate = new Date(installment.formattedDueDate);
      return lastPaidDate >= new Date();
    }
  })
    ? "You are up to date with your payments."
    : "Please complete all installments to continue attending classes.";

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return parseFloat(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
    });
  };

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

  if (loading)
    return <div className="text-center py-5">Loading payment details...</div>;
  if (!student)
    return <div className="text-center py-5">No student data found</div>;

  const course = student.courseTitle?.[0] || {};

  return (
    <div className="col-12 col-lg-6 p-3 mb-2">
      <div className="shadow p-3 rounded CourseAndPaymentCardHight">
        <h3 className="fw-bold text-primary mb-4">Payment Details</h3>

        <div className="mb-3 d-flex flex-wrap gap-4 p-3 border rounded shadow-sm bg-light">
          <div className="flex-grow-1">
            <h5 className="fw-bold">Payment Summary</h5>
            <div className="p-3 bg-white border rounded shadow-sm">
              <p className="fw-semibold text-secondary d-flex justify-content-between">
                <span>Course Fee:</span>
                <span className="text-dark">
                  {formatCurrency(course.totalCourseFee)}
                </span>
              </p>
              <p className="fw-semibold text-secondary d-flex justify-content-between">
                <span>Discount:</span>
                <span className="text-success">
                  -{formatCurrency(student.disCount)}
                </span>
              </p>
              <hr className="border border-2 w-100 border-secondary" />
              <p className="fw-bold text-dark d-flex justify-content-between">
                <span>Payable Amount:</span>
                <span>{formatCurrency(student.paymentAmount)}</span>
              </p>
            </div>
          </div>

          <div className="alert alert-info flex-grow-1 d-flex align-items-center mt-5 justify-content-between p-5 shadow-sm">
            <span className="badge bg-success" style={{fontSize:"0.8rem"}}>{okOrNot}</span>
          </div>
        </div>

        <div className="table-responsive mt-4">
          <table className="table">
            <thead className="thead-dark">
              <tr>
                <th>Installment</th>
                <th className="text-end">Amount (Rs)</th>
                <th className="text-end">Due Date</th>
                <th className="text-end">Status</th>
              </tr>
            </thead>
            <tbody>
              {installments.length > 0 ? (
                installments.map((installment, index) => (
                  <tr
                    key={index}
                    className={
                      installment.paymentStatus === "Paid"
                        ? "table-success"
                        : "table-danger"
                    }
                  >
                    <td>{installment.installmentNumber || "N/A"}</td>
                    <td className="text-end">
                      {formatCurrency(installment.installmentAmount)}
                    </td>
                    <td className="text-end">
                      {installment.formattedDueDate || "N/A"}
                    </td>
                    <td className="text-end">
                      <span
                        className={`badge ${
                          installment.paymentStatus === "Paid"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {installment.paymentStatus || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center">
                    No installment data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailCard;
