import axios from "axios";
import PageHeader from "../header/pageheader";
import { useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";


function CourseList() {
    const [courses, setCourses] = useState({
        id: '',
        name: '',
        duration: '',
        price: '',
        trainerName: '',
        level: '',
        description: ''
    });
   
    const deleteCourse = async (id) => {
        if(!confirm("Are you sure to delete?")) {
            return;
        }
        const baseUrl = "http://localhost:8080"
        try {
            const response = await axios.delete(`${baseUrl}/course/${id}`)
            alert(response.data.message)
            await readAllCourses();
        } catch(error) {
            alert('Server Error');
        }
    };
    const readAllCourses = async () => {
        try {
            const baseUrl = "http://127.0.0.1:8080"; 
            const response = await axios.get(`${baseUrl}/courses`);
            const queriedCourse = response.data;
            setCourses(queriedCourse);
        } catch (error) {
            alert('Server Error');
        }
    };

    useEffect(() => {
        readAllCourses();
    }, []);

   

    return (
        <>
            <PageHeader />
            <h3>✒️ List of Courses</h3>

            <div className="container-fluid">
                <table className="table table-success table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col">Id</th>
                            <th scope="col">Name</th>
                            <th scope="col">Duration</th>
                            <th scope="col">Price</th>
                            <th scope="col">Trainer_Name</th>
                            <th scope="col">Level</th>
                            <th scope="col">Description</th>
                            <th>    </th>
                        </tr>
                    </thead>
                    <tbody>
                    {(courses && courses.length > 0) ? courses.map(
                            (courses) =>  {return (<tr key={courses.Id}>
                            <th scope="row">{courses.id}</th>
                            <td>{courses.Name}</td>
                            <td>{courses.Duration}</td>
                            <td>{courses.Price}</td>
                            <td>{courses.Trainer_Name}</td>
                            <td>{courses.Level}</td>
                            <td>{courses.Description}</td>
                            <td><a href={`/CourseApp/client/src/Courses/view_course.jsx${courses.Id}`} 
                                className="btn btn-success">View</a>
                             
                                <a href={`/CourseApp/client/src/Courses/edit_course.jsx${courses.Id}`} 
                                className="btn btn-warning">Edit</a>
    
                                <button  
                                className="btn btn-danger"
                                onClick={()=>deleteCourse(courses.Id)}>Delete</button></td>
                        </tr>);}
                        ) : <tr><td colspan="5">No Data Found</td></tr>}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default CourseList;
