import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AddStudentInstallment.css";

const AddStudentInstallment = () => {
  const location = useLocation();
  const student = location.state;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [installments, setInstallments] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [file, setFile] = useState(null); // State for payment slip
  const [paymentDetails, setPaymentDetails] = useState({
    paidAmount: "",
    paidDate: new Date().toISOString().split("T")[0],
    remainingAmount: "",
    paymentRefNo: "",
    officerName: "",
  });
  const [showPaymentHistory, setShowPaymentHistory] = useState(true);
  // Replace this line:
  // const dueDate = student.createdAt+installments.dueDate

// Function to calculate due date
const calculateDueDate = (createdAt, dueDays) => {
  if (!createdAt || !dueDays) return "N/A";

  // Convert createdAt to a Date object
  const createdDate = new Date(createdAt);

  // Add dueDays to the createdDate
  createdDate.setDate(createdDate.getDate() + parseInt(dueDays));

  // Return the calculated due date in YYYY-MM-DD format
  return createdDate.toISOString().split("T")[0];
};

  // Extract course information
  const courseInfo =
    Array.isArray(student.courseTitle) && student.courseTitle.length > 0
      ? student.courseTitle[0]
      : { courseTitle: "No Course Level", totalCourseFee: "No Course Fee" };

  const { courseTitle: CourseTitle, totalCourseFee: CourseFee } = courseInfo;
  const dueDate = student.createdAt + installments.dueDate;
  // Format currency
  const formatCurrency = (amount) => {
    return amount?.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const refreshPage = () => {
    window.location.reload();
  };
  useEffect(() => {
    // Check for saved installment data on component mount
    const savedInstallment = localStorage.getItem("selectedInstallment");
    if (savedInstallment) {
      try {
        const installment = JSON.parse(savedInstallment);
        setSelectedInstallment(installment);
        setPaymentDetails({
          paidAmount: installment.remainingAmount.toString(),
          paidDate: new Date().toISOString().split("T")[0],
          paymentRefNo: "",
          officerName: "",
        });
        setShowPaymentForm(true);
      } catch (error) {
        console.error("Error parsing saved installment:", error);
        localStorage.removeItem("selectedInstallment");
      }
    }
  }, []);
  useEffect(() => {
    return () => {
      // Clean up localStorage when component unmounts
      localStorage.removeItem("selectedInstallment");
    };
  }, []);
  // Fetch student data with installments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://primelms-server.netlify.app/api/coordinatorAddStudent/getStudent/${student._id}`
        );

        if (response.data) {
          // Process payment history
          const uniquePaymentHistory =
            response.data.PaymentHistory?.reduce((acc, current) => {
              const exists = acc.some(
                (item) =>
                  item.PayHisSlipReference === current.PayHisSlipReference &&
                  item.PaymentHistoryPaidAmount ===
                    current.PaymentHistoryPaidAmount &&
                  item.PaymentHistoryPaidDate === current.PaymentHistoryPaidDate
              );
              return exists ? acc : [...acc, current];
            }, []) || [];

          // Process installments with proper status calculation
          const processedInstallments =
            response.data.Installments?.map((inst) => {
              const paidAmount = parseFloat(inst.PaidAmount) || 0;
              const remainingAmount = inst.installmentAmount - paidAmount;
              const isFullyPaid = Math.abs(remainingAmount) < 0.01;

              return {
                ...inst,
                remainingAmount,
                paymentStatus: isFullyPaid
                  ? "Paid"
                  : paidAmount > 0
                  ? "Pending"
                  : "No Paid",
              };
            }) || [];

          setInstallments(processedInstallments);
          setPaymentHistory(uniquePaymentHistory);

          // Handle payment form state after refresh
          const savedInstallment = localStorage.getItem("selectedInstallment");
          if (savedInstallment) {
            try {
              const installment = JSON.parse(savedInstallment);
              const currentInstallment = processedInstallments.find(
                (i) => i._id === installment._id
              );

              if (currentInstallment) {
                setSelectedInstallment(currentInstallment);
                setPaymentDetails({
                  paidAmount: currentInstallment.remainingAmount.toString(),
                  paidDate: new Date().toISOString().split("T")[0],
                  paymentRefNo: "",
                  officerName: "",
                });
                setShowPaymentForm(true);
              }
            } catch (error) {
              console.error("Error parsing saved installment:", error);
              localStorage.removeItem("selectedInstallment");
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      // Clean up when component unmounts
      localStorage.removeItem("selectedInstallment");
    };
  }, [student._id]);

  const LoadingAnimation = () => (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  const handlePayClick = (installment) => {
    // Save the selected installment to localStorage
    localStorage.setItem("selectedInstallment", JSON.stringify(installment));

    // Update state with the selected installment
    setSelectedInstallment(installment);
    setPaymentDetails({
      paidAmount: installment.remainingAmount.toString(),
      paidDate: new Date().toISOString().split("T")[0],
      paymentRefNo: "",
      officerName: "",
    });
    setShowPaymentForm(true);
  };

  // Restore the selected installment after a page refresh
  useEffect(() => {
    const savedInstallment = localStorage.getItem("selectedInstallment");
    if (savedInstallment) {
      try {
        const installment = JSON.parse(savedInstallment);
        const currentInstallment = installments.find(
          (i) => i._id === installment._id
        );

        if (currentInstallment) {
          setSelectedInstallment(currentInstallment);
          setPaymentDetails({
            paidAmount: currentInstallment.remainingAmount.toString(),
            paidDate: new Date().toISOString().split("T")[0],
            paymentRefNo: "",
            officerName: "",
          });
          setShowPaymentForm(true);
        }
      } catch (error) {
        console.error("Error parsing saved installment:", error);
        localStorage.removeItem("selectedInstallment");
      }
    }
  }, [installments]);

  const handlePaymentSubmit = async () => {
    const { paidAmount, paidDate, paymentRefNo, officerName } = paymentDetails;
    const paidAmountNum = parseFloat(paidAmount);

    if (
      !paidAmount ||
      isNaN(paidAmountNum) ||
      paidAmountNum <= 0 ||
      !paidDate ||
      !paymentRefNo ||
      !officerName
    ) {
      alert("Please fill all fields with valid values!");
      return;
    }

    try {
      // Check if payment reference already exists
      const isDuplicate = paymentHistory.some(
        (payment) => payment.PayHisSlipReference === paymentRefNo
      );

      if (isDuplicate) {
        alert("Payment with this reference number already exists!");
        return;
      }

      // 1. Update the installment
      const updatedInstallments = installments.map((inst) => {
        if (inst._id === selectedInstallment._id) {
          const currentPaid = parseFloat(inst.PaidAmount) || 0;
          const newPaidAmount = currentPaid + paidAmountNum;
          const newRemainingAmount = inst.installmentAmount - newPaidAmount;

          let newStatus = inst.paymentStatus; // Keep current status if not fully paid
          if (Math.abs(newRemainingAmount) < 0.01) {
            newStatus = "Paid";
          } else if (newPaidAmount > 0) {
            newStatus = "Pending";
          }

          return {
            ...inst,
            PaidAmount: newPaidAmount.toString(),
            remainingAmount: newRemainingAmount,
            paymentStatus: newStatus,
            PaidDate: paidDate,
            paymentSlipReference: paymentRefNo,
            OfficerName: officerName,
          };
        }
        return inst;
      });

      // 2. Create payment history record
      const newPaymentRecord = {
        coordinateAddStudentPay: student._id,
        PaymentHistoryNumber: paymentHistory.length + 1,
        PaymentHistoryPaidAmount: paidAmountNum.toString(),
        PaymentHistoryPaidDate: paidDate,
        PayHisSlipReference: paymentRefNo,
        payHisSlipRefCheck: paymentRefNo,
        PayHisOfficerName: officerName,
        PayHisPaymentStatus: "Pending",
        payHisAccApproval: "Pending",
        payHisAccHeadApproval: "Pending",
        relatedInstallment: selectedInstallment._id,
        installmentNumber: selectedInstallment.installmentNumber,
      };

      // 3. Send updates to the server
      const response = await axios.patch(
        `https://primelms-server.netlify.app/api/coordinatorAddStudent/updateInstallments/${student._id}`,
        {
          Installments: updatedInstallments,
          PaymentHistory: [newPaymentRecord], // Send only the new record
        }
      );

      // 4. Update local state with the response data
      setInstallments(response.data.Installments);
      setPaymentHistory(response.data.PaymentHistory);
      setShowPaymentForm(false);
      localStorage.removeItem("selectedInstallment");
      alert("Payment recorded successfully!");
      refreshPage();
    } catch (error) {
      console.error("Error recording payment:", error);
      alert("Failed to record payment. Please try again.");
    }
  };

  const updatePaymentStatus = async (historyId, newStatus) => {
    if (!["Paid", "Pending", "Checking"].includes(newStatus)) {
      alert("Invalid status!");
      return;
    }

    try {
      // 1. Update the payment history record
      const updatedHistory = paymentHistory.map((record) =>
        record._id === historyId
          ? { ...record, PayHisPaymentStatus: newStatus }
          : record
      );

      // 2. Find related installment
      const updatedRecord = updatedHistory.find((r) => r._id === historyId);
      if (!updatedRecord) return;

      // 3. Update the related installment if needed
      let updatedInstallments = [...installments];
      if (newStatus === "Paid") {
        updatedInstallments = installments.map((inst) => {
          if (inst._id === updatedRecord.relatedInstallment) {
            // Check if all payments for this installment are now Paid
            const relatedPayments = updatedHistory.filter(
              (p) => p.relatedInstallment === inst._id
            );
            const allPaid = relatedPayments.every(
              (p) => p.PayHisPaymentStatus === "Paid"
            );

            return {
              ...inst,
              paymentStatus: allPaid ? "Paid" : "Pending",
            };
          }
          return inst;
        });
      }

      // 4. Send updates to the server
      await axios.patch(
        `https://primelms-server.netlify.app/api/coordinatorAddStudent/updateInstallments/${student._id}`,
        {
          Installments: updatedInstallments,
          PaymentHistory: updatedHistory,
        }
      );

      // 5. Update local state
      setInstallments(updatedInstallments);
      setPaymentHistory(updatedHistory);

      alert("Payment status updated successfully!");
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Failed to update payment status. Please try again.");
    }
  };

  const isInstallmentPaid = (installment) => {
    return (
      installment.paymentStatus === "Paid" ||
      (installment.paymentStatus === "Pending" &&
        Math.abs(installment.remainingAmount) < 0.01)
    );
  };

  const getStatusBadge = (status, remainingAmount) => {
    let badgeClass = "bg-secondary";
    let displayText = status;

    if (
      status === "Paid" ||
      (status === "Pending" && Math.abs(remainingAmount) < 0.01)
    ) {
      badgeClass = "bg-warning";
      displayText = "Pending";
    } else if (status === "Pending") {
      badgeClass = "bg-warning";
      if (remainingAmount > 0) {
        displayText = `Pending (${formatCurrency(remainingAmount)} remaining)`;
      }
    } else if (status === "Pending") {
      badgeClass = "bg-danger";
    } else if (status === "Checking") {
      badgeClass = "bg-info";
    }

    return <span className={`badge ${badgeClass}`}>{displayText}</span>;
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="form-bg-image">
      <div className="col-12 d-flex justify-content-center mt-4">
        <div className="row col-lg-10 shadow-lg m-3 rounded-3 h-auto mt-4 p-3 formColour border border-3 border-end-0 border-start-0 border-primary">
          <h4 className="fw-bold mt-3 mb-4">
            Manage <span className="text-primary">{student.studentName}'s</span>{" "}
            Installments
          </h4>

          {/* Student Information */}
          <div className="row">
            <div className="col-12 col-xl-6">
              <div className="input-group mb-3">
                <span className="input-group-text fw-bold">Student ID:</span>
                <input
                  type="text"
                  className="form-control"
                  value={student.studentID}
                  readOnly
                />
              </div>
            </div>

            <div className="col-12 col-xl-6">
              <div className="input-group mb-3">
                <span className="input-group-text fw-bold">Student Name:</span>
                <input
                  type="text"
                  className="form-control"
                  value={student.studentName}
                  readOnly
                />
              </div>
            </div>

            {/* Course Information */}
            <div className="col-12 col-xl-6">
              <div className="input-group mb-3">
                <span className="input-group-text fw-bold">Course:</span>
                <input
                  type="text"
                  className="form-control"
                  value={CourseTitle}
                  readOnly
                />
              </div>
            </div>

            <div className="col-12 col-xl-6">
              <div className="input-group mb-3">
                <span className="input-group-text fw-bold">Course Fee:</span>
                <input
                  type="text"
                  className="form-control"
                  value={formatCurrency(CourseFee)}
                  readOnly
                />
              </div>
            </div>

            {/* Payment Information */}
            <div className="col-12 col-xl-6">
              <div className="input-group mb-3">
                <span className="input-group-text fw-bold">Discount:</span>
                <input
                  type="text"
                  className="form-control"
                  value={formatCurrency(student.disCount)}
                  readOnly
                />
              </div>
            </div>

            <div className="col-12 col-xl-6">
              <div className="input-group mb-3">
                <span className="input-group-text fw-bold">
                  Payable Amount:
                </span>
                <input
                  type="text"
                  className="form-control"
                  value={formatCurrency(student.paymentAmount)}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Upcoming Installments Table */}
          <div className="col-12 mt-4 shadow">
            <h5 className="fw-bold text-primary mb-3">Upcoming Installments</h5>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th className="text-primary ">Index</th>
                    <th className="text-end text-primary text-center">Installment Date</th>
                    <th className="text-end text-primary">Days to Pay</th>
                    <th className="text-end text-primary">Amount</th>
                    <th className="text-end text-primary">Paid</th>
                    <th className="text-end text-primary">Remaining</th>
                    <th className="text-end text-primary">Status</th>
                    <th className="text-end text-primary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {installments.length > 0 ? (
                    installments.map((installment) => (
                      <tr key={installment._id}>
                        <td >{installment.installmentNumber || "N/A"}</td>
                        <td className="text-center">
                          {calculateDueDate(student.createdAt, installment.dueDate) || "N/A"}
                        </td>
                        <td className="text-end">
                          {installment.paymentStatus === "Paid" ||
                          (installment.paymentStatus === "Pending" &&
                            Math.abs(installment.remainingAmount) < 0.01) ? (
                            <span className="text-success fw-bold">Paid</span>
                          ) : (
                            (() => {
                              const dueDate = calculateDueDate(student.createdAt, installment.dueDate);
                              const today = new Date();
                              const dueDateObj = new Date(dueDate);
                              const diffTime = dueDateObj - today;
                              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                              return diffDays < 0 ? (
                                <span className="text-danger fw-bold">{diffDays}</span>
                              ) : (
                                diffDays
                              );
                            })()
                          )}
                        </td>
                        <td className="text-end">
                          {formatCurrency(installment.installmentAmount)}
                        </td>

                        <td className="text-end">
                          {formatCurrency(installment.PaidAmount || 0)}
                        </td>
                        <td className="text-end">
                          {Math.abs(installment.remainingAmount) < 0.01 ||
                          installment.paymentStatus === "Paid" ? (
                            <span className="text-success fw-bold">Paid</span>
                          ) : (
                            formatCurrency(installment.remainingAmount)
                          )}
                        </td>
                        <td className="text-end">
                          {getStatusBadge(
                            installment.paymentStatus,
                            installment.remainingAmount
                          )}
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handlePayClick(installment)}
                            disabled={isInstallmentPaid(installment)}
                          >
                            {installment.paymentStatus === "Pending"
                              ? "Add Payment"
                              : "Pay"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted">
                        No installments available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Form Modal */}
          {showPaymentForm && (
            <div className="modal-backdrop">
              <div className="payment-form-card">
                <div className="modal-header">
                  <h5>
                    Payment Details for Installment #
                    {selectedInstallment.installmentNumber}
                  </h5>
                  <button onClick={() => setShowPaymentForm(false)}>×</button>
                </div>
                <div className="modal-body">
                <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={paymentDetails.paidDate}
                      onChange={(e) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          paidDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Amount (Max:{" "}
                      {formatCurrency(selectedInstallment.remainingAmount)})
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      value={paymentDetails.paidAmount}
                      onChange={(e) => {
                        const maxAmount = selectedInstallment.remainingAmount;
                        const enteredAmount = parseFloat(e.target.value) || 0;
                        const finalAmount =
                          enteredAmount > maxAmount ? maxAmount : enteredAmount;
                        setPaymentDetails({
                          ...paymentDetails,
                          paidAmount: finalAmount.toString(),
                        });
                      }}
                      max={selectedInstallment.remainingAmount}
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Reference Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={paymentDetails.paymentRefNo}
                      onChange={(e) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          paymentRefNo: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  {/* File Upload */}
                  <div className="col-md-12 mb-3">
                    <label className="form-label">Upload Payment Slip</label>
                    <div className="input-group">
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Officer Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={paymentDetails.officerName}
                      onChange={(e) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          officerName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowPaymentForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handlePaymentSubmit}
                  >
                    Record Payment
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Payment History Section */}
          {showPaymentHistory && (
            <div className="col-12 mt-4 shadow">
              <h5 className="fw-bold text-primary mb-3">Payment History</h5>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th className="text-primary">Index</th>
                      <th className="text-primary">Installment</th>
                      <th className="text-end text-primary">Paid Date</th>
                      <th className="text-end text-primary">Paid Amount</th>
                      <th className="text-end text-primary">Reference</th>
                      <th className="text-end text-primary">Officer</th>
                      <th className="text-end text-primary">Acc Approval</th>
                      <th className="text-end text-primary">Acc Head Approval</th>
                      <th className="text-end text-primary">Status</th>
                      {/* <th className="text-end text-primary">Actions</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {paymentHistory.length > 0 ? (
                      paymentHistory.map((payment) => (
                        <tr key={payment._id}>
                          <td>{payment.PaymentHistoryNumber}</td>
                          <td>Installment {payment.installmentNumber}</td>
                          <td className="text-end">
                            {formatDate(payment.PaymentHistoryPaidDate)}
                          </td>
                          <td className="text-end">
                            {formatCurrency(payment.PaymentHistoryPaidAmount)}
                          </td>
                          <td className="text-end">
                            {payment.PayHisSlipReference || "N/A"}
                          </td>
                          <td className="text-end">
                            {payment.PayHisOfficerName || "N/A"}
                          </td>
                          <td className="text-end">
                                    <span
                                      className={`badge ${
                                      payment.payHisAccApproval === "Yes"
                                        ? "bg-success"
                                        : payment.payHisAccApproval === "No"
                                        ? "bg-danger"
                                        : "bg-warning"
                                      }`}
                                    >
                                      {payment.payHisAccApproval}
                                    </span>
                                    </td>

                                    <td className="text-end">
                                    <span
                                      className={`badge ${
                                      payment.payHisAccHeadApproval === "Yes"
                                        ? "bg-success"
                                        : payment.payHisAccHeadApproval === "No"
                                        ? "bg-danger"
                                        : "bg-warning"
                                      }`}
                                    >
                                      {payment.payHisAccHeadApproval}
                                    </span>
                                    </td>

                          <td className="text-end">
                            <span
                              className={`badge ${
                                payment.PayHisPaymentStatus === "Paid"
                                  ? "bg-success"
                                  : payment.PayHisPaymentStatus === "Pending"
                                  ? "bg-warning"
                                  : "bg-info"
                              }`}
                            >
                              {payment.PayHisPaymentStatus}
                            </span>
                          </td>
                          {/* <td className="text-end">
                            <div className="btn-group">
                              <button 
                                className="btn btn-sm btn-outline-success"
                                onClick={() => updatePaymentStatus(payment._id, "Paid")}
                                disabled={payment.PayHisPaymentStatus === "Paid"}
                              >
                                Approve
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-info"
                                onClick={() => updatePaymentStatus(payment._id, "Checking")}
                              >
                                Verify
                              </button>
                            </div>
                          </td> */}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center text-muted">
                          No payment history available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="col-12 d-flex justify-content-end mt-4">
            <button
              onClick={() => setShowPaymentHistory(!showPaymentHistory)}
              className="btn btn-outline-primary me-2"
            >
              {showPaymentHistory ? "Hide History" : "Show History"}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline-secondary"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentInstallment;
