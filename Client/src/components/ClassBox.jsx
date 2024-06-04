import React from "react";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";

function ClassBox({ classData, deleteClass }) {
  return (
    <div className="bg-gradient-to-br from-pRed to-pPink p-6 text-pGray-900 rounded-lg shadow-md hover:shadow-lg transition duration-300">
      <Link to={`/teacher-classes/${classData._id}`} className="block mb-4">
        <h2 className="text-3xl font-bold mb-2">{classData.className}</h2>
        <p className="text-lg font-semibold">
          Semester: {classData.sem} | Year: {classData.year}
        </p>
      </Link>
      <button
        className="flex items-center justify-center w-full py-2 bg-pYellow text-pRed font-semibold rounded-md transition duration-300 hover:bg-pOrange hover:text-white"
        onClick={deleteClass}
      >
        <AiFillDelete className="mr-2 text-xl" />
        Delete Class
      </button>
    </div>
  );
}

export default ClassBox;
