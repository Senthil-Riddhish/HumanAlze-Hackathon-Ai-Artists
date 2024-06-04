import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import jwt from "jwt-decode";
import { API_ENDPOINT } from "../constants";

function AllocateQuizStudents() {
    const [Teacher, setTeacher] = useState("");
    const [quizzes, setQuizzes] = useState([]);
    const [studentRegno, setStudentRegno] = useState("");
    const [selectedQuiz, setSelectedQuiz] = useState({ id: "", name: "" });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const teacherId = localStorage.getItem("userID");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("user");
        if (token) {
            const user = jwt(token);
            const userName = user.name;
            setTeacher(userName);
            fetchQuizzes();
        } else {
            navigate("/");
        }
    }, [navigate]);

    const fetchQuizzes = async () => {
        try {
            console.log("fetching...");
            const response = await fetch(`${API_ENDPOINT}user/quizzes/${teacherId}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch quizzes');
            }
            const data = await response.json();
            console.log(data);
            setQuizzes(data.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching quizzes:", error);
            setError(error.message);
            setIsLoading(false);
        }
    };

    const handleAllocate = async () => {
        try {
            const { id, name } = selectedQuiz;
            console.log(`Student RegNo: ${studentRegno}`);
            console.log(`Selected Quiz ID: ${id}`);
            console.log(`Selected Quiz Name: ${name}`);

            const response = await fetch(`${API_ENDPOINT}user/allocatequiz`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    studentRegno,
                    quizId: id,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(`Allocated quiz: ${name} to student: ${studentRegno}`);
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Error allocating quiz:", error);
        }
    };

    const handleQuizSelect = (e) => {
        const [id, name] = e.target.value.split("|");
        setSelectedQuiz({ id, name });
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Dashboard name={Teacher} role={"Teacher"} />
            <div className="flex-1 p-8">
                <h2 className="text-3xl font-bold mb-6 text-gray-800">Allocate Quiz to Student</h2>
                <div className="mb-4">
                    <label className="block text-lg font-semibold mb-2">Student Registration Number:</label>
                    <input
                        type="text"
                        value={studentRegno}
                        onChange={(e) => setStudentRegno(e.target.value)}
                        className="form-control w-full px-4 py-2 border rounded-md"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-lg font-semibold mb-2">Select Quiz:</label>
                    {isLoading ? (
                        <div>Loading quizzes...</div>
                    ) : error ? (
                        <div>Error: {error}</div>
                    ) : (
                        <select
                            value={`${selectedQuiz.id}|${selectedQuiz.name}`}
                            onChange={handleQuizSelect}
                            className="form-control w-full px-4 py-2 border rounded-md"
                        >
                            <option value="">Select a quiz</option>
                            {quizzes.map((quiz) => (
                                <option key={quiz._id} value={`${quiz._id}|${quiz.quizName}`}>
                                    {quiz.quizName}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                <button
                    onClick={handleAllocate}
                    className="btn btn-primary bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                    Allocate
                </button>
            </div>
        </div>
    );
}

export default AllocateQuizStudents;
