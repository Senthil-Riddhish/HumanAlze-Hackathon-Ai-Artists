import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import CreateTestForm from "../components/CreateTestForm";
import QuizDetail from "../components/QuizDetail";
import jwt from "jwt-decode";

function CreateTest() {
    const [teacher, setTeacher] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("user");
                if (token) {
                    const user = jwt(token);
                    const userName = user.name;
                    setTeacher(userName);
                } else {
                    navigate("/");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchData();
    }, [navigate]);

    return (
        <div className="flex">
            <Dashboard name={teacher} role={"Teacher"}/>
            <Routes>
                <Route path="/" element={<CreateTestForm />} />
                <Route path="/quiz/:quizId" element={<QuizDetail />} />
                <Route path="/allocatingTest" element={<QuizDetail />} />
            </Routes>
        </div>
    );
}

export default CreateTest;
