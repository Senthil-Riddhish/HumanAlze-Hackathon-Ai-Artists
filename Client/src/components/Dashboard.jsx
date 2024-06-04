import React from "react";
import { Link } from "react-router-dom";
import { SiGoogleclassroom } from "react-icons/si";
import { AiOutlineFolderAdd } from "react-icons/ai";
import { MdGroupAdd } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { MdOutlineAnalytics } from "react-icons/md";

function Dashboard({ name, role }) {
  const handleLogout = () => {
    console.log("hi");
    localStorage.removeItem("user");
    localStorage.removeItem("studentID");
    localStorage.removeItem("userID");
    localStorage.removeItem("studentToken");
    localStorage.removeItem("tests");
  };

  const sidebarStyles = {
    backgroundColor: '#1A202C',
    color: '#FFF',
    height: '100vh',
    padding: '20px 15px',
    width: '240px', // Increased width
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)' // Adding a slight shadow for better separation
  };

  const titleStyles = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#E2E8F0',
    textAlign: 'left' // Left alignment
  };

  const linkStyles = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 0',
    marginBottom: '10px',
    color: '#E2E8F0',
    textDecoration: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s, transform 0.3s',
    textAlign: 'left' // Left alignment
  };

  const iconStyles = {
    marginRight: '12px',
    fontSize: '1.2rem'
  };

  const handleMouseEnter = (e) => {
    e.currentTarget.style.backgroundColor = '#2D3748';
    e.currentTarget.style.transform = 'translateX(5px)';
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.transform = 'translateX(0)';
  };

  return (
    <>
      {role === "Teacher" && (
        <div style={sidebarStyles}>
          <div style={{ textAlign: 'left' }}>
            <h1 style={titleStyles}>{name}</h1>
          </div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <Link
                to="/teacher-classes"
                style={linkStyles}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <SiGoogleclassroom style={iconStyles} />
                Classes
              </Link>
            </li>
            <li>
              <Link
                to="/teacher-add-class"
                style={linkStyles}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <AiOutlineFolderAdd style={iconStyles} />
                Add Class
              </Link>
            </li>
            <li>
              <Link
                to="/teacher-add-student"
                style={linkStyles}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <MdGroupAdd style={iconStyles} />
                Add Students
              </Link>
            </li>
            <li>
              <Link
                to="/teacher-create-test"
                style={linkStyles}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <MdGroupAdd style={iconStyles} />
                Generate Test
              </Link>
            </li>
            <li>
              <Link
                to="/teacher-AllocatequizStudents"
                style={linkStyles}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <MdGroupAdd style={iconStyles} />
                Allocate Test
              </Link>
            </li>
            <li>
              <Link
                to="/teacher-view-analytics"
                style={linkStyles}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <MdOutlineAnalytics style={iconStyles} />
                View Test Analytics
              </Link>
            </li>
            <li>
              <Link
                to="/quiz-view-analytics"
                style={linkStyles}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <MdOutlineAnalytics style={iconStyles} />
                View Quiz Analytics
              </Link>
            </li>
            <li>
              <Link
                to="/"
                style={linkStyles}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleLogout}
              >
                <BiLogOut style={iconStyles} />
                Logout
              </Link>
            </li>
          </ul>
        </div>
      )}
      {role === "Student" && (
        <div style={sidebarStyles}>
          <div style={{ textAlign: 'left' }}>
            <h1 style={titleStyles}>{name}</h1>
          </div>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li>
              <Link
                to="/student-profile"
                style={linkStyles}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <BiLogOut style={iconStyles} />
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/testmark"
                style={linkStyles}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <BiLogOut style={iconStyles} />
                Test Marks
              </Link>
            </li>
            <li>
              <Link
                to="/"
                style={linkStyles}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleLogout}
              >
                <BiLogOut style={iconStyles} />
                Logout
              </Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default Dashboard;
