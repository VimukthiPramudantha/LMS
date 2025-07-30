import React, {useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddAdmin = () => {
  const [directorId, setDirectorId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchNextDirectorId = async () => {
      try {
        const response = await axios.get('https://sweet-beignet-c74b96.netlify.app/api/superAdmin/getLastId');
        setDirectorId(response.data.directorId);
      } catch (error) {
        console.error("Error fetching next Director ID:", error);
        setError("Failed to fetch next Director ID.");
      }
    };

    fetchNextDirectorId();
  }, []);


  const handleAddDirector = async () => {
    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage

      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      const response = await axios.post(
          "https://sweet-beignet-c74b96.netlify.app/api/superAdmin/addDirector",
          {
            directorId,
            name,
            password,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
            },
          }
      );

      if (response.status === 201) {
        alert("Director added successfully");
        navigate("/academic/manage-admin"); // Redirect to a success page or clear the form
      }
    } catch (error) {
      setError("Failed to add Director. Please check the details.");
      console.error("Error adding Director:", error);
    }
  };

  return (
      <>
        <div className="form-bg-image">
          <div className="col-12 d-flex justify-content-center mt-4">
            <div className="row col-lg-6 shadow-lg m-3 rounded-3 h-auto mt-4 p-3 formColour border border-3 border-end-0 border-start-0 border-primary">
              <h4 className="fw-bold text-black-50 mt-3 mb-4">Create New Director</h4>
              <div className="col-12 col-xl-6">
                <div className="input-group mb-3">
                <span className="input-group-text fw-bold" id="basic-addon3">
                  Director ID&nbsp;:
                </span>
                  {/*<input
                      type="text"
                      className="form-control"
                      value={directorId}
                      onChange={(e) => setDirectorId(e.target.value)}
                      aria-describedby="basic-addon3"
                      readOnly={true}
                  />*/}
                  <input
                      type="text"
                      className="form-control"
                      value={directorId}
                      aria-describedby="basic-addon3"
                      readOnly // Ensure this field is read-only
                  />

                </div>
              </div>
              <div className="col-12 col-xl-6">
                <div className="input-group mb-3">
                <span className="input-group-text fw-bold" id="basic-addon3">
                  Password&nbsp;&nbsp;:
                </span>
                  <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-describedby="basic-addon3"
                  />
                </div>
              </div>
              <div className="input-group mb-3">
                <label
                    className="input-group-text fw-bold"
                    htmlFor="inputGroupSelect01"
                >
                  Add Director Name&nbsp;&nbsp;:
                </label>
                <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Director Name"
                    aria-describedby="basic-addon3"
                />
              </div>

              {error && (
                  <div className="alert alert-danger text-center">{error}</div>
              )}

              <div className="col-12 text-end">
                <button
                    type="button"
                    className="btn btn-primary m-2"
                    onClick={handleAddDirector}
                    style={{backgroundColor:"rgb(13, 13, 175)"}}
                >
                  Save
                </button>
                <button type="button" className="btn btn-dark py-0 m-2"
                        onClick={() => navigate("/academic/manage-admin")}>

                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
  );
};

export default AddAdmin;
