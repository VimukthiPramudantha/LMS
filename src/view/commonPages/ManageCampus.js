import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ManageCampus = () => {
  const [campuses, setCampuses] = useState([]);

  const [editingCampusId, setEditingCampusId] = useState(null);
  const [editedCampus, setEditedCampus] = useState({
    campusName: "",
    manageFiled: "",
  });
  const [error, setError] = useState("");

  // Fetch campuses from the server
  const fetchCampuses = async () => {
    try {
      const response = await axios.get(
        "https://primelms-server.netlify.app/api/campus/getAllCampuses"
      );
      setCampuses(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching campuses:", error);
      setError("Error fetching campuses");
    }
  };

  useEffect(() => {
    fetchCampuses();
  }, []);

  // Handle edit click
  const handleEditClick = (campus) => {
    setEditingCampusId(campus._id);
    setEditedCampus({
      campusName: campus.campusName,
      manageFiled: campus.manageFiled || "",
    });
  };

  // Handle save click
  const handleSaveClick = async () => {
    try {
      await axios.put(
        `https://primelms-server.netlify.app/api/campus/updateCampus/${editingCampusId}`,
        editedCampus
      );
      setCampuses(
        campuses.map((campus) =>
          campus._id === editingCampusId
            ? { ...campus, ...editedCampus }
            : campus
        )
      );
      setEditingCampusId(null); // Exit editing mode
    } catch (error) {
      console.error("Error updating campus:", error);
      setError("Error updating campus");
    }
  };

  // Handle cancel click
  const handleCancelClick = () => {
    setEditingCampusId(null);
  };

  return (
    <div className="col-12 bg-light">
      <div className="row">
        <h2 className="fw-bold mt-5">Manage Campuses</h2>
        <div className="col-12 col-lg-4 offset-0 offset-lg-10 d-flex gap-2 mt-4">
          {/* <input
            className="form-control"
            list="datalistOptions"
            id="exampleDataList"
            placeholder="Type to search..."
          /> */}
          <datalist id="datalistOptions">
            <option value="San Francisco" />
            <option value="New York" />
            <option value="Seattle" />
            <option value="Los Angeles" />
            <option value="Chicago" />
          </datalist>
          <Link to="add-campus" className="btn btn-primary">
            Create New Campus
          </Link>
        </div>

        {error && <p className="text-danger mt-3">{error}</p>}

        <div className="col-12 overflow-x-auto">
          <div className="m-1 table-responsive">
            <div className="p-2">
              <p className="fw-bold fs-5 text-black-50">All Campuses</p>
            </div>
            <table className="table">
              <thead>
                <tr>
                  {/* <th scope="col">Campus ID</th> */}
                  <th scope="col">Campus Name</th>
                  <th scope="col">Major Study Field</th>
                  <th scope="col">Created by Director</th>
                  <th scope="col">Created Date</th>
                  <th scope="col">Updated Date</th>
                  {/* <th scope="col">Action</th> */}
                </tr>
              </thead>
              <tbody>
    {Array.isArray(campuses) && campuses.length > 0 ? (
        campuses.map((campus) => (
            <tr key={campus._id}>
                {/* <td>{campus._id}</td> */}
                <td>
                    {editingCampusId === campus._id ? (
                        <input
                            type="text"
                            value={editedCampus.campusName || ''}
                            onChange={(e) =>
                                setEditedCampus({
                                    ...editedCampus,
                                    campusName: e.target.value,
                                })
                            }
                        />
                    ) : (
                        campus.campusName
                    )}
                </td>
                <td>
                    {editingCampusId === campus._id ? (
                        <input
                            type="text"
                            value={editedCampus.manageFiled || ''}
                            onChange={(e) =>
                                setEditedCampus({
                                    ...editedCampus,
                                    manageFiled: e.target.value,
                                })
                            }
                        />
                    ) : (
                        campus.manageFiled
                    )}
                </td>
                <td>
                    {campus.createdByDirector ? campus.createdByDirector : 'N/A'}
                </td>
                <td>{new Date(campus.createdAt).toLocaleDateString()}</td>
                <td>{new Date(campus.updatedAt).toLocaleDateString()}</td>
                {/* <td>
                    {editingCampusId === campus._id ? (
                        <>
                            <button className="btn btn-success" onClick={handleSaveClick}>
                                Save
                            </button>
                            <button className="btn btn-secondary" onClick={handleCancelClick}>
                                Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            className="btn btn-primary"
                            onClick={() => handleEditClick(campus)}
                        >
                            Edit
                        </button>
                    )}
                </td> */}
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="6">No campuses found or error fetching data</td>
        </tr>
    )}
</tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCampus;
