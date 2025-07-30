import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ManageCourse = () => {
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [campuses, setCampuses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [editingCourseId, setEditingCourseId] = useState(null);
    const [selectedCampusId, setSelectedCampusId] = useState('');
    const [editedCourse, setEditedCourse] = useState({
        courseTitle: '',
        courseLevel: '',
        courseDuration: '',
        totalCourseFee: '',
        subject: '',
        campus: '',
        language: '',
    });

    // Fetch all courses
    const fetchCourses = async () => {
        try {
            const response = await axios.get('https://lmsacademicserver.netlify.app/api/course/getAllCourses');
            const coursesData = response.data.courses || [];
            setCourses(coursesData);
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Error fetching courses');
        }
    };

    // Fetch all subjects
    const fetchSubjects = async () => {
        try {
            const response = await axios.get('https://lmsacademicserver.netlify.app/api/subject/getAllSubjects');
            setSubjects(response.data.subjects || []);
        } catch (error) {
            console.error('Error fetching subjects:', error);
            setError('Error fetching subjects');
        }
    };

    // Fetch all campuses
    const fetchCampuses = async () => {
        try {
            const response = await axios.get("https://lmsacademicserver.netlify.app/api/campus/getAllCampuses");
            if (Array.isArray(response.data)) {
                setCampuses(response.data);
            } else if (response.data && Array.isArray(response.data.campus)) {
                setCampuses(response.data.campus);
            } else {
                console.error('Unexpected response format for campus:', response.data);
                setCampuses([]);
            }
        } catch (err) {
            console.error("Error fetching campus:", err);
            setError("Failed to load campus.");
            setCampuses([]);
        }
    };

    useEffect(() => {
        fetchCourses();
        fetchSubjects();
        fetchCampuses();
    }, []);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle campus selection and filter courses by selected campus
    const handleCampusSelect = (e) => {
        setSelectedCampusId(e.target.value);
    };

    // Filter courses based on search term and selected campus ID
    const filteredCourses = courses.filter(course => {
        const matchesSearchTerm = course.courseTitle.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSelectedCampus = selectedCampusId ? course.campus.some(camp => camp._id === selectedCampusId) : true;
        return matchesSearchTerm && matchesSelectedCampus;
    });

    // Start editing a course
    const handleEditClick = (course) => {
        setEditingCourseId(course._id);
        setEditedCourse({
            courseTitle: course.courseTitle,
            courseLevel: course.courseLevel,
            courseDuration: course.courseDuration,
            totalCourseFee: course.totalCourseFee,
            subject: course.subject[0] || '',
            campus: course.campus[0] || '',
            language: course.language,
        });
    };

    // Save changes to the course
    const handleSaveClick = async () => {
        const token = localStorage.getItem('token');

        try {
            await axios.put(`https://lmsacademicserver.netlify.app/api/course/updateCourse/${editingCourseId}`, editedCourse, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            setEditingCourseId(null);
            setEditedCourse({
                courseTitle: '',
                courseLevel: '',
                courseDuration: '',
                totalCourseFee: '',
                subject: '',
                campus: '',
                language: '',
            });

            fetchCourses();
        } catch (error) {
            console.error('Error updating course:', error);
            setError('Error updating course');
        }
    };

    // Cancel editing mode
    const handleCancelClick = () => {
        setEditingCourseId(null);
        setEditedCourse({
            courseTitle: '',
            courseLevel: '',
            courseDuration: '',
            totalCourseFee: '',
            subject: '',
            campus: '',
            language: '',
        });
    };

    return (
        <div className="container-fluid p-4">
            <div className="row mb-4">
                <div className="col-12 text-center">
                    <h2 className="fw-bold">Manage Courses</h2>
                </div>
            </div>

            <div className="row mb-4 justify-content-center">
                <div className="col-12 col-md-6 col-lg-4 mb-3">
                    <input
                        className="form-control"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>

                <div className="col-12 col-md-6 col-lg-4 mb-3">
                    <select
                        className="form-select"
                        value={selectedCampusId}
                        onChange={handleCampusSelect}
                    >
                        <option value="">All Campuses</option>
                        {campuses.map((campus) => (
                            <option key={campus._id} value={campus._id}>
                                {campus.campusName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="col-12 col-md-6 col-lg-4 mb-3">
                    <Link to="add-course" className="btn btn-primary w-100">
                        Create New Course
                    </Link>
                </div>
            </div>

            {error && <div className="alert alert-danger text-center">{error}</div>}

            <div className="row justify-content-center">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <div key={course._id} className="col-12 col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 border-primary">
                                <div className="card-body">
                                    <h5 className="card-title fw-bold text-center">
                                        {editingCourseId === course._id ? (
                                            <input
                                                type="text"
                                                className="form-control mb-2"
                                                value={editedCourse.courseTitle}
                                                onChange={(e) =>
                                                    setEditedCourse({ ...editedCourse, courseTitle: e.target.value })
                                                }
                                            />
                                        ) : (
                                            course.courseTitle
                                        )}
                                    </h5>

                                    <p className="card-text text-center">
                                        <strong>Level:</strong> {editingCourseId === course._id ? (
                                            <input
                                                type="text"
                                                className="form-control mb-2"
                                                value={editedCourse.courseLevel}
                                                onChange={(e) =>
                                                    setEditedCourse({ ...editedCourse, courseLevel: e.target.value })
                                                }
                                            />
                                        ) : (
                                            course.courseLevel
                                        )}
                                    </p>

                                    <p className="card-text text-center">
                                        <strong>Duration:</strong> {editingCourseId === course._id ? (
                                            <input
                                                type="text"
                                                className="form-control mb-2"
                                                value={editedCourse.courseDuration}
                                                onChange={(e) =>
                                                    setEditedCourse({ ...editedCourse, courseDuration: e.target.value })
                                                }
                                            />
                                        ) : (
                                            course.courseDuration
                                        )}
                                    </p>

                                    <p className="card-text text-center">
                                        <strong>Subject:</strong> {editingCourseId === course._id ? (
                                            <select
                                                className="form-select mb-2"
                                                value={editedCourse.subject}
                                                onChange={(e) =>
                                                    setEditedCourse({ ...editedCourse, subject: e.target.value })
                                                }
                                            >
                                                <option value="">Select Subject</option>
                                                {subjects.map((subject) => (
                                                    <option key={subject._id} value={subject._id}>
                                                        {subject.subjectName}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            course.subject.map(sub => sub.subjectName).join(', ')
                                        )}
                                    </p>

                                    <p className="card-text text-center">
                                        <strong>Campus:</strong> {editingCourseId === course._id ? (
                                            <select
                                                className="form-select mb-2"
                                                value={editedCourse.campus}
                                                onChange={(e) =>
                                                    setEditedCourse({ ...editedCourse, campus: e.target.value })
                                                }
                                            >
                                                <option value="">Select Campus</option>
                                                {campuses.map((campus) => (
                                                    <option key={campus._id} value={campus._id}>
                                                        {campus.campusName}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            course.campus.map(camp => camp.campusName).join(', ')
                                        )}
                                    </p>

                                    <p className="card-text text-center">
                                        <strong>Fee:</strong> {editingCourseId === course._id ? (
                                            <input
                                                type="text"
                                                className="form-control mb-2"
                                                value={editedCourse.totalCourseFee}
                                                onChange={(e) =>
                                                    setEditedCourse({ ...editedCourse, totalCourseFee: e.target.value })
                                                }
                                            />
                                        ) : (
                                            course.totalCourseFee
                                        )}
                                    </p>

                                    <p className="card-text text-center">
                                        <strong>Language:</strong> {editingCourseId === course._id ? (
                                            <input
                                                type="text"
                                                className="form-control mb-2"
                                                value={editedCourse.language}
                                                onChange={(e) =>
                                                    setEditedCourse({ ...editedCourse, language: e.target.value })
                                                }
                                            />
                                        ) : (
                                            course.language
                                        )}
                                    </p>

                                    <div className="d-flex justify-content-between">
                                        {editingCourseId === course._id ? (
                                            <>
                                                <button className="btn btn-success" onClick={handleSaveClick}>
                                                    Save
                                                </button>
                                                <button className="btn btn-secondary" onClick={handleCancelClick}>
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button className="btn btn-primary" onClick={() => handleEditClick(course)}>
                                                Edit
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <p className="text-center">No courses found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageCourse;