import React, { useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/Login.css";
import axios from 'axios';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

function StudentLogin() {
    const [studentID, setStudentID] = useState('');
    // const [StudentNIC, setStudentNIC] = useState('');
    const [whatsAppMobileNo1, setStudentWP] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear any previous error messages
    
        try {
            const response = await axios.post(
                'https://primelms-server.netlify.app/api/coordinatorAddStudent/LoginStudent',

                
                { studentID,whatsAppMobileNo1 }
            );
    
            console.log(response.data); // Log the response
    
            if (response.data.token) {
                // Store token and student details in localStorage
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('studentWP', response.data.whatsAppMobileNo1);
                localStorage.setItem('studentID', response.data.studentID);
                localStorage.setItem('studentPortalAccess', response.data.studentPortalAccess);
                localStorage.setItem('studentName', response.data.studentName);
                localStorage.setItem('studentObjectId', response.data.studentObjectId); // Store the MongoDB ObjectId
    
                alert('Login successful!');
    
                // Redirect to profile page
                history.push('/profile');
                history.go(0);
            }
        } catch (error) {
            // Display error message to the user
            const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
            setErrorMessage(message);
        } finally {
            // Clear input fields after login attempt
            setStudentID('');
            setStudentWP('');
        }
    };

    return (
        <div className="maindiv">
            {/* Animated Area */}
            <div className="area">
                <ul className="circles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>

            <div className="container m-5" id="container">
                <div className="form-container half-width-md sign-in">
                    <div className="form">
                        <h3 className="fw-semibold p-3 loginCardColor rounded-4 text-white d-md-none text-center">
                            Student Login Interface
                        </h3>
                        <h4 className="mt-3">Sign In</h4>
                        <span className="mb-3">Add your username and set a password</span>

                        <form onSubmit={handleLogin}>
                            <label>User Name</label>
                            <br/>
                            <span>(Eg: ABC-1234)</span>
                            <input
                                placeholder="Student ID"
                                type="text"
                                value={studentID}
                                onChange={(e) => setStudentID(e.target.value)}
                                required
                            />

                            {/* <label>Student NIC</label>
                            <input
                                type="text"
                                placeholder="Student NIC"
                                value={StudentNIC}
                                onChange={(e) => setStudentNIC(e.target.value)}
                                required
                            /> */}
                            <label>Password</label>
                        <br/>
                            <span>(Eg: 94734567890)</span>
                            <input
                                type="text"
                                placeholder="Student's WhatsApp Number"
                                value={whatsAppMobileNo1}
                                onChange={(e) => setStudentWP(e.target.value)}
                                required
                            />


                            {errorMessage && <p className="text-danger">{errorMessage}</p>}

                            <div className="button-center">
                                <button className="btn btn-primary" type="submit">Login Student</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="toggle-container d-none d-md-block">
                    <div className="toggle">
                        <div className="toggle-panel toggle-left">
                            <h1>Welcome Back!</h1>
                            <p>Enter your personal details to use all of the site's features</p>
                        </div>
                        <div className="toggle-panel toggle-right">
                            <h2>Learning Management System(LMS)</h2>
                            <h5 className="mb-4">Student Sign In</h5>
                            <p>
                                Register with your personal username and password to access
                                classes and other features
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentLogin;
