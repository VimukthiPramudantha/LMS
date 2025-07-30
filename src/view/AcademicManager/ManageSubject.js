import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ManageSubject = () => {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [editedSubject, setEditedSubject] = useState({
    subjectId: '',
    subjectName: '',
    lectureName: '',
    classDay: '',
    sessionStartTime: '',
    sessionEndTime: '',
  });

  // Fetch all subjects
  const fetchSubjects = async () => {
    try {
      const response = await axios.get('https://lmsacademicserver.netlify.app/api/subject/getAllSubjectsNoLimit');
      if (Array.isArray(response.data)) {
        setSubjects(response.data);
        setFilteredSubjects(response.data); // Initially, show all subjects
      } else if (response.data?.subjects) {
        setSubjects(response.data.subjects);
        setFilteredSubjects(response.data.subjects); // Initially, show all subjects
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

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const response = await axios.get('https://lmsacademicserver.netlify.app/api/course/getAllCourses');
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

  // Filter subjects based on the selected course
  const filterSubjectsByCourse = (courseId) => {
    if (!courseId) {
      setFilteredSubjects(subjects); // If no course is selected, show all subjects
      return;
    }

    const selectedCourse = courses.find((course) => course._id === courseId);
    console.log('Selected Course:', selectedCourse); // Debugging: Log selected course
    console.log('Selected Course Subjects:', selectedCourse?.subject); // Debugging: Log subject array

    if (selectedCourse && selectedCourse.subject) {
      // Extract the subject IDs from the `subject` array and convert them to strings
      const subjectIds = selectedCourse.subject
        .map((sub) => sub?.$oid?.toString()) // Safely access `$oid` and convert to string
        .filter((id) => id); // Filter out undefined values

      console.log('Subject IDs:', subjectIds); // Debugging: Log extracted subject IDs

      // Filter subjects whose `_id` (converted to string) matches any of the extracted subject IDs
      const filtered = subjects.filter((subject) =>
        subjectIds.includes(subject._id.toString())
      );

      console.log('Filtered Subjects:', filtered); // Debugging: Log filtered subjects
      setFilteredSubjects(filtered);
    } else {
      setFilteredSubjects([]); // If no subjects are found, show an empty list
    }
  };

  // Handle course selection
  const handleCourseSelect = (e) => {
    const courseId = e.target.value;
    setSelectedCourseId(courseId);
    filterSubjectsByCourse(courseId); // Filter subjects when a course is selected
  };

  // Handle edit click
  const handleEditClick = (subject) => {
    setEditingSubjectId(subject._id);
    setEditedSubject({
      subjectId: subject.subjectId,
      subjectName: subject.subjectName,
      lectureName: subject.lectureName,
      classDay: subject.classDay,
      sessionStartTime: subject.sessionStartTime,
      sessionEndTime: subject.sessionEndTime,
    });
  };

  // Handle save click
  const handleSaveClick = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put(
        `https://lmsacademicserver.netlify.app/api/subject/updateSubject/${editingSubjectId}`,
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
      setFilteredSubjects((prevSubjects) =>
        prevSubjects.map((subject) =>
          subject._id === editingSubjectId ? updatedSubject : subject
        )
      );

      setEditingSubjectId(null);
    } catch (error) {
      console.error('Error updating subject:', error.message);
      setError('Error updating subject');
    }
  };

  // Handle cancel click
  const handleCancelClick = () => {
    setEditingSubjectId(null);
    setEditedSubject({
      subjectId: '',
      subjectName: '',
      lectureName: '',
      classDay: '',
      sessionStartTime: '',
      sessionEndTime: '',
    });
  };

  // Format time
  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hourNum = parseInt(hours, 10);
    const isPM = hourNum >= 12;
    const adjustedHour = hourNum % 12 || 12;
    const period = isPM ? 'PM' : 'AM';
    return `${adjustedHour}:${minutes} ${period}`;
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchSubjects();
    fetchCourses();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container-fluid p-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="fw-bold">Manage Subjects</h2>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12 col-md-6 col-lg-4 mb-2">
          <select
            className="form-select"
            value={selectedCourseId}
            onChange={handleCourseSelect}
          >
            <option value="" disabled>
              Select Course
            </option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.courseTitle}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-6 col-lg-4 mb-2">
          <input className="form-control" placeholder="Type to search..." />
        </div>

        <div className="col-12 col-md-6 col-lg-4 mb-2">
          <Link to="add-subject" className="btn btn-primary w-100">
            Create New Subject
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">All Subjects</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Subject ID</th>
                      <th>Subject Name</th>
                      <th>Class Day</th>
                      <th>Lecture Name</th>
                      <th>Session Start Time</th>
                      <th>Session End Time</th>
                      <th>Created Date</th>
                      <th>Updated Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubjects.length > 0 ? (
                      filteredSubjects.map((subject) => (
                        <tr key={subject._id}>
                          <td>{subject.subjectId}</td>
                          <td>
                            {editingSubjectId === subject._id ? (
                              <input
                                type="text"
                                className="form-control"
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
                                type="text"
                                className="form-control"
                                value={editedSubject.lectureName}
                                onChange={(e) =>
                                  setEditedSubject({ ...editedSubject, lectureName: e.target.value })
                                }
                              />
                            ) : (
                              subject.lectureName
                            )}
                          </td>
                          <td>
                            {editingSubjectId === subject._id ? (
                              <input
                                type="time"
                                className="form-control"
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
                                className="form-control"
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
                                  className="btn btn-success btn-sm me-2"
                                  onClick={handleSaveClick}
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-sm"
                                  onClick={handleCancelClick}
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
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
                        <td colSpan="8" className="text-center">
                          No subjects found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSubject;