import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageCourse = () => {
    const [courses, setCourses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [campuses, setCampuses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [selectedCampusId, setSelectedCampusId] = useState('');

    // Fetch all courses
    const fetchCourses = async () => {
        try {
            const response = await axios.get('https://primelms-server.netlify.app/api/course/getAllCourses');
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
            const response = await axios.get('https://primelms-server.netlify.app/api/subject/getAllSubjects');
            setSubjects(response.data.subjects || []);
        } catch (error) {
            console.error('Error fetching subjects:', error);
            setError('Error fetching subjects');
        }
    };

    // Fetch all campuses
    const fetchCampuses = async () => {
        try {
            const response = await axios.get("https://primelms-server.netlify.app/api/campus/getAllCampuses");
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

    return (
        <div className="container-fluid p-4">
            <div className="row mb-4">
                <div className="col-12 text-center">
                    <h2 className="fw-bold">View All Courses</h2>
                </div>
            </div>


            {error && <div className="alert alert-danger text-center">{error}</div>}
            <div className="row mb-3 justify-content-center pt-2" style={{ border: "3px solid #059888", borderRadius: "10px" }}>
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
                        <option value="">Select a Campus</option>
                        {campuses.map((campus) => (
                            <option key={campus._id} value={campus._id}>
                                {campus.campusName}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="row justify-content-center p-3 "style={{ border: "3px solid #059888", borderRadius: "10px" }}>
            <div className="col-12 text-center mb-2"></div>
            <div>
                <h3 className="fw-bold">All Courses</h3>
            </div>
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <div key={course._id} className="col-12 col-md-6 col-lg-4 mb-4">
                            <div className="card h-100 border-primary">
                                <div className="card-body">
                                    <h5 className="card-title fw-bold text-center">
                                        {course.courseTitle}
                                    </h5>

                                    <p className="card-text text-center">
                                        <strong>Level:</strong> {course.courseLevel}
                                    </p>

                                    <p className="card-text text-center">
                                        <strong>Duration:</strong> {course.courseDuration}
                                    </p>

                                    <p className="card-text text-center">
                                        <strong>Subject:</strong> {course.subject.map(sub => sub.subjectName).join(', ')}
                                    </p>

                                    <p className="card-text text-center">
                                        <strong>Campus:</strong> {course.campus.map(camp => camp.campusName).join(', ')}
                                    </p>

                                    <p className="card-text text-center">
                                        <strong>Fee:</strong> {course.totalCourseFee}
                                    </p>

                                    <p className="card-text text-center">
                                        <strong>Language:</strong> {course.language}
                                    </p>
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