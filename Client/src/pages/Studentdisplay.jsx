import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import jwt from "jwt-decode";
import { API_ENDPOINT } from "../constants";

function Studentdisplay() {
    const navigate = useNavigate();
    const [student, setStudent] = useState("");
    const [regno, setRegno] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("studentToken");
        if (token) {
            const studentToken = jwt(token);
            const studentName = studentToken.name;
            const studentRegno = studentToken.regno;
            console.log(studentName, studentRegno);
            setStudent(studentName);
            setRegno(studentRegno);
        } else {
            navigate("/");
        }
    }, [navigate]);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Dashboard name={student} role={"Student"} />
            <div className="flex-1 p-8">
                <ProfileDetail regno={regno} />
            </div>
        </div>
    );
}

const ProfileDetail = ({ regno }) => {
    const [studentDetails, setStudentDetails] = useState([]);
    const [selectedStudentDetail, setSelectedStudentDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const response = await fetch(`${API_ENDPOINT}student/details/${regno}`, {
                    method: "GET",
                    headers: {
                        "Content-type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch student details');
                }

                const data = await response.json();
                console.log("data : ",data);
                setStudentDetails(data.message);
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setError(error.message);
                setIsLoading(false);
            }
        };

        if (regno) {
            fetchStudentDetails();
        }
    }, [regno]);

    if (isLoading) {
        return <div className="text-center text-xl">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-xl text-red-500">Error: {error}</div>;
    }

    if (!studentDetails.length) {
        return <div className="text-center text-xl">No student details available.</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Student Profile</h2>
            {selectedStudentDetail ? (
                <div>
                    <button
                        onClick={() => setSelectedStudentDetail(null)}
                        className="text-blue-500 mb-4"
                    >
                        Back to list
                    </button>
                    <div className="mb-4">
                        <p className="text-lg"><strong>Name:</strong> {selectedStudentDetail.studentName}</p>
                        <p className="text-lg"><strong>Roll Number:</strong> {selectedStudentDetail.rollNumber}</p>
                        <p className="text-lg"><strong>Class:</strong> {selectedStudentDetail.studentClass}</p>
                        <p className="text-lg"><strong>SGPI:</strong> {selectedStudentDetail.sgpi}</p>
                        <p className="text-lg"><strong>Defaulter:</strong> {selectedStudentDetail.defaulter}</p>
                        <p className="text-lg"><strong>Prediction:</strong> {selectedStudentDetail.prediction}</p>
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold mb-4 text-gray-700">Marks</h3>
                        <table className="table-auto w-full bg-white border border-gray-200 rounded-lg">
                            <thead>
                                <tr>
                                    <th className="border-b px-4 py-2 bg-gray-100 text-left text-gray-600">Subject</th>
                                    <th className="border-b px-4 py-2 bg-gray-100 text-left text-gray-600">Marks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(selectedStudentDetail.marks).map(([subject, mark], index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="border-b px-4 py-2">{subject}</td>
                                        <td className="border-b px-4 py-2">{mark}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div>
                    <h3 className="text-2xl font-semibold mb-4 text-gray-700">Classes and Predictions</h3>
                    <ul>
                        {studentDetails.map((detail, index) => (
                            <li
                                key={index}
                                className="mb-2 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                                onClick={() => setSelectedStudentDetail(detail)}
                            >
                                <p className="text-lg"><strong>Class:</strong> {detail.studentClass}</p>
                                <p className="text-lg"><strong>Prediction:</strong> {detail.prediction}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};


export default Studentdisplay;
