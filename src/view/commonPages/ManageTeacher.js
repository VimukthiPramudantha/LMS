import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageTeacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editedTeacher, setEditedTeacher] = useState({});

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get('https://lmsacademicserver.netlify.app/api/teacher/getAllTeachers');
        setTeachers(response.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  const handleEditClick = (teacher) => {
    setEditId(teacher._id);
    setEditedTeacher(teacher);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTeacher(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(
        `https://lmsacademicserver.netlify.app/api/teacher/updateTeacher/${editId}`,
        editedTeacher
      );
      setEditId(null);

      // Refetch the updated teachers
      const response = await axios.get('https://lmsacademicserver.netlify.app/api/teacher/getAllTeachers');
      setTeachers(response.data);
    } catch (error) {
      console.error("Error updating teacher:", error);
    }
  };

  return (
    <div className="col-12 bg-light">
      <div className="row">
        <h2 className="fw-bold mt-5">Manage Teachers</h2>
        <div className="col-12 col-lg-4 offset-0 offset-lg-8 d-flex gap-2 mt-4">
          <input
            className="form-control"
            list="datalistOptions"
            id="exampleDataList"
            placeholder="Type to search..."
          />
          <datalist id="datalistOptions">
            Populate datalist options as needed
          </datalist>
          <Link to="add-teacher" type="button" className="btn btn-primary">
            Create New Teacher
          </Link>
        </div>

        <div className="col-12 overflow-x-auto">
          <div className="m-1 table-responsive">
            <div className="p-2">
              <p className="fw-bold fs-5 text-black-50">All Teachers</p>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Teacher ID</th>
                  <th scope="col">Teacher Name</th>
                  <th scope="col">Reference No</th>
                  <th scope="col">Email Address</th>
                  <th scope="col">Contact No</th>
                  <th scope="col">Password</th>
                  <th scope="col">Created Date</th>
                  <th scope="col">Updated At</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map(teacher => (
                  <tr key={teacher._id}>

                    <td>{editId === teacher._id ? (
                      <input
                        type="text"
                        name="teacherId"
                        value={editedTeacher.teacherId || ''}
                        onChange={handleInputChange}
                        // disabled
                      />
                    ) : (
                      teacher.teacherId
                    )}</td>

                    <td>{editId === teacher._id ? (
                      <input
                        type="text"
                        name="name"
                        value={editedTeacher.name || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      teacher.name
                    )}</td>

                    <td>{editId === teacher._id ? (
                      <input
                        type="text"
                        name="referenceNo"
                        value={editedTeacher.referenceNo || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      teacher.referenceNo
                    )}</td>
                    <td>{editId === teacher._id ? (
                      <input
                        type="email"
                        name="email"
                        value={editedTeacher.email || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      teacher.email
                    )}</td>
                    <td>{editId === teacher._id ? (
                      <input
                        type="text"
                        name="contactNo"
                        value={editedTeacher.contactNo || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      teacher.contactNo
                    )}</td>
                    <td>{editId === teacher._id ? (
                      <input
                        type="text"
                        name="password"
                        value={editedTeacher.password || ''}
                        onChange={handleInputChange}
                      />
                    ) : (
                      teacher.password
                    )}</td>
                    <td>{teacher.createdAt}</td>
                    <td>{teacher.updatedAt}</td>
                    <td>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`flexSwitchCheckDefault${teacher._id}`}
                          checked={teacher.status}
                          readOnly
                        />
                      </div>
                    </td>
                    <td>
                      {editId === teacher._id ? (
                        <>
                          <button onClick={handleSaveClick} className="btn btn-success btn-sm">Save</button>
                          <button onClick={() => setEditId(null)} className="btn btn-secondary btn-sm">Cancel</button>
                        </>
                      ) : (
                        <button onClick={() => handleEditClick(teacher)} className="btn btn-dark btn-sm">Edit</button>
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

export default ManageTeacher;