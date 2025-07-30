// src/view/commonPages/ZoomMeeting.js
import React, { useState } from "react";
import axios from 'axios';
import jwt from 'jsonwebtoken';

const ZoomMeeting = () => {

  const [meetingLink, setMeetingLink] = useState("");
  const [loading, setLoading] = useState(false);
  const API_KEY = 'api_key';
  const API_SECRET = 'api_secret';
  
  const handleStartMeeting = async () => {
    setLoading(true);
    setError("");
    const payload = {
      iss: API_KEY,
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token expiration (1 hour)
    };
    const token = jwt.sign(payload, API_SECRET);
  
    try {
      const response = await axios.post(
        'https://api.zoom.us/v2/users/me/meetings',
        {
          topic: 'LMS Online Class',
          type: 2,
          start_time: new Date().toISOString(),
          duration: 60,
          timezone: 'UTC',
          agenda: 'Online class for LMS',
          settings: { host_video: true, participant_video: true },
        },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      setMeetingLink(response.data.join_url || "");
    } catch (err) {
      setError(err.message || "Failed to create meeting.");
    } finally {
      setLoading(false);
    }
  };
    }
  };

  return (
    <div className="container mt-5">
      <h2>Start Zoom Meeting</h2>
      <button
        onClick={handleStartMeeting}
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? "Starting..." : "Start Meeting"}
      </button>
      {error && <p className="text-danger mt-3">Error: {error}</p>}
      {meetingLink && (
        <div className="mt-3">
          <p>Meeting Link:</p>
          <a href={meetingLink} target="_blank" rel="noopener noreferrer">
            {meetingLink}
          </a>
        </div>
      )}
    </div>
  );
};

export default ZoomMeeting;
