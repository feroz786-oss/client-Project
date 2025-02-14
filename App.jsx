import CourseList from "./Courses/list_course";
import CourseCreate from "./Courses/create_course";
import CourseView from "./Courses/view_course";
import EditCourse from "./Courses/edit_course";

import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    {/* Define simpler paths for the different routes */}
                    <Route path="/" element={<CourseList />} />
                    <Route path="/CourseApp/client/src/Courses/list_course.jsx" element={<CourseList />} />

                    <Route path="/CourseApp/client/src/Courses/create_course.jsx" element={<CourseCreate />} />
                    <Route path="/CourseApp/client/src/Courses/view_course.jsx" element={<CourseView />} />  
                    <Route path="/CourseApp/client/src/Courses/edit_course.jsx" element={<EditCourse />} />   
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;

