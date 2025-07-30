import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ManageDirectorCoordinate = () => {
    const [coordinators, setCoordinators] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editedCoordinator, setEditedCoordinator] = useState({});
    const [campuses, setCampuses] = useState([]);
    const [loadingCampuses, setLoadingCampuses] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch coordinators
                const coordinatorsResponse = await axios.get('https://lmsacademicserver.netlify.app/api/coordinator/getAllCoordinators');
                setCoordinators(coordinatorsResponse.data);
                
                // Fetch campuses
                const campusesResponse = await axios.get('https://lmsacademicserver.netlify.app/api/campus/getAllCampuses');
                setCampuses(campusesResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoadingCampuses(false);
            }
        };

        fetchData();
    }, []);

    const handleEditClick = (coordinator) => {
        setEditId(coordinator._id);
        setEditedCoordinator({
            ...coordinator,
            assignCampus: coordinator.assignCampus?.map(c => c._id) || []
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedCoordinator(prev => ({ ...prev, [name]: value }));
    };

    const handleCampusChange = (campusId) => {
        setEditedCoordinator(prev => {
            const currentCampuses = prev.assignCampus || [];
            const newCampuses = currentCampuses.includes(campusId)
                ? currentCampuses.filter(id => id !== campusId)
                : [...currentCampuses, campusId];
            return { ...prev, assignCampus: newCampuses };
        });
    };

    const handleSaveClick = async () => {
        try {
            await axios.put(
                `https://lmsacademicserver.netlify.app/api/coordinator/updateCoordinator/${editId}`,
                editedCoordinator
            );
            setEditId(null);
            
            // Refresh data
            const response = await axios.get('https://lmsacademicserver.netlify.app/api/coordinator/getAllCoordinators');
            setCoordinators(response.data);
        } catch (error) {
            console.error("Error updating coordinator:", error);
        }
    };

    return (
        <div className="col-12 bg-light">
            <div className="row">
                <h2 className="fw-bold mt-5">Manage Coordinators</h2>
                <div className="col-12 col-lg-4 offset-0 offset-lg-8 d-flex gap-2 mt-4">
                    {/* Search and create buttons can be added here if needed */}
                </div>
                <div className="col-12 col-lg-4 offset-0 offset-lg-8 d-flex gap-2 mt-4">
              <input
                  className="form-control"
                  list="datalistOptions"
                  id="exampleDataList"
                  placeholder="Type to search..."
              />
              <Link to="add-coordinator" type="button" className="btn btn-primary">
                Create New Coordinator
              </Link>
            </div>

                <div className="col-12 overflow-x-auto">
                    <div className="m-1 table-responsive">
                        <div className="p-2">
                            <p className="fw-bold fs-5 text-black-50">All Coordinators</p>
                        </div>

                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Assigned Campuses</th>
                                    <th>Director Approval</th>
                                    <th>CoordID</th>
                                    <th>Password</th>
                                    <th>Created At</th>
                                    <th>Updated At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coordinators.map(coordinator => (
                                    <tr key={coordinator._id}>
                                        <td>
                                            {editId === coordinator._id ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={editedCoordinator.name || ''}
                                                    onChange={handleInputChange}
                                                    className="form-control form-control-sm"
                                                />
                                            ) : (
                                                coordinator.name
                                            )}
                                        </td>
                                        <td>
                                            {editId === coordinator._id ? (
                                                loadingCampuses ? (
                                                    <div>Loading campuses...</div>
                                                ) : (
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {campuses.map(campus => (
                                                            <div key={campus._id} className="form-check">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`campus-${campus._id}`}
                                                                    checked={editedCoordinator.assignCampus?.includes(campus._id)}
                                                                    onChange={() => handleCampusChange(campus._id)}
                                                                    className="form-check-input"
                                                                />
                                                                <label htmlFor={`campus-${campus._id}`} className="form-check-label">
                                                                    {campus.campusName}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )
                                            ) : (
                                                coordinator.assignCampus?.map(c => c.campusName).join(', ') || 'None'
                                            )}
                                        </td>
                                        <td>
                                            {editId === coordinator._id ? (
                                                <select
                                                    name="coordinatorIsDirector"
                                                    value={String(editedCoordinator.coordinatorIsDirector)}
                                                    onChange={handleInputChange}
                                                    className="form-select form-select-sm"
                                                >
                                                    <option value="true">True</option>
                                                    <option value="false">False</option>
                                                </select>
                                            ) : (
                                                coordinator.coordinatorIsDirector ? 'Yes' : 'No'
                                            )}
                                        </td>
                                        <td>
                                            {editId === coordinator._id ? (
                                                <input
                                                    type="text"
                                                    name="coordID"
                                                    value={editedCoordinator.coordID || ''}
                                                    onChange={handleInputChange}
                                                    className="form-control form-control-sm"
                                                />
                                            ) : (
                                                coordinator.coordID
                                            )}
                                        </td>
                                        <td>
                                            {editId === coordinator._id ? (
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={editedCoordinator.password || ''}
                                                    onChange={handleInputChange}
                                                    className="form-control form-control-sm"
                                                />
                                            ) : (
                                                '•••••••'
                                            )}
                                        </td>
                                        <td>{new Date(coordinator.createdAt).toLocaleString()}</td>
                                        <td>{new Date(coordinator.updatedAt).toLocaleString()}</td>
                                        <td>
                                            {editId === coordinator._id ? (
                                                <>
                                                    <button onClick={handleSaveClick} className="btn btn-success btn-sm me-1">Save</button>
                                                    <button onClick={() => setEditId(null)} className="btn btn-secondary btn-sm">Cancel</button>
                                                </>
                                            ) : (
                                                <button onClick={() => handleEditClick(coordinator)} className="btn btn-dark btn-sm">Edit</button>
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

export default ManageDirectorCoordinate;