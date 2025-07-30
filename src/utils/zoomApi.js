import axios from 'axios';

const ZOOM_API_KEY = process.env.REACT_APP_ZOOM_API_KEY;
const ZOOM_API_SECRET = process.env.REACT_APP_ZOOM_API_SECRET;
const ZOOM_API_URL = 'https://api.zoom.us/v2';

const getZoomToken = () => {
  // Implement JWT token generation logic here
  // For simplicity, you can use a library like jsonwebtoken
  // Example:
  // const token = jwt.sign({ iss: ZOOM_API_KEY, exp: Date.now() + 5000 }, ZOOM_API_SECRET);
  // return token;
};

export const createMeeting = async (topic, startTime) => {
  const token = getZoomToken();
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  const body = {
    topic,
    type: 2, // Scheduled meeting
    start_time: startTime,
    duration: 60, // 1 hour
    timezone: 'UTC',
  };

  try {
    const response = await axios.post(`${ZOOM_API_URL}/users/me/meetings`, body, config);
    return response.data;
  } catch (error) {
    console.error('Error creating Zoom meeting:', error);
    throw error;
  }
};