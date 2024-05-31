import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Form } from 'react-bootstrap';
import { API_ENDPOINT } from '../constants';
import axios from 'axios';
import jwt from "jwt-decode";

const QuizPlatform = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const navigate = useNavigate();

    const [student, setStudent] = useState("");
    const [regno,setRegno]=useState("");
    const [id,setId]=useState("");

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`${API_ENDPOINT}student/test/${quizId}`);
                const data = await response.json();
                console.log("data : ", data);
                setQuiz(data);
                setAnswers(new Array(data.questions.length).fill(null)); // Initialize answers array
                console.log("asnwers : ", answers);
            } catch (error) {
                console.error('Error fetching quiz details:', error);
            }
        };
        const token = localStorage.getItem("studentToken");
        const studentToken = jwt(token);
        const studentName = studentToken.name;
        const regno = studentToken.regno;
        setId(studentToken.studentId);
        setStudent(studentName);
        setRegno(regno);
        fetchQuiz();
    }, [quizId]);

    const handleAnswerChange = (index, answer) => {
        const newAnswers = [...answers];
        console.log(index, answer);
        newAnswers[index] = answer;
        console.log("after :  ", newAnswers);
        setAnswers(newAnswers);
    };

    const handleNextQuestion = () => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const handleSubmitQuiz = async () => {
        try {
            const response = await fetch(`${API_ENDPOINT}student/submit-quiz/${quizId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ answers,quiz,student,regno,id}) // Ensure the body is a JSON string
            });
            if (response.status==200){
                navigate('/student-profile')
            }

        } catch (error) {
            console.error("Error deleting question:", error);
        }
    }

    if (!quiz) return <p>Loading...</p>;

    const currentQuestion = quiz.questions[currentQuestionIndex];

    return (
        <Container className="mt-4">
            <Card>
                <Card.Body>
                    <Card.Title>{quiz.quizName}</Card.Title>
                    <Card.Text>{quiz.description}</Card.Text>
                    <Card.Text>Question {currentQuestionIndex + 1} of {quiz.numberofQuestions}</Card.Text>
                    <Card.Text>{currentQuestion.questionText}</Card.Text>
                    {currentQuestion.questionType === 'MCQ' && (
                        <Form>
                            {currentQuestion.options.map((option, index) => (
                                <Form.Check
                                    key={index}
                                    type="radio"
                                    label={option}
                                    name={`answer${currentQuestionIndex}`}
                                    value={index} // <-- Assign the index as the value
                                    checked={answers[currentQuestionIndex] === index}
                                    onChange={() => {
                                        console.log('Selected option index:', currentQuestionIndex, index);
                                        handleAnswerChange(currentQuestionIndex, index);
                                    }}
                                />
                            ))}
                        </Form>
                    )}
                    {currentQuestion.questionType === 'Essay' && (
                        <Form.Group>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={answers[currentQuestionIndex] || ''}
                                onChange={(e) => handleAnswerChange(currentQuestionIndex, e.target.value)}
                            />
                        </Form.Group>
                    )}
                    {currentQuestionIndex < quiz.numberofQuestions - 1 ? (
                        <Button onClick={handleNextQuestion} className="mt-3">Next Question</Button>
                    ) : (
                        <Button onClick={handleSubmitQuiz} className="mt-3">Submit Quiz</Button>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};

export default QuizPlatform;
