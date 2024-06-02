import React from "react";
import { useNavigate } from "react-router-dom";
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';

const QuizCard = ({ quiz }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/teacher-create-test/quiz/${quiz._id}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="border p-3 mb-4 cursor-pointer bg-white shadow-lg rounded-lg transition-transform transform hover:scale-100"
        >
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{quiz.quizName}</h2>
                    <p className="text-gray-600">{quiz.description}</p>
                    <p className="text-gray-600">
                    <Badge bg="dark">{quiz.createdAt}</Badge>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QuizCard;
