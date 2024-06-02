import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizCard from "../components/QuizCard";
import jwt from "jwt-decode";
import { API_ENDPOINT } from "../constants";

const CreateTestForm = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [testName, setTestName] = useState("");
    const [testDescription, setTestDescription] = useState("");
    const navigate = useNavigate();
    const teacherID = localStorage.getItem("userID");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("user");
                if (token) {
                    // Fetch quizzes for the logged-in teacher
                    const response = await fetch(`${API_ENDPOINT}user/allquiz/${teacherID}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    if (!response.ok) {
                        const text = await response.text();
                        console.error("Error fetching quizzes:", text);
                        throw new Error('Network response was not ok');
                    }
                    const result = await response.json();
                    console.log("quiz result:", result.QuizInformation);
                    setQuizzes(result.QuizInformation);
                } else {
                    navigate("/");
                }
            } catch (error) {
                console.error("Error fetching quizzes:", error);
            }
        };

        fetchData();
    }, [teacherID, navigate]);

    const handleCreateTest = async () => {
        const newTest = {
            teacherId: teacherID,
            quizName: testName,
            description: testDescription
        };
        console.log(newTest);
        try {
            const response = await fetch(`${API_ENDPOINT}user/create-quiz`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTest)
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Error creating quiz:", text);
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Append the newly created quiz to the existing list of quizzes
            setQuizzes([...quizzes, data.quiz]);

            // Reset the form fields
            setTestName("");
            setTestDescription("");
        } catch (error) {
            console.error("Error creating quiz:", error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create Test</h1>
            <div className="flex space-x-4 mb-8">
                <input
                    type="text"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    placeholder="Test Name"
                    className="border p-2 w-full"
                />
                <input
                    type="text"
                    value={testDescription}
                    onChange={(e) => setTestDescription(e.target.value)}
                    placeholder="Test Description"
                    className="border p-2 w-full"
                />
                <button
                    onClick={handleCreateTest}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Create Test
                </button>
            </div>
            <div>
                {quizzes.length > 0 ? (
                    [...quizzes].reverse().map((quiz) => (
                        <QuizCard key={quiz._id} quiz={quiz} />
                    ))
                ) : (
                    <p>No quizzes created.</p>
                )}
            </div>
        </div>
    );
};

export default CreateTestForm;
