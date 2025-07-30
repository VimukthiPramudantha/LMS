import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManagePayment = () => {
    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [courses, setCourses] = useState([]);
    const [campuses, setCampuses] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchPayments = async () => {
        try {
            const response = await axios.get('https://lmsacademicserver.netlify.app/api/payment/getAllPaymentPlans');
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
            const response = await axios.get("https://lmsacademicserver.netlify.app/api/course/getAllCourses", {
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
            const response = await axios.get("https://lmsacademicserver.netlify.app/api/campus/getAllCampuses", {
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

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="col-12 bg-light">
            <div className="row">
                <h2 className="fw-bold mt-5">Payment Plans</h2>
                <div className="m-2 shadow-sm p-4" style={{ border: "3px solid #059888", borderRadius: "10px" }}>
                    <div className="col-12 col-lg-4 offset-0 offset-lg-8 d-flex gap-2 mt-4">
                        <input
                            className="form-control"
                            list="datalistOptions"
                            id="exampleDataList"
                            placeholder="Search Plans"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <datalist id="datalistOptions">
                            {/* Add relevant options if needed */}
                        </datalist>
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
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.length > 0 ? (
                                    filteredPayments.map((payment) => (
                                        <tr key={payment._id}>
                                            <td>{payment.paymentTitle}</td>
                                            <td>{payment.courseTitle?.courseTitle || "N/A"}</td>
                                            <td>{campuses.find(campus => campus._id === payment.campusName)?.campusName || "N/A"}</td>
                                            <td>{payment.totalCourseFee}</td>
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
                                            <td>{payment.disCount}</td>
                                            <td>{payment.paymentAmount}</td>
                                            <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                                            <td>{new Date(payment.updatedAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9">No payments found</td>
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