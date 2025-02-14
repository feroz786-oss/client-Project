import axios from "axios";
import PageHeader from "../header/pageheader";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CourseCreate() {
    const [course, setCourse] = useState({
        id: '',
        name: '',
        duration: '',
        price: '',
        trainerName: '',
        level: '',
        description: ''
    });
    
    const navigate = useNavigate();

    const onChangeBox = event => {
        const updatableCourse = {...course};
        updatableCourse[event.target.id] = event.target.value;
        setCourse(updatableCourse);
    };

    const createCourse = async () => {
        const baseUrl = "http://localhost:8080";
        try {
            const response = await axios.post(`${baseUrl}/courses`, { ...course });
            const createdCourse = response.data.course;
            setCourse(createdCourse); // Optional: Update state with the newly created course
            alert(response.data.message); // Show success message
            navigate('/client/react/src/Courses/list_course.jsx'); // Navigate back to the course list page
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('Server Error');
            }
        }
    };

    return (
        <>
            <PageHeader />
            <h3>
                <a href="/CourseApp/client/src/Courses/list_course.jsx" className="btn btn-dark">Go Back</a> Add Course
            </h3>
            <div className="container">
                {/* Form for creating a course */}
                <div className="mb-3">
                    <label htmlFor="id" className="form-label">Id</label>
                    <input
                        type="text"
                        className="form-control"
                        id="id"
                        placeholder="Please enter course id"
                        value={course.id}
                        onChange={onChangeBox}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        placeholder="Please enter course name"
                        value={course.name}
                        onChange={onChangeBox}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="duration" className="form-label">Duration</label>
                    <input
                        type="text"
                        className="form-control"
                        id="duration"
                        placeholder="Please enter course duration"
                        value={course.duration}
                        onChange={onChangeBox}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price</label>
                    <input
                        type="text"
                        className="form-control"
                        id="price"
                        placeholder="Please enter course price"
                        value={course.price}
                        onChange={onChangeBox}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="trainerName" className="form-label">Trainer Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="trainerName"
                        placeholder="Please enter course trainer name"
                        value={course.trainerName}
                        onChange={onChangeBox}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="level" className="form-label">Level</label>
                    <input
                        type="text"
                        className="form-control"
                        id="level"
                        placeholder="Please enter course level"
                        value={course.level}
                        onChange={onChangeBox}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input
                        type="text"
                        className="form-control"
                        id="description"
                        placeholder="Please enter course description"
                        value={course.description}
                        onChange={onChangeBox}
                    />
                </div>

                <button type="button" className="btn btn-primary" onClick={createCourse}>Create Course</button>
            </div>
        </>
    );
}

export default CourseCreate;
