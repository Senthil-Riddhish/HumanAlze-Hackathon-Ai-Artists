import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Form, Spinner } from 'react-bootstrap';
import { API_ENDPOINT } from '../constants';
import axios from 'axios';
import jwt from "jwt-decode";


const QuizPlatform = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
    const navigate = useNavigate();

    const [student, setStudent] = useState("");
    const [regno, setRegno] = useState("");
    const [id, setId] = useState("");

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`${API_ENDPOINT}student/test/${quizId}`);
                const data = await response.json();
                console.log("data : ", data);
                setQuiz(data);
                setAnswers(new Array(data.questions.length).fill(null)); // Initialize answers array
                console.log("answers : ", answers);
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
        setIsSubmitting(true); // Set loading state to true
        let finals = {};
        finals[quizId] = {};
        let quizDetails = [];
        let mcqMark = 0;
        try {
            console.log("final answer : ", answers);
            // Create an array of promises for all the asynchronous tasks
            const tasks = quiz.questions.map(async (ques, index) => {
                if (ques.questionType === "MCQ") {
                    ques["optionChoosed"] = (answers[index] + 1).toString();
                    if ((answers[index] + 1).toString() === ques.correctOption) {
                        ques["status"] = "correct";
                        mcqMark += parseInt(ques.marks);
                    } else {
                        ques["status"] = "wrong";
                    }
                } else if (ques.questionType === "Essay") {
                    const response = await axios.post('http://127.0.0.1:5000/grammerpredict', {
                        text: answers[index],
                        mark: ques.marks
                    });
                    const data = response.data;
                    mcqMark += data.final_mark;
                    ques["details"] = data.details;
                    ques["final_mark"] = data.final_mark;
                    ques["performance"] = data.performance;
                }
                quizDetails.push(ques);
            });
            await Promise.all(tasks);
            finals[quizId]["quizDetails"] = quizDetails;
            finals[quizId]["totalMark"] = mcqMark;
            console.log("finals : ", finals[quizId]);
            const response = await axios.post(`${API_ENDPOINT}student/submit-quiz/${quizId}`, {
                answers,
                quiz,
                student,
                regno,
                id,
                finals
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log(response);
            if (response.status === 200) {
                const responsep = await axios.post('http://127.0.0.1:5000/plagiarism', {
                    answers,
                    quiz,
                    student,
                    regno,
                    id,
                    params: finals
                });
                console.log(responsep);
                navigate('/student-profile');
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
        } finally {
            setIsSubmitting(false); // Set loading state to false after submission
        }
    }

    if (isSubmitting) {
        return (
            <Container className="mt-4 text-center">
                <div style={{ position: 'relative' }}>
                    {/* Customize the spinner animation */}
                    <Spinner animation="border" role="status" style={{ width: '5rem', height: '5rem', marginBottom: '1rem' }}>
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                    <p className="mt-3">Your answers are being evaluated...</p>
                </div>
            </Container>
        );
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
