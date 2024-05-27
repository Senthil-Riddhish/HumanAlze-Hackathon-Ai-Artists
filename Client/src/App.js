import './App.css';
import Navbar from './components/Navbartop';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TeacherAuth from './pages/TeacherAuth';
import StudentAuth from './pages/StudentAuth';
import ClassList from './pages/ClassList';
import AddClass from './pages/AddClass';
import StudentList from './pages/StudentList';
import AddStudent from './pages/AddStudent';
import StudentPage from './pages/StudentPage';
import ViewAnalytics from './pages/ViewAnalytics';
import CreateTest from './pages/CreateTest'
import StudentProfilePage from './pages/StudentProfilePage'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/teacher-auth' element={<TeacherAuth />} />
          <Route path='/teacher-classes' element={<ClassList />} />
          <Route path='/teacher-classes/:id' element={<StudentList />} />
          <Route path='/teacher-add-class' element={<AddClass />} />
          <Route path='/teacher-add-student' element={<AddStudent />} />
          <Route path='/teacher-student-profile/:id' element={<StudentPage />} />
          <Route path='/teacher-view-analytics' element={<ViewAnalytics />} />
          <Route path='/teacher-create-test/*' element={<CreateTest />} />
          <Route path='/student-auth' element={<StudentAuth />} />
          <Route path='/student-profile' element={<StudentProfilePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
