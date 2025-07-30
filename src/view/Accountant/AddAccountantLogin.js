import React, { useState } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/Login.css";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

function AddAccountantLogin() {
    const [name, setName] = useState('');
    // const [AccountID, setAccountantID] = useState('');
        const [AccountID, setAccountantID] = useState('Acc-' + Math.floor(Math.random() * 10000)); // Auto-generate a random ID
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true);
            const response = await axios.post('https://primelms-server.netlify.app/api/accountant', {
                name,
                AccountID,
                password
            });

            if (response.status === 201) {
                alert("Accountant created successfully");
                navigate(-1);
            }
        } catch (error) {
            console.error("Error creating accountant:", error);
            alert("Failed to create accountant. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="maindiv">
            <div className="area">
                <ul className="circles">
                    {[...Array(10)].map((_, i) => <li key={i}></li>)}
                </ul>
            </div>

            <div className="container" id="container" style={{ overflowY: "auto", maxHeight: "100vh" }}>
               <div className="form-container half-width-md sign-in">
                          <div className="m-2">
                            <Link to="/login">
                              <button className="btn btn-secondary" style={{width:"100px"}}>Back</button>
                            </Link>
                          </div>
                    <div className="form loginCardColor rounded-4 p-4">
                        
                        <h3 className="fw-semibold p-3 loginCardColor rounded-4 text-white d-md-none text-center">
                            ACADEMIC DIVISION
                        </h3>
                        <div className="text-center">
                            <h4 className="mt-3">Accountant Sign Up</h4>
                            <span className="mb-3">Add your username and set a password</span>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <input
                                placeholder="Accountant Name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                                                            <input
                                    type="hidden"
                                    value={setAccountantID}
                                    readOnly
                                />
                            {/* <input
                                type="text"
                                placeholder="Accountant ID"
                                value={AccountID}
                                onChange={(e) => setAccountantID(e.target.value)}
                                required
                            /> */}

                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <div className="d-flex justify-content-center">
                                <button 
                                    type="submit" 
                                    className="btn btn-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Creating...
                                        </>
                                    ) : "Create Accountant"}
                                </button>
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
                            <h2>ACADEMIC DIVISION</h2>
                            <h5 className="mb-4">Accountant Sign Up</h5>
                            <p>
                                Register with your personal username and set a password to access
                                the accounting features
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddAccountantLogin;