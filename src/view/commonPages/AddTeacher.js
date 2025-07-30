import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const AddTeacher = () => {
  const [teacherData, setTeacherData] = useState({
    teacherId: '',
    password: '',
    name: '',
    referenceNo: '',
    contactNo: '',
    email: ''
  });

   const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacherData({
      ...teacherData,
      [name]: value
    });
  };

  const handleSave = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/teacher/create', teacherData);
      console.log('Teacher saved successfully:', response.data);
      alert('Teacher saved successfully!');
    } catch (error) {
      console.error('Error saving teacher:', error);
      alert('Failed to save teacher. Please try again.');
    }
  };

  return (
    <>
      <div className="form-bg-image">
        <div className="col-12 d-flex justify-content-center mt-4">
          <div className="row col-lg-6 shadow-lg m-3 rounded-3 h-auto mt-4 p-3 formColour border border-3 border-end-0 border-start-0 border-primary">
            <h4 className="fw-bold text-black-50 mt-3 mb-4">Add New Teacher</h4>
            {/* Form Group */}
            <div className="col-12 col-xl-6">
              <div className="input-group mb-3">
                <span className="input-group-text fw-bold" id="basic-addon3">
                  Teacher ID&nbsp;:
                </span>
                <input
                  type="text"
                  className="form-control"
                  id="basic-url"
                  name="teacherId"
                  value={teacherData.teacherId}
                  onChange={handleChange}
                  aria-describedby="basic-addon3"
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
                  id="basic-url"
                  name="password"
                  value={teacherData.password}
                  onChange={handleChange}
                  aria-describedby="basic-addon3"
                />
              </div>
            </div>
            <div className="input-group mb-3">
              <label className="input-group-text fw-bold" htmlFor="inputGroupSelect01">
                Teacher Name&nbsp;&nbsp;:
              </label>
              <input
                type="text"
                className="form-control"
                id="basic-url"
                name="name"
                placeholder="Enter Teacher Name"
                value={teacherData.name}
                onChange={handleChange}
                aria-describedby="basic-addon3"
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text fw-bold" id="basic-addon3">
                Reference No&nbsp;&nbsp;:
              </span>
              <input
                type="text"
                className="form-control"
                id="basic-url"
                name="referenceNo"
                placeholder="Enter Reference No"
                value={teacherData.referenceNo}
                onChange={handleChange}
                aria-describedby="basic-addon3"
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text fw-bold" id="basic-addon3">
                Contact No&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
              </span>
              <input
                type="text"
                className="form-control"
                id="basic-url"
                name="contactNo"
                placeholder="Enter Mobile No"
                value={teacherData.contactNo}
                onChange={handleChange}
                aria-describedby="basic-addon3"
              />
            </div>
            <div className="input-group mb-3">
              <span className="input-group-text fw-bold" id="basic-addon3">
                Email Address&nbsp;:
              </span>
              <input
                type="email"
                className="form-control"
                id="basic-url"
                name="email"
                placeholder="Enter Email Address"
                value={teacherData.email}
                onChange={handleChange}
                aria-describedby="basic-addon3"
              />
            </div>

            <div className="col-12 text-end">
              <div className="col-12 text-end">
                <button type="button" className="btn btn-primary m-2" style={{ backgroundColor: "rgb(13, 13, 175)" }} onClick={handleSave}>
                  Save
                </button>
                <button
              type="button"
              className="btn btn-dark py-0 m-2"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
              </div>
            </div>
            {/* Form Group */}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTeacher;