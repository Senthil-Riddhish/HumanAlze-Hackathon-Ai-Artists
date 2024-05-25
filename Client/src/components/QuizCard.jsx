import React from "react";
import { useNavigate } from "react-router-dom";

const QuizCard = ({ quiz }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/teacher-create-test/quiz/${quiz._id}`);
    };

    return (
        <div onClick={handleCardClick} className="border p-4 mb-4 cursor-pointer">
            <h2 className="text-xl font-bold">{quiz.quizName}</h2>
            <p>{quiz.description}</p>
        </div>
    );
};

export default QuizCard;
