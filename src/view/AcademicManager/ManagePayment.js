import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ManagePayment = () => {
    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingPaymentId, setEditingPaymentId] = useState(null);
    const [courses, setCourses] = useState([]);
    const [campuses, setCampuses] = useState([]);
    const [editedPayment, setEditedPayment] = useState({
        paymentTitle: "",
        courseTitle: "",
        campusName: "",
        totalCourseFee: "",
        paymentPlan: [],
        disCount: "",
        paymentAmount: "",
    });
    const [searchQuery, setSearchQuery] = useState("");

    const fetchPayments = async () => {
        try {
            const response = await axios.get('https://primelms-server.netlify.app/api/payment/getAllPaymentPlans');
            const data = Array.isArray(response.data) ? response.data : [];
            setPayments(data);
            setFilteredPayments(data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching payments');
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("https://primelms-server.netlify.app/api/course/getAllCourses", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const fetchedCourses = response.data.courses;
            if (Array.isArray(fetchedCourses)) {
                setCourses(fetchedCourses);
            } else {
                console.error("Courses data is not an array:", response.data);
                setError("Failed to load courses.");
            }
        } catch (err) {
            console.error("Error fetching courses:", err);
            setError("Failed to load courses.");
        }
    };

    const fetchCampuses = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("https://primelms-server.netlify.app/api/campus/getAllCampuses", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const fetchedCampuses = response.data.campus || response.data;
            if (Array.isArray(fetchedCampuses)) {
                setCampuses(fetchedCampuses);
            } else {
                console.error("Campuses data is not an array:", response.data);
                setError("Failed to load campuses.");
            }
        } catch (err) {
            console.error("Error fetching campuses:", err);
            setError("Failed to load campuses.");
        }
    };

    useEffect(() => {
        fetchPayments();
        fetchCourses();
        fetchCampuses();
    }, []);

    useEffect(() => {
        const filtered = (Array.isArray(payments) ? payments : []).filter(payment =>
            (payment.paymentTitle?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (payment.courseTitle?.courseTitle?.toLowerCase() || '').includes(searchQuery.toLowerCase())
        );
        setFilteredPayments(filtered);
    }, [searchQuery, payments]);

    const handleEditClick = (payment) => {
        setEditingPaymentId(payment._id);
        setEditedPayment({
            paymentTitle: payment.paymentTitle,
            courseTitle: payment.courseTitle?._id || "",
            campusName: payment.campusName?._id || "",
            totalCourseFee: payment.totalCourseFee,
            paymentPlan: payment.paymentPlan || [],
            disCount: payment.disCount,
            paymentAmount: payment.paymentAmount,
        });
    };

    const handleSaveClick = async () => {
        if (!editedPayment.paymentTitle || !editedPayment.courseTitle || !editedPayment.totalCourseFee) {
            setError("All fields are required");
            return;
        }

        if (isNaN(editedPayment.totalCourseFee)) {
            setError("Total Course Fee must be a number");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const payload = {
                paymentTitle: editedPayment.paymentTitle,
                courseTitle: editedPayment.courseTitle,
                campusName: editedPayment.campusName,
                totalCourseFee: editedPayment.totalCourseFee,
                paymentPlan: editedPayment.paymentPlan.map((plan) => ({
                    installmentNumber: plan.installmentNumber,
                    installmentAmount: plan.installmentAmount, // Ensure installmentAmount is included
                    dueDate: plan.dueDate,
                    _id: plan._id,
                })),
                discount: editedPayment.disCount,
                paymentAmount: editedPayment.paymentAmount,
            };

            console.log("Payload:", payload);

            const response = await axios.put(
                `https://primelms-server.netlify.app/api/payment/update/${editingPaymentId}`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Update Response:", response.data);

            if (response.status === 200) {
                setPayments((prevPayments) =>
                    prevPayments.map((payment) =>
                        payment._id === editingPaymentId ? response.data.result : payment
                    )
                );
                setFilteredPayments((prevPayments) =>
                    prevPayments.map((payment) =>
                        payment._id === editingPaymentId ? response.data.result : payment
                    )
                );
                setEditingPaymentId(null);
                setError("");
            } else {
                setError("Failed to update payment, please try again.");
            }
        } catch (error) {
            console.error("Update Error:", error.response?.data || error.message);
            setError(error.response?.data?.message || "Error updating payment");
        }
    };

    const handleCancelClick = () => {
        setEditingPaymentId(null);
        setEditedPayment({
            paymentTitle: "",
            courseTitle: "",
            campusName: "",
            totalCourseFee: "",
            paymentPlan: [],
            disCount: "",
            paymentAmount: "",
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedPayment((prevState) => ({
            ...prevState,
            [name]: value,
            paymentAmount: name === "disCount" || name === "totalCourseFee"
                ? calculatePaymentAmount(
                      name === "totalCourseFee" ? value : prevState.totalCourseFee,
                      name === "disCount" ? value : prevState.disCount
                  )
                : prevState.paymentAmount,
        }));
    };

    const calculatePaymentAmount = (totalCourseFee, disCount) => {
        const fee = parseFloat(totalCourseFee) || 0;
        const discount = parseFloat(disCount) || 0;
        return (fee - discount).toFixed(2);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="col-12 bg-light">
            <div className="row">
                <h2 className="fw-bold mt-5">Manage Payments</h2>
                <div className="m-2 shadow-sm p-4" style={{ border: "3px solid #059888", borderRadius: "10px" }}>
                    <div className="col-12 col-lg-4 offset-0 offset-lg-8 d-flex gap-2 mt-4">
                        <input
                            className="form-control"
                            list="datalistOptions"
                            id="exampleDataList"
                            placeholder="Search Payments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <datalist id="datalistOptions">
                            {/* Add relevant options if needed */}
                        </datalist>
                        <Link to="add-payment" type="button" className="btn btn-primary">
                            Create New Payment
                        </Link>
                    </div>
                </div>

                <div className="col-12 m-2 overflow-x-auto" style={{ border: "3px solid #059888", borderRadius: "10px" }}>
                    <div className="m-1 table-responsive">
                        <div className="p-2">
                            <p className="fw-bold fs-5 text-black-50">All Payments</p>
                        </div>

                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Payment Title</th>
                                    <th scope="col">Course Title</th>
                                    <th scope="col">Campus Name</th>
                                    <th scope="col">Total Course Fee</th>
                                    <th scope="col">Payment Plan</th>
                                    <th scope="col">Discount</th>
                                    <th scope="col">Payment Amount</th>
                                    <th scope="col">Created Date</th>
                                    <th scope="col">Updated Date</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.length > 0 ? (
                                    filteredPayments.map((payment) => (
                                        <tr key={payment._id}>
                                            <td>
                                                {editingPaymentId === payment._id ? (
                                                    <input
                                                        type="text"
                                                        name="paymentTitle"
                                                        value={editedPayment.paymentTitle}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                    />
                                                ) : (
                                                    payment.paymentTitle
                                                )}
                                            </td>
                                            <td>
                                                {editingPaymentId === payment._id ? (
                                                    <select
                                                        className="form-select"
                                                        name="courseTitle"
                                                        value={editedPayment.courseTitle || ""}
                                                        onChange={(e) => {
                                                            const selectedCourse = courses.find(course => course._id === e.target.value);
                                                            setEditedPayment((prevState) => ({
                                                                ...prevState,
                                                                courseTitle: selectedCourse?._id || "",
                                                                totalCourseFee: selectedCourse?.totalCourseFee || "",
                                                                paymentAmount: calculatePaymentAmount(selectedCourse?.totalCourseFee || "", prevState.disCount),
                                                            }));
                                                        }}
                                                    >
                                                        <option value="" disabled>Select Course</option>
                                                        {courses.map((course) => (
                                                            <option key={course._id} value={course._id}>
                                                                {course.courseTitle}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    payment.courseTitle?.courseTitle || "N/A"
                                                )}
                                            </td>
                                            <td>
    {editingPaymentId === payment._id ? (
        <select
            className="form-select"
            name="campusName"
            value={editedPayment.campusName || ""}
            onChange={(e) => {
                setEditedPayment((prevState) => ({
                    ...prevState,
                    campusName: e.target.value,
                }));
            }}
        >
            <option value="" disabled>Select Campus</option>
            {campuses.map((campus) => (
                <option key={campus._id} value={campus._id}>
                    {campus.campusName}
                </option>
            ))}
        </select>
    ) : (
        // Find the campus name by matching the campus ID
        campuses.find(campus => campus._id === payment.campusName)?.campusName || "N/A"
    )}
</td>
                                            <td>
                                                {editingPaymentId === payment._id ? (
                                                    <input
                                                        type="number"
                                                        name="totalCourseFee"
                                                        value={editedPayment.totalCourseFee}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                    />
                                                ) : (
                                                    payment.totalCourseFee
                                                )}
                                            </td>
                                            <td>
                                                {Array.isArray(payment.paymentPlan) && payment.paymentPlan.length > 0 ? (
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {payment.paymentPlan.map((plan, index) => (
                                                            <div key={index} className="card" style={{ width: '18rem' }}>
                                                                <div className="card-body">
                                                                    <h5 className="card-title">Installment {plan.installmentNumber}</h5>
                                                                    <p className="card-text">
                                                                        <strong>Amount:</strong> {plan.installmentAmount}
                                                                    </p>
                                                                    <p className="card-text">
                                                                        <strong>Due Date:</strong> {plan.dueDate}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    "No plans available"
                                                )}
                                            </td>
                                            <td>
                                                {editingPaymentId === payment._id ? (
                                                    <input
                                                        type="number"
                                                        name="disCount"
                                                        value={editedPayment.disCount}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                    />
                                                ) : (
                                                    payment.disCount
                                                )}
                                            </td>
                                            <td>
                                                {editingPaymentId === payment._id ? (
                                                    <input
                                                        type="text"
                                                        name="paymentAmount"
                                                        value={editedPayment.paymentAmount}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                        readOnly
                                                    />
                                                ) : (
                                                    payment.paymentAmount
                                                )}
                                            </td>
                                            <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                                            <td>{new Date(payment.updatedAt).toLocaleDateString()}</td>
                                            <td>
                                                {editingPaymentId === payment._id ? (
                                                    <>
                                                        <button type="button" className="btn btn-dark py-0" onClick={handleSaveClick}>
                                                            Save
                                                        </button>
                                                        <button type="button" className="btn btn-light py-0 ml-2" onClick={handleCancelClick}>
                                                            Cancel
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button type="button" className="btn btn-dark py-0" onClick={() => handleEditClick(payment)}>
                                                        Update
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10">No payments found</td>
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

export default ManagePayment;