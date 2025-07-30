import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { Link } from 'react-router-dom';

const SeeAllSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [courses, setCourses] = useState([]);
  // const [selectedCourseId, setSelectedCourseId] = useState('');
  const [editedSubject, setEditedSubject] = useState({
    subjectId: '',
    subjectName: '',
    classDay: '',
    sessionStartTime: '',
    sessionEndTime: '',
  });

  const fetchSubjects = async () => {
    try {
      const response = await axios.get('https://lmsacademicservervb.netlify.app/api/subject/getAllSubjectsNoLimit');
      if (Array.isArray(response.data)) {
        setSubjects(response.data);
      } else if (response.data?.subjects) {
        setSubjects(response.data.subjects);
      } else {
        throw new Error('Unexpected response format');
      }
      
    } catch (err) {
      console.error('Error fetching subjects:', err.message);
      setError('Error fetching subjects');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('https://lmsacademicservervb.netlify.app/api/course/getAllCourses');
      if (Array.isArray(response.data)) {
        setCourses(response.data);
      } else if (response.data?.courses) {
        setCourses(response.data.courses);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      console.error('Error fetching courses:', err.message);
      setError('Error fetching courses');
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchCourses();
  }, []);

  const handleEditClick = (subject) => {
    setEditingSubjectId(subject._id);
    setEditedSubject({
      subjectId: subject.subjectId,
      subjectName: subject.subjectName,
      classDay: subject.classDay,
      sessionStartTime: subject.sessionStartTime,
      sessionEndTime: subject.sessionEndTime,
    });
  };

  const handleSaveClick = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `https://lmsacademicservervb.netlify.app/api/subject/updateSubject/${editingSubjectId}`,
        editedSubject,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log('Updated Subject Response:', response.data);
  
      // Update the state with the updated subject data
      const updatedSubject = response.data;
      setSubjects((prevSubjects) =>
        prevSubjects.map((subject) =>
          subject._id === editingSubjectId ? updatedSubject : subject
        )
      );
  
      setEditingSubjectId(null);
  
      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error('Error updating subject:', error.message);
      setError('Error updating subject');
    }
  };
  
  

  const handleCancelClick = () => {
    setEditingSubjectId(null);
    setEditedSubject({
      subjectId: '',
      subjectName: '',
      classDay: '',
      sessionStartTime: '',
      sessionEndTime: '',
    });
  };



  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hourNum = parseInt(hours, 10);
    const isPM = hourNum >= 12;
    const adjustedHour = hourNum % 12 || 12;
    const period = isPM ? 'PM' : 'AM';
    return `${adjustedHour}:${minutes} ${period}`;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="col-12 bg-light">
      <div className="row">
        <h2 className="fw-bold mt-5">Manage Subjects</h2>


        <div className="mt-5 rounded-3 col-12">
          <div className="row gap-5 d-flex justify-content-center">
            <div className="col-12 overflow-x-auto">
              <div className="p-2">
                <p className="fw-bold fs-5 text-black-50">All Subjects</p>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Subject ID</th>
                    <th>Subject Name</th>
                    <th>Class Day</th>
                    <th>Session Start Time</th>
                    <th>Session End Time</th>
                    <th>Created Date</th>
                    <th>Updated Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.length > 0 ? (
                    subjects.map((subject) => (
                      <tr key={subject._id}>
                        <td>{subject.subjectId}</td>
                        <td>
                          {editingSubjectId === subject._id ? (
                            <input
                              type="text"
                              value={editedSubject.subjectName}
                              onChange={(e) =>
                                setEditedSubject({ ...editedSubject, subjectName: e.target.value })
                              }
                            />
                          ) : (
                            subject.subjectName
                          )}
                        </td>
                        <td>
                          {editingSubjectId === subject._id ? (
                            <select
                              className="form-select"
                              value={editedSubject.classDay}
                              onChange={(e) =>
                                setEditedSubject({ ...editedSubject, classDay: e.target.value })
                              }
                            >
                              <option value="">Select Day</option>
                              <option value="Monday">Monday</option>
                              <option value="Tuesday">Tuesday</option>
                              <option value="Wednesday">Wednesday</option>
                              <option value="Thursday">Thursday</option>
                              <option value="Friday">Friday</option>
                              <option value="Saturday">Saturday</option>
                              <option value="Sunday">Sunday</option>
                            </select>
                          ) : (
                            subject.classDay
                          )}
                        </td>
                        <td>
                          {editingSubjectId === subject._id ? (
                            <input
                              type="time"
                              value={editedSubject.sessionStartTime}
                              onChange={(e) =>
                                setEditedSubject({ ...editedSubject, sessionStartTime: e.target.value })
                              }
                            />
                          ) : (
                            formatTime(subject.sessionStartTime)
                          )}
                        </td>
                        <td>
                          {editingSubjectId === subject._id ? (
                            <input
                              type="time"
                              value={editedSubject.sessionEndTime}
                              onChange={(e) =>
                                setEditedSubject({ ...editedSubject, sessionEndTime: e.target.value })
                              }
                            />
                          ) : (
                            formatTime(subject.sessionEndTime)
                          )}
                        </td>
                        <td>{new Date(subject.createdAt).toLocaleDateString()}</td>
                        <td>{new Date(subject.updatedAt).toLocaleDateString()}</td>
                        <td>
                          {editingSubjectId === subject._id ? (
                            <>
                              <button
                                type="button"
                                className="btn btn-dark py-0"
                                onClick={handleSaveClick}
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
                              onClick={() => handleEditClick(subject)}
                            >
                              Update
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8">No subjects found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};




export default SeeAllSubjects;
