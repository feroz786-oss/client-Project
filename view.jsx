import axios from "axios";
import PageHeader from "../header/pageheader";
import { useState, useEffect } from "react";
import { useParams} from "react-router-dom";

function CourseView(){
    const [course, setCourse] = useState({
        Id: '', Name: '', Duration: '', Price: '', Trainer_Name: '', Level: '', Description: ''
    });
    const params = useParams();

    const readById = async () => {
        const baseUrl = "http://localhost:8080";
        try {
            const response = await axios.get(`${baseUrl}/course/${params.id}`);
            const queriedCourse = response.data;
            setCourse(queriedCourse);
        } catch(error) {
            alert('Server Error');
        }
    };

    useEffect(() => {
        readById();
    },[]);

    return (
        <>
            <PageHeader />
            <h3>
                <a href="/CourseApp/client/src/Courses/list_course.jsx" className="btn btn-light">Go Back</a>View Course
            </h3>
            <div className="container">
                <div className="form-group mb-3">
                    <label htmlFor="id" className="form-label">Course Id:</label>
                    <div className="form-control" id="id">{course.Id}</div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="name" className="form-label">Course Name:</label>
                    <div className="form-control" id="name">{course.Name}</div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="duration" className="form-label">Course Duration:</label>
                    <div className="form-control" id="duration">{course.Duration}</div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="duration" className="form-label">Course Trainer_Name:</label>
                    <div className="form-control" id="duration">{course.Trainer_Name}</div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="duration" className="form-label">Course Price:</label>
                    <div className="form-control" id="duration">{course.Price}</div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="duration" className="form-label">Course Level:</label>
                    <div className="form-control" id="duration">{course.Level}</div>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="duration" className="form-label">Course Description:</label>
                    <div className="form-control" id="duration">{course.Description}</div>
                </div>
              
            </div>
        </>
    );
}

export default CourseView;
