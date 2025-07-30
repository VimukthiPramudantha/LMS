import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddWorksSpace = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState("");
    const [jobLocation, setJobLocation] = useState("");
    const [jobPosition, setJobPosition] = useState("");
    const [jobStartDate, setJobStartDate] = useState("");
    const [loading, setLoading] = useState(false); // Manage loading state

    const handleSubmit = async () => {
        setLoading(true); // Set loading to true when submission starts

        const data = {
            companyName,
            jobLocation,
            jobPosition,
            jobStartDate,
        };

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                "https://primelms-server.netlify.app/api/studentWork/create",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                }
            );

            if (response.ok) {
                navigate("/profile"); // Navigate on success
            } else {
                const errorData = await response.json();
                console.error("Error:", errorData);
                alert("Failed to add workplace details");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while adding workplace details");
        } finally {
            setLoading(false); // Reset loading state when done
        }
    };

    return (
        <>
            <div className="form-bg-image">
                <div className="col-12 d-flex justify-content-center mt-4">
                    <div className="row col-lg-6 shadow-lg m-3 rounded-3 h-auto mt-4 p-3 formColour border border-3 border-end-0 border-start-0 border-primary">
                        <h4 className="fw-bold text-black-50 mt-3 mb-4">Add Your Job Details</h4>

                        {/* Form Group */}
                        <div className="col-12">
                            <div className="input-group mb-3">
                                <span className="input-group-text fw-bold">Company Name&nbsp;&nbsp;:</span>
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
                            <span className="input-group-text fw-bold">job Position&nbsp;&nbsp;:</span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Job Position"
                                value={jobPosition}
                                onChange={(e) => setJobPosition(e.target.value)}
                            />
                        </div>

                        <div className="input-group mb-3">
                            <label className="input-group-text fw-bold">Job Location&nbsp;&nbsp;:</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Job Location"
                                value={jobLocation}
                                onChange={(e) => setJobLocation(e.target.value)}
                            />
                        </div>
                        <div className="input-group mb-3">
                            <span className="input-group-text fw-bold">Job Start Date&nbsp;&nbsp;:</span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Job Start Date"
                                value={jobStartDate}
                                onChange={(e) => setJobStartDate(e.target.value)}
                            />
                        </div>

                        <div className="col-12 text-end">
                            <button
                                type="button"
                                className="btn btn-primary m-2"
                                onClick={handleSubmit}
                                disabled={loading} // Disable button when loading
                            >
                                {loading ? "Saving..." : "Add"} {/* Show loading text */}
                            </button>
                            <button
                                type="button"
                                className="btn btn-dark py-0 m-2"
                                onClick={() => navigate("/profile")}
                                disabled={loading} // Optionally disable cancel during submission
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddWorksSpace;
