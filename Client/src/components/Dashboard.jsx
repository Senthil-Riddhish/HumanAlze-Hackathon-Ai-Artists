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
  return (
    <>
      {
        (role === "Teacher") && (
          <><div className="min-h-screen flex flex-row">
            <div className="flex flex-col w-56 bg-pBlue overflow-hidden">
              <div className="flex items-center justify-center shadow-md">
                <h1 className="text-md uppercase text-gray-300 flex items-center gap-2">
                  {name}
                </h1>
              </div>
              <ul className="flex flex-col py-4">
                <li>
                  <Link
                    to="/teacher-classes"
                    className="flex flex-row items-center justify-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-500"
                  >
                    <span className="text-sm font-medium flex items-center gap-2">
                      <SiGoogleclassroom /> Classes
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/teacher-add-class"
                    className="flex flex-row items-center justify-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-500"
                  >
                    <span className="text-sm font-medium flex items-center gap-2">
                      <AiOutlineFolderAdd />
                      Add Class
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/teacher-add-student"
                    className="flex flex-row items-center justify-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-500"
                  >
                    <span className="text-sm font-medium flex items-center gap-2">
                      <MdGroupAdd />
                      Add students
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/teacher-create-test"
                    className="flex flex-row items-center justify-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-500"
                  >
                    <span className="text-sm font-medium flex items-center gap-2">
                      <MdGroupAdd />
                      Generate Test
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/teacher-AllocatequizStudents"
                    className="flex flex-row items-center justify-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-500"
                  >
                    <span className="text-sm font-medium flex items-center gap-2">
                      <MdGroupAdd />
                      Allocate Test
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/teacher-view-analytics"
                    className="flex flex-row items-center justify-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-500"
                  >
                    <span className="text-sm font-medium flex items-center gap-2">
                      <MdOutlineAnalytics />
                      View Test Analytics
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/quiz-view-analytics"
                    className="flex flex-row items-center justify-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-500"
                  >
                    <span className="text-sm font-medium flex items-center gap-2">
                      <MdOutlineAnalytics />
                      View Quiz Analytics
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="flex flex-row items-center justify-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-500"
                  >
                    <button
                      className="text-sm font-medium flex items-center gap-2"
                      onClick={handleLogout}
                    >
                      <BiLogOut />
                      Logout
                    </button>
                  </Link>
                </li>
              </ul>
            </div>
          </div></>
        )
      }{
        (role === "Student") && (
          <><div className="min-h-screen flex flex-row">
            <div className="flex flex-col w-56 bg-pBlue overflow-hidden">
              <div className="flex items-center justify-center shadow-md">
                <h1 className="text-md uppercase text-gray-300 flex items-center gap-2">
                  {name}
                </h1>
              </div>
              <ul className="flex flex-col py-4">
                <li>
                  <Link
                    to="/"
                    className="flex flex-row items-center justify-center h-12 transform hover:translate-x-2 transition-transform ease-in duration-200 text-white hover:text-gray-500"
                  >
                    <button
                      className="text-sm font-medium flex items-center gap-2"
                      onClick={handleLogout}
                    >
                      <BiLogOut />
                      Logout
                    </button>
                  </Link>
                </li>
              </ul>
            </div>
          </div></>
        )
      }
    </>
  );
}

export default Dashboard;
