import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Login.css";
import axios from "axios";
import { createBrowserHistory } from "history";
import { Link } from "react-router-dom";

function Login() {
  // State Variables
  const [name, setName] = useState(""); // State for name
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const [selectedRole, setSelectedRole] = useState("5"); // Default to "Log As Academic"
  const [placeholderId, setPlaceholderId] = useState("Coordinator Name");

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedRole(value);

    switch (value) {
      case "2":
        setPlaceholderId("Academic Manager Name");
        break;
      case "3":
        setPlaceholderId("Director Name");
        break;
      case "4":
        setPlaceholderId("Super Admin Name");
        break;
      case "5":
        setPlaceholderId("Coordinator Name");
        break;
      case "6":
        setPlaceholderId("Academic IT Executive Name");
        break;
      case "7":
        setPlaceholderId("Teacher Name");
        break;
        case "8":
          setPlaceholderId("Accountant Name");
          break;
        case "9":
          setPlaceholderId("Accounts Head Name");
          break;
      default:
        setPlaceholderId("Name");
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const history = createBrowserHistory();

    // Determine the API endpoint based on the selected role 
    //                             http://localhost:4000/api
    let endpoint;
    switch (selectedRole) {
      case "2": // Academic Manager
        endpoint = "https://lmsacademicserver.netlify.app/api/academicManager/signIn";
        break;
      case "4": // Super Admin
        endpoint = "https://lmsacademicserver.netlify.app/api/superAdmin/signInAdmin";
        break;
      case "5": // Coordinator
        endpoint = "https://lmsacademicserver.netlify.app/api/coordinator/login";
        break;
      case "6": // IT Executive
        endpoint = "https://lmsacademicservervb.netlify.app/api/itExicutive/login";
        break;
      case "7": // Teacher
        endpoint = "https://lmsacademicservervb.netlify.app/api/teacher/login";
        break;
      case "8": // Accountant
        endpoint = "https://lmsacademicserver.netlify.app/api/accountant/login";
        break;
      case "9": // Accountant head
        endpoint = "https://lmsacademicserver.netlify.app/api/accountanthead/login";
        break;
      default: // Academic Director and others
        endpoint = "https://lmsacademicservervb.netlify.app/api/academicDirector/signIn";
        break;
    }

    try {
      const response = await axios.post(endpoint, {
        name: name,
        password: password,
      });

      // Role-based checks
      if (selectedRole === "4" && response.data.result.role !== "Super Admin") {
        setIsError(true);
        setError("Unauthorized: Not a Super Admin");
        return;
      } else if (selectedRole === "5" && response.data.result.role !== "Coordinator") {
        setIsError(true);
        setError("Unauthorized: Not a Coordinator");
        return;
      } else if (selectedRole === "3" && response.data.result.role !== "Director") {
        setIsError(true);
        setError("Unauthorized: Not a Director");
        return;
      } else if (selectedRole === "6" && response.data.result.role !== "ITExecutive") {
        setIsError(true);
        setError("Unauthorized: Not a ITExecutive");
        return;
      } else if (selectedRole === "7" && response.data.result.role !== "Teacher") {
        setIsError(true);
        setError("Unauthorized: Not a Teacher");
        return;
      } else if (selectedRole === "2" && response.data.result.role !== "AcademicManager") {
        setIsError(true);
        setError("Unauthorized: Not a Academic Manager");
        return;
      }else if (selectedRole === "8" && response.data.result.role !== "Accountant") {
      setIsError(true);
      setError("Unauthorized: Not a Accountant");
      return;
      }else if (selectedRole === "9" && response.data.result.role !== "AccountantHead") {
      setIsError(true);
      setError("Unauthorized: Not a Accounts Head");
      return;
    }


      // Store the token and name
      localStorage.setItem("role", response.data.result.role);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("name", encodeURIComponent(name));
      localStorage.setItem("id", encodeURIComponent(response.data.result.id));
      localStorage.setItem("coordID", encodeURIComponent(response.data.result.coordID));
      // localStorage.setItem("AccountID", encodeURIComponent(response.data.result.AccountID));
      // localStorage.setItem("assignCampus", encodeURIComponent(response.data.result.assignCampus));

      
      if (selectedRole === "5" && response.data.result.assignCampus) {
        localStorage.setItem("_id", JSON.stringify(response.data.result._id));
        localStorage.setItem("assignCampus", JSON.stringify(response.data.result.assignCampus));
        localStorage.setItem("coordID", encodeURIComponent(response.data.result.coordID));
      }

      if (selectedRole === "8" && response.data.result.assignCampus) {
        localStorage.setItem("_id", JSON.stringify(response.data.result._id));
        localStorage.setItem("assignCampus", JSON.stringify(response.data.result.assignCampus));
        localStorage.setItem("AccountID", encodeURIComponent(response.data.result.AccountID));
      }
      if (selectedRole === "9" && response.data.result.assignCampus) {
        localStorage.setItem("_id", JSON.stringify(response.data.result._id));
        localStorage.setItem("assignCampus", JSON.stringify(response.data.result.assignCampus));
        localStorage.setItem("AccountID", encodeURIComponent(response.data.result.AccountID));
      }

      setIsError(false);
      alert("Login successful!");

      // Redirect to the appropriate page
      if (selectedRole === "6") {
        history.push("/itexecutive/dashboard");
      } else if (selectedRole === "7") {
        history.push("/teacher/dashboard");
      } else if (selectedRole === "8") {
        history.push("/accountant/dashboard");
      } else if (selectedRole === "9") {
        history.push("/accountshead/dashboard");
      } else if (selectedRole === "2") {
        history.push("/academicmanager/dashboard");
      } else if (selectedRole === "5") {
        history.push("/coordinator/manage-student");
      } else if (selectedRole === "3") {
        history.push("/academic/dashboard");
      }else {
        history.push("/academic/dashboard");
      }
      history.go(0);
    } catch (error) {
      setIsError(true);
      setError(error.response?.data?.message || "An error occurred during login User.");
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
            <div className="form">
              <h3 className="fw-semibold p-3 loginCardColor rounded-4 text-white d-md-none text-center">
                ACADEMIC DIVISION
              </h3>
              <h4 className="mt-3">Sign In</h4>
              <span className="mb-3">Use your user name & password</span>
              <select
                className="form-select form-select-sm mb-3 text-center fw-bold"
                aria-label=".form-select-sm example"
                value={selectedRole}
                onChange={handleChange}
              >
                <option value="4">Log As Super Admin</option>
                <option value="3">Log As Director</option>
                <option value="2">Log As Academic Manager</option>
                <option value="9">Log As Accounts Head</option>
                <option value="8">Log As Accountant</option>
                <option value="7">Log As Teacher</option>
                <option value="5">Log As Coordinating Executive</option>
                <option value="6">Log As Academic IT Executive</option>
              </select>
              <div>
                <input
                  type="text"
                  placeholder={placeholderId}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  className={`alert alert-danger p-2 mt-3 text-center smalltext ${
                    isError ? "d-block" : "d-none"
                  }`}
                  role="alert"
                >
                  {error}
                </div>
              </div>
              <button onClick={handleLogin}>Sign In</button>

              <br/>
              <div id="createRole" className="mt-2 balla">
                <span>Sign up for LMS</span>
              <Link to="/signup">
                <button id="btn-role-create">Sign Up</button>
              </Link>
              {/* <Link to="/accountant">
                <button id="btn-role-create">Accountant</button>
              </Link>
              <Link to="/coordinate">
                <button id="btn-role-create">Coordinator</button>
              </Link>
              <Link to="/itexecutive">
                <button id="btn-role-create">Academic IT Executive</button>
              </Link> */}
              </div>
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
                <h5 className="mb-4">LEARNING MANAGEMENT SYSTEM</h5>
                <p>
                  Register with your personal User Name and Password to access
                  classes and other features
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;