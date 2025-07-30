import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageDirectorITExecutive = () => {
  const [itExecutives, setITExecutives] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedITExecutive, setEditedITExecutive] = useState({});

  useEffect(() => {
    const fetchITExecutives = async () => {
      try {
        const response = await axios.get(
          "https://lmsacademicserver.netlify.app/api/itExicutive/getall"
        );
        setITExecutives(response.data);
      } catch (error) {
        console.error("Error fetching IT Executives:", error);
      }
    };

    fetchITExecutives();
  }, []);

  const handleEditClick = (itExecutive) => {
    setEditId(itExecutive._id);
    setEditedITExecutive(itExecutive);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedITExecutive((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(
        `https://lmsacademicserver.netlify.app/api/itExicutive/updateITExecutive/${editId}`,
        editedITExecutive
      );
      setEditId(null);

      // Refetch the updated IT Executives
      const response = await axios.get(
        // "https://lmsacademicserver.netlify.app/api/itexecutive/getAllITExecutives"
         "https://lmsacademicserver.netlify.app/api/itExicutive/getall"
      );
      setITExecutives(response.data);
    } catch (error) {
      console.error("Error updating IT Executive:", error);
    }
  };

  return (
    <div className="col-12 bg-light">
      <div className="row">
        <h2 className="fw-bold mt-5">Manage Academic IT Executives</h2>

        <div className="col-12 overflow-x-auto">
          <div className="m-1 table-responsive">
            <div className="p-2">
              <p className="fw-bold fs-5 text-black-50">
                All Academic IT Executives
              </p>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Approval of the Director</th>
                  <th scope="col">IT Executive ID</th>
                  <th scope="col">Password</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {itExecutives.map((itExecutive) => (
                  <tr key={itExecutive._id}>
                    <td>
                      {editId === itExecutive._id ? (
                        <input
                          type="text"
                          name="name"
                          value={editedITExecutive.name || ""}
                          onChange={handleInputChange}
                        />
                      ) : (
                        itExecutive.name
                      )}
                    </td>

                    <td>
                      {editId === itExecutive._id ? (
                        <select
                          name="ITExecutiveIsDirector"
                          value={String(
                            editedITExecutive.ITExecutiveIsDirector
                          )} // Convert boolean to string for dropdown
                          onChange={(e) => {
                            const value = e.target.value === "true"; // Convert string back to boolean
                            setEditedITExecutive((prev) => ({
                              ...prev,
                              ITExecutiveIsDirector: value,
                            }));
                          }}
                        >
                          <option value="true">True</option>
                          <option value="false">False</option>
                        </select>
                      ) : (
                        itExecutive.ITExecutiveIsDirector.toString() // Display boolean as a string when not editing
                      )}
                    </td>

                    <td>{itExecutive.ITExecutiveID}</td>
                    <td>{itExecutive.password}</td>
                    <td>
                      {editId === itExecutive._id ? (
                        <>
                          <button
                            onClick={handleSaveClick}
                            className="btn btn-success btn-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            className="btn btn-secondary btn-sm"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEditClick(itExecutive)}
                          className="btn btn-dark btn-sm"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageDirectorITExecutive;
