import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageDirectorCoordinate = () => {
  const [allCoordinators, setAllCoordinators] = useState([]); // Original data
  const [filteredCoordinators, setFilteredCoordinators] = useState([]); // Filtered data
  const [searchTerm, setSearchTerm] = useState(""); // Search term

  // Fetch all coordinators
  useEffect(() => {
    const fetchCoordinators = async () => {
      try {
        const response = await axios.get(
          "https://lmsacademicserver.netlify.app/api/coordinator/getAllCoordinators"
        );
        setAllCoordinators(response.data); // Set original data
        setFilteredCoordinators(response.data); // Initialize filtered data
      } catch (error) {
        console.error("Error fetching coordinators:", error);
      }
    };

    fetchCoordinators();
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      // If search term is empty, reset to original data
      setFilteredCoordinators(allCoordinators);
    } else {
      // Filter coordinators based on campus name
      const filtered = allCoordinators.filter((coordinator) =>
        coordinator.assignCampus.some((campus) =>
          campus.campusName.toLowerCase().includes(term)
        )
      );
      setFilteredCoordinators(filtered);
    }
  };

  return (
    <>
      <div className="container-fluid">
        <br />
        <hr />
        <br />
        <h2 className="fw-bold">All Active Coordinators</h2>
        <br />
        <div className="row mb-2 shadow-sm p-4" style={{ border: "3px solid #059", borderRadius: "10px" }}>
          <div className="col-md-6 offset-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by Campus Name"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        <br />
        <hr />
      </div>

      <div className="row m-1 shadow-sm   "style={{ border: "3px solid #059", borderRadius: "10px" }}>
        <h4 className="fw-bold mt-2">All Coordinators</h4>
        {filteredCoordinators.length > 0 ? (
          filteredCoordinators.map((coordinator) => (
            <div key={coordinator._id} className="col-md-4 mb-4">
              <div className="card shadow-sm p-3  mt-2" style={{ border: "1px solid #c5c", borderRadius: "10px" }}>
                <div className="card-body">
                  {/* Name Field (Bold) */}
                  <h5 className="card-title fw-bold">{coordinator.name}</h5>

                  {/* Assign Campus Field */}
                  <p className="card-text">
                    <strong>Assign Campus:</strong>{" "}
                    {coordinator.assignCampus
                      .map((campus) => campus.campusName)
                      .join(", ")}
                  </p>

                  {/* Approval Field */}
                  <p className="card-text">
                    <strong>Approval:</strong>{" "}
                    {coordinator.coordinatorIsDirector ? "Approved" : "Pending"}
                  </p>

                  {/* CoordID Field */}
                  <p className="card-text">
                    <strong>CoordID:</strong> {coordinator.coordID}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No Coordinators Found</p>
        )}
      </div>
    </>
  );
};

export default ManageDirectorCoordinate;