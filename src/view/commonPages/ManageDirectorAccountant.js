import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ManageDirectorAccountant = () => {
    const [accountants, setAccountants] = useState([]);
    const [editId, setEditId] = useState(null);
    const [editedAccountant, setEditedAccountant] = useState({});
    const [campuses, setCampuses] = useState([]);

    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        
        const fetchData = async () => {
            try {
                // Fetch accountants
                const accountantsResponse = await axios.get('https://lmsacademicserver.netlify.app/api/accountant/');
                setAccountants(accountantsResponse.data);
                
                // Fetch campuses
                const campusesResponse = await axios.get('https://lmsacademicserver.netlify.app/api/campus/getAllCampuses');
                setCampuses(campusesResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false); // Stop loading after data is fetched
              }
        };

        fetchData();
    }, []);

    const handleEditClick = (accountant) => {
        setEditId(accountant._id);
        setEditedAccountant({
            ...accountant,
            assignCampus: accountant.assignCampus?.map(c => c._id) || []
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedAccountant(prev => ({ ...prev, [name]: value }));
    };

    const handleCampusChange = (campusId) => {
        setEditedAccountant(prev => {
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
                `https://lmsacademicserver.netlify.app/api/accountant/${editId}`,
                editedAccountant
            );
            setEditId(null);
            
            // Refresh data
            const response = await axios.get('https://lmsacademicserver.netlify.app/api/accountant/');
            setAccountants(response.data);
        } catch (error) {
            console.error("Error updating accountant:", error);
        }
    };

    
  // Loading animation
  const LoadingAnimation = () => (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingAnimation />;
  }

    return (
        <div className="col-12 bg-light">
            <div className="row">
                <h2 className="fw-bold mt-5">Manage Accountants</h2>
                <div className="col-12 col-lg-4 offset-0 offset-lg-8 d-flex gap-2 mt-4">

                </div>
            <div className="col-12 col-lg-4 offset-0 offset-lg-8 d-flex gap-2 mt-4">
              <input
                  className="form-control"
                  list="datalistOptions"
                  id="exampleDataList"
                  placeholder="Type to search..."
              />
              <Link to="add-accountant" type="button" className="btn btn-primary">
                Create New Accountant
              </Link>
            </div>
                <div className="col-12 overflow-x-auto">
                    <div className="m-1 table-responsive">
                        <div className="p-2">
                            <p className="fw-bold fs-5 text-black-50">All Accountants</p>
                        </div>

                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Assigned Campuses</th>
                                    <th>Director Approval</th>
                                    <th>AccountantID</th>
                                    <th>Password</th>
                                    <th>Created</th>
                                    <th>Updates</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {accountants.map(accountant => (
                                    <tr key={accountant._id}>
                                        <td>
                                            {accountant.name}
                                        </td>
                                        <td>
                                            {editId === accountant._id ? (
                                                loading ? (
                                                    <div>Loading campuses...</div>
                                                ) : (
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {campuses.map(campus => (
                                                            <div key={campus._id} className="form-check">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`campus-${campus._id}`}
                                                                    checked={editedAccountant.assignCampus?.includes(campus._id)}
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
                                                accountant.assignCampus?.map(c => c.campusName).join(', ') || 'None'
                                            )}
                                        </td>
                                        <td>
                                            {editId === accountant._id ? (
                                                <select
                                                    name="AccountantIsDirector"
                                                    value={String(editedAccountant.AccountantIsDirector)}
                                                    onChange={handleInputChange}
                                                    className="form-select form-select-sm"
                                                >
                                                    <option value="true">True</option>
                                                    <option value="false">False</option>
                                                </select>
                                            ) : (
                                                accountant.AccountantIsDirector ? 'Yes' : 'No'
                                            )}
                                        </td>
                                        <td>
                                            {editId === accountant._id ? (
                                                <input
                                                    type="text"
                                                    name="AccountID"
                                                    value={editedAccountant.AccountID || ''}
                                                    onChange={handleInputChange}
                                                    className="form-control form-control-sm"
                                                />
                                            ) : (
                                                accountant.AccountID
                                            )}
                                        </td>
                                        <td>
                                            {editId === accountant._id ? (
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={editedAccountant.password || ''}
                                                    onChange={handleInputChange}
                                                    className="form-control form-control-sm"
                                                />
                                            ) : (
                                                '•••••••'
                                            )}
                                        </td>
                                        <td>{new Date(accountant.createdAt).toLocaleString()}</td>
                                        <td>{new Date(accountant.updatedAt).toLocaleString()}</td>
                                        <td>
                                            {editId === accountant._id ? (
                                                <>
                                                    <button onClick={handleSaveClick} className="btn btn-success btn-sm me-1">Save</button>
                                                    <button onClick={() => setEditId(null)} className="btn btn-secondary btn-sm">Cancel</button>
                                                </>
                                            ) : (
                                                <button onClick={() => handleEditClick(accountant)} className="btn btn-dark btn-sm">Edit</button>
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

export default ManageDirectorAccountant;