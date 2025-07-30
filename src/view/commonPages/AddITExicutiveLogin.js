import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/Login.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const AddITExecutiveLogin = () => {
  const [name, setName] = useState("");
  // const [ITExecutiveID, setITExecutiveID] = useState("");
          const [ITExecutiveID, setITExecutiveID] = useState('ITEX-' + Math.floor(Math.random() * 10000)); // Auto-generate a random ID
  
  const [password, setPassword] = useState("");
  const [ITExecutiveIsDirector, setITExecutiveIsDirector] = useState(false); // New state for the field
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://primelms-server.netlify.app/api/itExicutive/signIn",
        {
          name,
          ITExecutiveID,
          password,
          ITExecutiveIsDirector, // Include this field in the request
        }
      );

      if (response.status === 201) {
        alert("IT Executive created successfully");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error creating IT Executive:", error);

      if (error.response && error.response.data.message) {
        alert(`Failed to create IT Executive: ${error.response.data.message}`);
      } else {
        alert("Failed to create IT Executive. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="maindiv">
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
            <li></li>
          </ul>
        </div>

        <div className="container m-5" id="container">
          <div className="form-container half-width-md sign-in">
  
                                      <div className="m-2">
                                        <Link to="/login">
                                          <button className="btn btn-secondary" style={{width:"100px"}}>Back</button>
                                        </Link>
                                      </div>
            <div className="form">

              <h3 className="fw-semibold p-3 loginCardColor rounded-4 text-white d-md-none text-center">
                ACADEMIC DIVISION
              </h3>
              <h4 className="mt-3">Sign Up</h4>
              <span className="mb-3">
                Add your username, IT Executive ID, and set a password
              </span>

              <form onSubmit={handleSubmit}>
                <input
                  placeholder="User Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                                                                        <input
                                    type="hidden"
                                    value={setITExecutiveID}
                                    readOnly
                                />
                {/* <input
                  type="text"
                  placeholder="IT Executive ID"
                  value={ITExecutiveID}
                  onChange={(e) => setITExecutiveID(e.target.value)}
                  required
                /> */}
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-primary mt-3">
                  Create IT Executive
                </button>
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
                <h2>ACADEMIC DIVISION </h2>
                <h5 className="mb-4">IT Executive Sign Up</h5>
                <p>
                  Register with your personal username, IT Executive ID, and set
                  a password to access classes and other features
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddITExecutiveLogin;
