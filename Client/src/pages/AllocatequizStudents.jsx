import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import jwt from "jwt-decode";
import { API_ENDPOINT } from "../constants";

function AllocatequizStudents() {
    const [Teacher, setTeacher] = useState("");
    const [quizzes, setQuizzes] = useState([]);
    const [studentRegno, setStudentRegno] = useState("");
    const [selectedQuiz, setSelectedQuiz] = useState({ id: "", name: "" });
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
            const response = await fetch(`${API_ENDPOINT}user/quizzes/${teacherId}`, {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                },
            });
            const data = await response.json();
            console.log(data);
            setQuizzes(data.list);
        } catch (error) {
            console.error("Error fetching quizzes:", error);
        }
    };

    const handleAllocate = async () => {
        try {
            const { id, name } = selectedQuiz;
            // Print the student registration number, selected quiz name, and quiz ID
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
        <>
            <div className="flex">
                <Dashboard name={Teacher} role={"Teacher"} />
                <div className="p-4">
                    <h2>Allocate Quiz to Student</h2>
                    <div className="mb-4">
                        <label>Student Registration Number:</label>
                        <input
                            type="text"
                            value={studentRegno}
                            onChange={(e) => setStudentRegno(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="mb-4">
                        <label>Select Quiz:</label>
                        <select
                            value={`${selectedQuiz.id}|${selectedQuiz.name}`}
                            onChange={handleQuizSelect}
                            className="form-control"
                        >
                            <option value="">Select a quiz</option>
                            {quizzes.map((quiz) => (
                                <option key={quiz._id} value={`${quiz._id}|${quiz.quizName}`}>
                                    {quiz.quizName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={handleAllocate} className="btn btn-primary">
                        Allocate
                    </button>
                </div>
            </div>
        </>
    );
}

export default AllocatequizStudents;
