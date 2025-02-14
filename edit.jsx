import axios from "axios";
import PageHeader from "../header/pageheader";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function EditCourse() {
    const [course, setCourse] = useState({
        id: '',
        name: '',
        duration: '',
        price: '',
        trainerName: '',
        level: '',
        description: ''
    });
    const params = useParams();
    const navigate = useNavigate();

    const readCourseById = async () => {
        try {
            const baseUrl = 'http://127.0.0.1:8080';
            const response = await axios.get(`${baseUrl}/Courses/${params.id}`); 
            const queriedCourse = response.data;
            setCourse(queriedCourse);
        } catch (error) {
            alert("server error");
        }
    };

    const onChangeBox = event => {
        const updatableCourse = {...course};
        updatableCourse[event.target.id] = event.target.value;
        setCourse(updatableCourse);
    };
    const onUpdate = async () => {
        const baseUrl = "http://localhost:8080";
        try {
            const response = await axios.put(`${baseUrl}/courses/${params.id}`, { ...course }); // Corrected endpoint
            const updatedCourse = response.data.course;
            setCourse(updatedCourse);
            alert(response.data.message);
            navigate('/CourseApp/client/src/Courses/list_course.jsx');
        } catch (error) {
            alert('Server Error');
        }
    };

    useEffect(() => {
        readCourseById(); // Corrected function call
    }, []);

    return (
        <>
            <PageHeader />
            <h3>
                <a href="/CourseApp/client/src/Courses/list_course.jsx" className="btn btn-dark">Go Back</a> Edit Course
            </h3>
            <div className="container">
                <div className="mb-3">
                    <label htmlFor="id" className="form-label">Id</label>
                    <input
                        type="text"
                        className="form-control"
                        id="id"
                        placeholder="please enter course id"
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
                        placeholder="please enter course name"
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
                        placeholder="please enter course duration"
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
                        placeholder="please enter course price"
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
                        placeholder="please enter course trainer name"
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
                        placeholder="please enter course level"
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
                        placeholder="please enter course description"
                        value={course.description}
                        onChange={onChangeBox}
                    />
                </div>
                <button type="button" className="btn btn-primary" onClick={onUpdate}>Update Course</button>
            </div>
        </>
    );
}

export default EditCourse;
