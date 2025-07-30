import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ZoomMeeting = () => {
    const [meeting, setMeeting] = useState({
        topic: "",
        duration: "1440",
        password: "",
        agenda: "Lms Academic Meeting",
    });

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [meetingResponse, setMeetingResponse] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMeeting({ ...meeting, [name]: value });
    };

    const handleDateChange = (e) => setDate(e.target.value);
    const handleTimeChange = (e) => setTime(e.target.value);

    const isFormValid =
        Object.values(meeting).every((value) => value.trim() !== "") &&
        date.trim() !== "" &&
        time.trim() !== "";

    const createMeeting = async () => {
        if (!date || !time) {
            alert("Please select both date and time.");
            return;
        }

        const start_time = `${date}T${time}:00`;

        try {
            const response = await axios.post("https://primelms-server.netlify.app/api/zoom/create", {
                ...meeting,
                start_time,
            });
            setMeetingResponse(response.data.meetingDetails);
        } catch (error) {
            console.error("Error creating meeting:", error);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <div className="card shadow-lg p-4 rounded-4" style={{ width: "28rem" }}>
                <h2 className="text-center mb-4 text-primary fw-bold">📅 Schedule a Zoom Meeting</h2>

                <div className="mb-3">
                    <label className="form-label fw-semibold">Meeting Topic *</label>
                    <input
                        type="text"
                        name="topic"
                        className="form-control"
                        placeholder="Enter topic"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Date *</label>
                        <input
                            type="date"
                            className="form-control"
                            onChange={handleDateChange}
                            required
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">Time *</label>
                        <input
                            type="time"
                            className="form-control"
                            onChange={handleTimeChange}
                            required
                        />
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-semibold">Duration (mins) *</label>
                    <input
                        type="number"
                        name="duration"
                        className="form-control"
                        placeholder="Enter duration"
                        onChange={handleChange}
                        min="1"
                        max="1440"
                        value={meeting.duration || 1440}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-semibold">Password *</label>
                    <input
                        type="text"
                        name="password"
                        className="form-control"
                        placeholder="Enter password"
                        onChange={handleChange}
                        required
                    />
                </div>

                <button
                    onClick={createMeeting}
                    disabled={!isFormValid}
                    className={`btn btn-primary w-100 py-2 ${isFormValid ? "btn-hover" : "disabled"}`}
                >
                    🚀 Create Meeting
                </button>

                {meetingResponse && (
                    <div className="alert alert-info mt-4 text-center">
                        <h5 className="fw-bold">🎉 Meeting Created!</h5>
                        <p className="mb-2">Meeting ID: <strong>{meetingResponse.id}</strong></p>
                        <p className="mb-2">Meeting Password: <strong>{meetingResponse.password}</strong></p>
                        <a
                            href={meetingResponse.join_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-success btn-sm"
                        >
                            🔗 Join Meeting
                        </a>
                    <button
                        onClick={() => navigator.clipboard.writeText(meetingResponse.join_url)}
                        className="btn btn-secondary btn-sm mt-2"
                    >
                        📋 Copy Link
                    </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ZoomMeeting;
