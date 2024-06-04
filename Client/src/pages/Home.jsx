import React from "react";
import { Link } from "react-router-dom";
import studentM from "../assets/studentM.png";
import studentF from "../assets/studentF.png";
import teacherM from "../assets/teacherM.png";
import teacherF from "../assets/teacherF.png";
import  teacher from"../assets/download.png";
import  teacherf from"../assets/download1.png";
import studentm from "../assets/download3.png";
import studentf from  "../assets/download4.png";

function Home() {
  return (
    <div className="h-screen flex justify-around items-center text-center bg-gray-200">
      <Link
        to="/teacher-auth"
        className="text-white bg-pBlue p-4 rounded-lg transition-all hover:scale-105"
      >
        <div className="flex gap-4">
          <img className="w-24" src={teacher} alt="teacher-male" />
          <img className="w-24" src={teacherf} alt="teacher-female" />
        </div>
        <h2 className="text-3xl font-semibold mt-8" style={{fontFamily:"cursive"}}>Teacher</h2>
      </Link>
      <Link
        to="/student-auth"
        className="text-white bg-pBlue p-4 rounded-lg transition-all hover:scale-105"
      >
        <div className="flex gap-4">
          <img className="w-24" src={studentm} alt="student-male" />
          <img className="w-24" src={studentf} alt="student-female" />
        </div>
        <h2 className="text-3xl font-semibold mt-8" style={{fontFamily:"cursive"}}>Student</h2>
      </Link>
    </div>
  );
}

export default Home;
