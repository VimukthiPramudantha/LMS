// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Login from "./view/Login";
import StudentDashboardMain from "./view/student/StudentDashboardMain";
import AcedemicDashboardMain from "./view/Academic/AcademicDashboardMain";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import TeacherDashboardMain from "./view/Teacher/TeacherDashboardMain";
import AdminDashboardMain from "./view/Admin/AdminDashboardMain";
import AddCoordinatorLogin from "./view/commonPages/AddCoordinatorLogin";
import AddAccountantLogin from "./view/Accountant/AddAccountantLogin"
import StudentProfile from "./view/student/StudentProfile";
import AddStudentEduction from "./view/student/AddStudentEduction";
import AddStudentEduction2 from "./view/student/AddStudentEduction2";
import StudentLogin from "./view/student/StudentLogin";
import AddWorksSpace from "./view/student/AddWorksSpace";
import AddITExecutiveLogin from "./view/commonPages/AddITExicutiveLogin";
import ITExecutiveDashboardMain from "./view/ITExicutive/ITExecutiveDashboardMain";
import AcademicManagerDashboardMain from "./view/AcademicManager/AcademicManagerDashboardMain";
import AccountantDashboardMain from "./view/Accountant/AccountantDashboardMain";
import AccountantheadDashboardMain from "./view/AccountantHead/AccountantHeadDashboardMain";
import CoordinatorDashboardMain from "./view/Coordinator/coordinatorDashboardMain";
import WelcomePage from "./view/WelcomePage";
import Signup from "./view/Signup";
// import ZoomMeeting from "./ZoomMeeting";
import DirectorHeadDashboardMain from './view/Director/DirectorHeadDashboardMain';

function App() {
  return (
    <Router>
      <Routes>
        {/* startup */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />

        <Route path="/coordinate" element={<AddCoordinatorLogin />} />
        <Route path="/itexecutive" element={<AddITExecutiveLogin />} />
        <Route path="/accountant" element={<AddAccountantLogin />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/authLoginStudent" element={<StudentLogin />} />

        {/*StudentProfile*/}

        <Route path="/profile/*" element={<StudentProfile />} />
        <Route
          path="/profile"
          element={<Navigate to={"/profile/dashboard"} />}
        />
        <Route
          path="/profile/manage-education"
          element={<AddStudentEduction />}
        />
        <Route path="/profile/manage-worksSpace" element={<AddWorksSpace />} />
        <Route path="/profile/manage-education2" element={<AddStudentEduction2 />}
        />

        {/* Student */}
        <Route path="/student/*" element={<StudentDashboardMain />} />
        <Route path="/student" element={<Navigate to="/student/dashboard" />} />

        {/* Accademic */}
        <Route path="/academic/*" element={<AcedemicDashboardMain />} />
        <Route path="/academic" element={<Navigate to="/academic/dashboard" />}
        />

        {/* Teacher */}
        <Route path="/teacher/*" element={<TeacherDashboardMain />} />
        <Route path="/teacher" element={<Navigate to="/teacher/dashboard" />} />

        {/* Admin */}
        <Route path="/admin/*" element={<AdminDashboardMain />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />.

        {/* Director */}
        <Route path="/director/*" element={<DirectorHeadDashboardMain />} />
        <Route path="/director" element={<Navigate to="/director/dashboard" />} />

        {/* itexecutive */}
        <Route path="/itexecutive/*" element={<ITExecutiveDashboardMain />} />
        <Route path="/itexecutive" element={<Navigate to="/itexecutive/dashboard" />}/> 

        {/* Academic Manager */}
        <Route path="/academicmanager/*" element={<AcademicManagerDashboardMain/>} />
        <Route path="/academicmanager" element={<Navigate to="/academicmanager/dashboard" />}/> 
     
        {/* Accountant */}
        <Route path="/accountant/*" element={<AccountantDashboardMain/>} />
        <Route path="/accountant" element={<Navigate to="/accountant/dashboard" />}/> 

        {/* Accountant Head */}
        <Route path="/accountshead/*" element={<AccountantheadDashboardMain/>} />
        <Route path="/accountshead" element={<Navigate to="/accountanthead/dashboard" />}/> 

        {/* Coordinator */}
        <Route path="/Coordinator/*" element={<CoordinatorDashboardMain/>} />
        <Route path="/Coordinator" element={<Navigate to="/coordinator/manage-student" />}/> 
      </Routes>
    </Router>
  );
}

export default App;
