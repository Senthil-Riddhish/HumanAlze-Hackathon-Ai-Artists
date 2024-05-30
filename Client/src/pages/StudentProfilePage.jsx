import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import { useEffect, useState } from "react";
import jwt from "jwt-decode";
import { API_ENDPOINT } from "../constants"; // Update with your actual constants file
import { Card, Container, Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const StudentProfilePage = () => {
    const [student, setStudent] = useState("");
    const [incompleteQuizzes, setIncompleteQuizzes] = useState([]);
    const [completedQuizzes, setCompletedQuizzes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("studentToken");
        if (token) {
            const studentToken = jwt(token);
            const studentName = studentToken.name;
            const regno = studentToken.regno;
            setStudent(studentName);
            fetchQuizStatus(regno);
        } else {
            navigate("/");
        }
    }, [navigate]);

    const fetchQuizStatus = async (regn) => {
        try {
            const response = await fetch(`${API_ENDPOINT}student/studentpage/${regn}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();
            if (response.ok) {
                setIncompleteQuizzes(data.incompleteQuizList);
                setCompletedQuizzes(data.completedQuizList);
            } else {
                console.error('Error fetching quiz status:', data.message);
            }
        } catch (error) {
            console.error('Error fetching quiz status:', error);
        }
    };

    const handleQuizClick = (quizId) => {
        navigate(`/quiz/${quizId}`);
    };


    return (
        <div className="flex">
            <Dashboard name={student} role={"Student"} />
            <Container className="p-4">
                <h2>Incomplete Quizzes</h2>
                <QuizList quizzes={incompleteQuizzes} onQuizClick={handleQuizClick} />

                <h2>Completed Quizzes</h2>
                <QuizList quizzes={completedQuizzes} onQuizClick={handleQuizClick} />
            </Container>
        </div>
    );
};

const QuizList = ({ quizzes, onQuizClick }) => {
    return (
        <Row>
            {quizzes.length === 0 ? (
                <Col>
                    <p>No quizzes available</p>
                </Col>
            ) : (
                quizzes.map(quiz => (
                    <Col key={quiz._id} sm={12} md={6} lg={4} className="mb-4">
                        <Card onClick={() => onQuizClick(quiz._id)}>
                            <Card.Body>
                                <Card.Title>{quiz.quizName}</Card.Title>
                                <Card.Text>{quiz.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))
            )}
        </Row>
    );
};

export default StudentProfilePage;
