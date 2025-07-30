import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddSCampus = () => {
    const [campusName, setCampusName] = useState("");
    const [mktdepartment, setMktdepartment] = useState("");
    const [mktdivision, setMktdivision] = useState("");
    const [projectNo, setProjectNo] = useState("");
    const [manageFiled, setManageFiled] = useState("");
    const [createdByDirector, setCreatedByDirector] = useState(""); // Added state for Director
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleAddCampus = async () => {
        if (!campusName || !manageFiled) {
            setError("Please fill in all the fields.");
            return;
        }

        const storedName = localStorage.getItem("name");
        const userName = storedName ? decodeURIComponent(storedName) : 'User';


        const newCampus = {
            campusName,
            manageFiled,
            mktdepartment,
            mktdivision,
            projectNo,
            createdByDirector: userName, // Set createdByDirector to current user's login name
        };

        try {
            const response = await axios.post(
                "https://primelms-server.netlify.app/api/campus/create",
                newCampus,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 201) {
                alert("Campus added successfully");
                setCampusName(""); // Clear form fields
                setManageFiled(""); // Clear form fields
                setCreatedByDirector(""); // Clear form fields
                navigate(-1);
            } else {
                setError("Failed to add Campus. Please check the details.");
            }
        } catch (error) {
            setError("Failed to add Campus. Please try again.");
            console.error("Error adding Campus:", error);
        }
    };

    return (
        <>
            <div className="form-bg-image">
                <div className="col-12 d-flex justify-content-center mt-4">
                    <div
                        className="row col-lg-6 shadow-lg m-3 rounded-3 h-auto mt-4 p-3 formColour border border-3 border-end-0 border-start-0 border-primary">
                        <h4 className="fw-bold text-black-50 mt-3 mb-4">Create New Campus</h4>
                        {error && <div className="alert alert-danger">{error}</div>}
                        
                        {/* Campus Name */}
                        <div className="col-12">
                            <div className="input-group mb-3">
                                <span className="input-group-text fw-bold" id="basic-addon3">
                                    Campus Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={campusName}
                                    onChange={(e) => setCampusName(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Major Study Field */}
                        <div className="col-12">
                            <div className="input-group mb-3">
                                <span className="input-group-text fw-bold" id="basic-addon3">
                                    Major Study Field&nbsp;&nbsp;:
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={manageFiled}
                                    onChange={(e) => setManageFiled(e.target.value)}
                                />
                            </div>
                        </div>
                        {/* <div className="col-12">
                            <div className="input-group mb-3">
                                <span className="input-group-text fw-bold" id="basic-addon3">
                                    MKT Department&nbsp;&nbsp;&nbsp;:
                                </span>
                                                                <select
                                    className="form-select"
                                    value={mktdepartment}
                                    onChange={(e) => setMktdepartment(e.target.value)}
                                    required
                                >
                                    <option value="">Select Department</option>
                                    <option value="MKT 1">MKT 1</option>
                                    <option value="MKT 2">MKT 2</option>
                                    <option value="MKT 3">MKT 3</option>
                                    <option value="MKT 4">MKT 4</option>
                                    <option value="MKT 5">MKT 5</option>
                                    <option value="MKT 6">MKT 6</option>
                                    <option value="MKT 7">MKT 7</option>
                                    <option value="MKT 8">MKT 8</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="input-group mb-3">
                                <span className="input-group-text fw-bold" id="basic-addon3">
                                    MKT Division&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; :
                                </span>
                                <select
                                    className="form-select"
                                    value={mktdivision}
                                    onChange={(e) => setMktdivision(e.target.value)}
                                    required
                                >
                                    <option value="">Select Division</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="input-group mb-3">
                                <span className="input-group-text fw-bold" id="basic-addon3">
                                    Project No &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={projectNo}
                                    onChange={(e) => setProjectNo(e.target.value)}
                                />
                            </div>
                        </div> */}
                        {/* Created By Director */}
                        {/* <div className="col-12">
                            <div className="input-group mb-3">
                                <span className="input-group-text fw-bold" id="basic-addon3">
                                    Created By Director&nbsp;&nbsp;:
                                </span>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={createdByDirector}
                                    onChange={(e) => setCreatedByDirector(e.target.value)}
                                />
                            </div>
                        </div> */}

                        {/* Add and Cancel Buttons */}
                        <div className="col-12 text-end">
                            <button
                                type="button"
                                className="btn btn-primary m-2"
                                onClick={handleAddCampus}
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
        </>
    );
};

export default AddSCampus;
