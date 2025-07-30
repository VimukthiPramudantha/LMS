import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ManageAdmin = () => {
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingDirectorId, setEditingDirectorId] = useState(null);
  const [editedDirector, setEditedDirector] = useState({
    directorId: "",
    name: "",
    password: "",
  });

  // Function to fetch directors
  const fetchDirectors = async () => {
    try {
      const response = await axios.get('https://sweet-beignet-c74b96.netlify.app/api/superAdmin/allDirectors');
      setDirectors(response.data.directors);
      setLoading(false);
    } catch (err) {
      setError('Error fetching directors');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDirectors();
  }, []);


  const handleEditClick = (director) => {
    setEditingDirectorId(director.directorId || ''); // Fallback if directorId is undefined
    setEditedDirector({
      directorId: director.directorId || '', // Fallback if directorId is undefined
      name: director.name || '',
      password: director.password || '',
    });
  };


  const handleSaveClick = async (directorId) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage

    try {
      const response = await fetch(`https://sweet-beignet-c74b96.netlify.app/api/academicDirector/updateDirector/${directorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Use token for authorization
        },
        body: JSON.stringify(editedDirector),
      });

      if (response.ok) {
        const updatedDirector = await response.json();

        // Update the state with the new director information
        setDirectors((prevDirectors) =>
            prevDirectors.map((director) =>
                director.directorId === directorId
                    ? updatedDirector.updatedDirector
                    : director
            )
        );

        // Clear the editing state
        setEditingDirectorId(null);

        fetchDirectors();
      } else {
        console.error('Failed to update director');
      }
    } catch (error) {
      console.error('Error updating director:', error);
    }
  };


  const handleCancelClick = () => {
    setEditingDirectorId(null);
    setEditedDirector({
      directorId: '',
      name: '',
      password: '',
    });
  };




  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
      <>
        <div className="col-12 bg-light">
          <div className="row">
            <h2 className="fw-bold mt-5">Manage Directors</h2>
            <div className="col-12 col-lg-4 offset-0 offset-lg-8 d-flex gap-2 mt-4">
              <input
                  className="form-control"
                  list="datalistOptions"
                  id="exampleDataList"
                  placeholder="Type to search..."
              />
              <Link to="add-admin" type="button" className="btn btn-primary">
                Create New Director
              </Link>
            </div>

            <div className="col-12 overflow-x-auto">
              <div className="m-1 table-responsive">
                <div className="p-2">
                  <p className="fw-bold fs-5 text-black-50">All Admins</p>
                </div>

                <table className="table">
                  <thead>
                  <tr>
                    <th scope="col">Director ID</th>
                    <th scope="col">Director Name</th>
                    <th scope="col">Password</th>
                    <th scope="col">Created Date</th>
                    <th scope="col">Updated Date</th>
                    <th scope="col">Action</th>
                  </tr>
                  </thead>
                  <tbody>
                  {directors && directors.length > 0 ? (
                      directors.map((director, index) => {
                        if (!director) return null; // Skip this iteration if director is undefined

                        return (
                            <tr key={director._id || index}>
                              <td>{director.directorId || 'N/A'}</td>
                              <td>
                                {editingDirectorId === director.directorId ? (
                                    <input
                                        type="text"
                                        value={editedDirector.name}
                                        onChange={(e) =>
                                            setEditedDirector({...editedDirector, name: e.target.value})
                                        }
                                    />
                                ) : (
                                    director.name
                                )}
                              </td>
                              <td>
                                {editingDirectorId === director.directorId ? (
                                    <input
                                        type="text"
                                        value={editedDirector.password}
                                        onChange={(e) =>
                                            setEditedDirector({
                                              ...editedDirector,
                                              password: e.target.value,
                                            })
                                        }
                                    />
                                ) : (
                                    director.password
                                )}
                              </td>
                              <td>{new Date(director.createdAt).toLocaleDateString()}</td>
                              <td>{new Date(director.updatedAt).toLocaleDateString()}</td>
                              <td>
                                {editingDirectorId === director.directorId ? (
                                    <>
                                      <button
                                          type="button"
                                          className="btn btn-dark py-0"
                                          onClick={() => handleSaveClick(director.directorId)}
                                      >
                                        Save
                                      </button>
                                      <button
                                          type="button"
                                          className="btn btn-light py-0 ml-2"
                                          onClick={handleCancelClick}
                                      >
                                        Cancel
                                      </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn btn-dark py-0"
                                        onClick={() => handleEditClick(director)}
                                    >
                                      Update
                                    </button>
                                )}
                              </td>
                            </tr>
                        );
                      })
                  ) : (
                      <tr>
                        <td colSpan="6">No directors found</td>
                      </tr>
                  )}
                  </tbody>


                  {/*<tbody>
                  {directors.map((director) => (
                      <tr key={director._id}>
                        <td>{director.directorId}</td>
                        <td>{director.name}</td>
                        <td>{director.password}</td>  Displaying password here is not recommended for security reasons
                        <td>{new Date(director.createdAt).toLocaleDateString()}</td>
                        <td>{new Date(director.updatedAt).toLocaleDateString()}</td>
                        <td>
                          <button
                              type="button"
                              className="btn btn-dark py-0 py-0">
                            Update
                          </button>
                        </td>
                      </tr>
                  ))}
                  </tbody>*/}
                </table>
              </div>
            </div>
          </div>
        </div>
      </>
  );
};

export default ManageAdmin;
