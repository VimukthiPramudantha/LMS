import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddPayment = () => {
    const [paymentTitle, setPaymentTitle] = useState('');
    const [courseName, setCourseName] = useState('');
    const [campusName, setCampusName] = useState('');
    const [courseFee, setCourseFee] = useState('');
    const [installments, setInstallments] = useState([{ installmentNumber: 1, installmentAmount: '', dueDate: '', paymentStatus: '' }]);
    const [discount, setDiscount] = useState('');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [remainingPayable, setRemainingPayable] = useState(0); // Add this to track remaining amount
    const [courses, setCourses] = useState([]);
    const [campuses, setCampus] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [selectedCampus, setSelectedCampus] = useState("");

    // Fetch courses for the course name field
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get("https://lmsacademicserver.netlify.app/api/course/getAllCourses");
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
        fetchCourses();
    }, [token]);
    useEffect(() => {
        const fetchCampus = async () => {
            try {
                const response = await axios.get("https://lmsacademicserver.netlify.app/api/campus/getAllCampuses");
                console.log('Fetched campus:', response.data);

                if (Array.isArray(response.data)) {
                    setCampus(response.data);
                } else if (response.data && Array.isArray(response.data.campus)) {
                    setCampus(response.data.campus);
                } else {
                    console.error('Unexpected response format for campus:', response.data);
                    setCampus([]);
                }
            } catch (err) {
                console.error("Error fetching campus:", err);
                setError("Failed to load campus.");
                setCampus([]);
            }
        };

        fetchCampus();
    }, []);

    // Handle adding a new installment
    const handleAddInstallment = () => {
        setInstallments([...installments, { installmentNumber: installments.length + 1, installmentAmount: '', dueDate: '', paymentStatus: '' }]);
    };

    // Handle installment input change and recalculate remaining payable
    const handleInstallmentChange = (index, field, value) => {
        const newInstallments = [...installments];
        newInstallments[index][field] = value;
        setInstallments(newInstallments);
        calculateRemainingPayable(newInstallments);
    };

    // Handle removing an installment and recalculate remaining payable
    const handleRemoveInstallment = (index) => {
        const newInstallments = installments.filter((_, i) => i !== index);
        setInstallments(newInstallments);
        calculateRemainingPayable(newInstallments);
    };

    // Handle course selection change
    const handleCourseChange = (e) => {
        const selectedCourseId = e.target.value;
        const selectedCourse = courses.find(course => course._id === selectedCourseId);
        setCourseName(selectedCourseId);
        const courseFeeValue = selectedCourse?.totalCourseFee || 0;
        setCourseFee(courseFeeValue);
        calculatePaymentAmount(courseFeeValue, discount);
        calculateRemainingPayable(installments, courseFeeValue - discount);
    };
    const handleCampusChange = (e) => {
        const selectedCampusId = e.target.value; // Get the selected campus ID from the dropdown
        setCampusName(selectedCampusId); // Set the campusName to the selected campus ID
    };
    

    // Handle discount input change
    const handleDiscountChange = (e) => {
        const newDiscount = e.target.value;
        setDiscount(newDiscount);
        calculatePaymentAmount(courseFee, newDiscount);
        calculateRemainingPayable(installments, courseFee - newDiscount);
    };

    // Calculate payable amount based on fee and discount
    const calculatePaymentAmount = (fee, discount) => {
        const feeValue = parseFloat(fee) || 0;
        const discountValue = parseFloat(discount) || 0;
        const totalPayable = feeValue - discountValue;
        setPaymentAmount(totalPayable);
        setRemainingPayable(totalPayable);
    };

    // Calculate the remaining payable amount by subtracting installment totals
    const calculateRemainingPayable = (newInstallments, totalPayable = paymentAmount) => {
        const totalInstallments = newInstallments.reduce((sum, installment) => sum + (parseFloat(installment.installmentAmount) || 0), 0);
        const remaining = (totalPayable - totalInstallments).toFixed(2);
        setRemainingPayable(remaining);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!paymentTitle || !courseName || !courseFee || installments.length === 0 || !paymentAmount) {
            setError("All fields except discount are required");
            return;
        }

        try {
            const data = {
                paymentTitle,
                courseTitle: courseName,
                campusName, // This now contains the campus object ID
                totalCourseFee: parseFloat(courseFee) || 0,
                paymentPlan: installments,
                discount: parseFloat(discount) || 0,
                paymentAmount: parseFloat(paymentAmount) || 0,
            };
            

            console.log("Sending request with data:", data);

            const response = await axios.post("https://lmsacademicserver.netlify.app/api/payment/create", data, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 201) {
                alert("Payment Plan Added Successfully!");
                navigate(-1);
            } else {
                setError("Failed to add payment plan.");
            }
        } catch (err) {
            console.error("Error adding payment plan:", err.response?.data || err.message);
            setError("An error occurred while adding the payment plan.");
        }
    };

    return (
        <div className="form-bg-image">
            <div className="col-12 d-flex justify-content-center mt-4">
                <div
                    className="row col-lg-6 shadow-lg m-3 rounded-3 h-auto mt-4 p-3 formColour border border-3 border-end-0 border-start-0 border-primary">
                    <h4 className="fw-bold text-black-50 mt-3 mb-4">Create New Payment Plan</h4>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="input-group mb-3">
                        <span className="input-group-text fw-bold">Campus Select&nbsp;&nbsp;&nbsp;:</span>
                        <select
    className="form-select"
    value={campusName} // Use campusName as the selected value
    onChange={handleCampusChange} // Call the handleCampusChange function on change
    aria-label="Select Campus"
    required
>
    <option value="">Select a Campus</option>
    {campuses.map(c => (
        <option key={c._id} value={c._id}>
            {c.campusName}
        </option>
    ))}
</select>
                    </div>
                    <div className="col-12">
                        <div className="input-group mb-3">
                            <span className="input-group-text fw-bold">Course Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
                            <select
                                className="form-control ms-2"
                                value={courseName}
                                onChange={handleCourseChange}
                                required
                            >
                                <option value="">Select Course</option>
                                {Array.isArray(courses) && courses.length > 0 ? (
                                    courses.map(course => (
                                        <option key={course._id} value={course._id}>{course.courseTitle}</option>
                                    ))
                                ) : (
                                    <option value="" disabled>No courses available</option>
                                )}
                            </select>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="input-group mb-3">
                            <span className="input-group-text fw-bold">Payment Title&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
                            <input
                                type="text"
                                className="form-control"
                                value={paymentTitle}
                                onChange={(e) => setPaymentTitle(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                   
                    
                    <div className="input-group mb-3">
                        <span className="input-group-text fw-bold">Course Fee&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
                        <input
                            type="number"
                            className="form-control"
                            value={courseFee}
                            readOnly
                        />
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text fw-bold">Discount&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
                        <input
                            type="number"
                            className="form-control"
                            value={discount}
                            onChange={handleDiscountChange}
                        />
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text fw-bold">Payable Amount&nbsp;:</span>
                        <input
                            type="number"
                            className="form-control"
                            value={paymentAmount}
                            readOnly
                        />
                    </div>
                    <div className="input-group mb-3" style={{ display: "flex", flexDirection: "column", border: "2px solid #c000cc", borderRadius: "10px", padding: "10px" }}>
                        <span className="input-group-text fw-bold">Installments&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:</span>
                        {installments.map((installment, index) => (
                            <div key={index} className="d-flex mb-2">
                                <input
                                    type="number"
                                    className="form-control ms-2"
                                    placeholder="Amount"
                                    value={installment.installmentAmount}
                                    onChange={(e) => handleInstallmentChange(index, 'installmentAmount', e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    className="form-control ms-2"
                                    placeholder="Due Days"
                                    value={installment.dueDate}
                                    onChange={(e) => handleInstallmentChange(index, 'dueDate', e.target.value)}
                                    required
                                />
                                {/* <select
                                    className="form-control ms-2"
                                    value={installment.paymentStatus}
                                    onChange={(e) => handleInstallmentChange(index, 'paymentStatus', e.target.value)}
                                    required
                                >
                                    <option value="">Status</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Unpaid">Unpaid</option>
                                </select> */}
                                <button type="button" className="btn btn-danger ms-2"
                                        onClick={() => handleRemoveInstallment(index)}>Remove
                                </button>
                            </div>
                        ))}

                        <button
                            className="btn btn-secondary mb-3"
                            onClick={handleAddInstallment}
                        >
                            Add Installment
                        </button>

                    </div>

                    <div className="input-group mb-3">
                        <span className="input-group-text fw-bold">Remaining Payable&nbsp;:</span>
                        <input
                            type="text"
                            className="form-control"
                            value={remainingPayable}
                            readOnly
                        />
                    </div>
                    <div className="col-12 text-end">
                        <button
                            type="button"
                            className="btn btn-primary  m-2"
                            onClick={handleSubmit}
                            style={{backgroundColor:"rgb(13, 13, 175)"}}
                        >
                            Save New Payment Plan
                        </button>
                        <button
                    type="button"
                    className="btn btn-dark py-0 m-2"
                    onClick={() => navigate(-1)} // Navigate to the previous page
                >
                  Cancel
                </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPayment;