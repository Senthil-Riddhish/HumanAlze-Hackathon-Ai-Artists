import React from 'react';
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import QuizList1 from "../components/QuizList1";
import { useEffect, useState } from "react";
import jwt from "jwt-decode";
import { API_ENDPOINT } from "../constants"; // Update with your actual constants file
import { Card, Container, Row, Col, Modal, Button, Alert, Badge, ListGroup } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const StudentProfilePage = () => {
    const [student, setStudent] = useState("");
    const [incompleteQuizzes, setIncompleteQuizzes] = useState([]);
    const [completedQuizzes, setCompletedQuizzes] = useState([]);
    const [regno, setRegno] = useState("");
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [answers, setAnswers] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [fullscreen, setFullscreen] = useState(true);
    const [show, setShow] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("studentToken");
        if (token) {
            const studentToken = jwt(token);
            const studentName = studentToken.name;
            const regno = studentToken.regno;
            setStudent(studentName);
            setRegno(regno);
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
            setData(data)
            console.log("data : ", data);
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

    const handleQuizView = async (quizId) => {
        const completedQuiz = completedQuizzes.find(quiz => quiz._id === quizId);
        setSelectedQuiz(completedQuiz); // Set selectedQuiz state
        if (completedQuiz) {
            console.log("completedQuiz : ", completedQuiz);
            let body = {
                quizId: quizId,
                regno: regno
            };
            try {
                let response = await fetch(`${API_ENDPOINT}student/getstudentresult`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body)
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log("response : ", result.quizResult.quizDetails);
                    setAnswers(result.quizResult.quizDetails);
                    setShowModal(true);
                    setFullscreen(true);
                    setShow(true);
                } else {
                    console.error('Error fetching quiz result:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching quiz result:', error);
            }
        }
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedQuiz(null);
        setAnswers(null); // Reset answers to null when closing the modal
    };

    return (
        <div className="flex">
            <Dashboard name={student} role={"Student"} />
            <Container className="p-4">
                <h2>Incomplete Quizzes</h2>
                <QuizList quizzes={incompleteQuizzes} onQuizClick={handleQuizClick} />

                <h2>Completed Quizzes</h2>
                <QuizList1 quizzes={completedQuizzes} onQuizClick={handleQuizView} data={data} />
            </Container>

            <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Quiz Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedQuiz && (
                        <div>
                            <h4>{selectedQuiz.quizName}</h4>
                            <p>{selectedQuiz.description}</p>
                            <h5>Quiz Details</h5>
                            {answers && answers.map((question, index) => ( // Ensure answers is not null
                                <Card key={index} className="mb-3">
                                    <Card.Body>
                                        <Card.Title>Question {index + 1} : {question.questionText}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">Type: <Badge bg="secondary">{question.questionType}</Badge></Card.Subtitle>
                                        <Card.Text>
                                            Mark Alloted : <Badge bg="secondary">{question.marks}</Badge>
                                        </Card.Text>
                                        {question.questionType === "MCQ" && (
                                            <>
                                                <Card.Text>
                                                    Mark Given : <Badge bg="warning">
                                                        {question.optionChoosed === question.correctOption ? question.marks : 0}
                                                    </Badge>
                                                </Card.Text>
                                                <div>
                                                    <ListGroup>
                                                        <ListGroup.Item>
                                                            <strong>Options : </strong> <Badge bg="secondary">{question.options.join(', ')}</Badge>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item>
                                                            <strong>Correct Option : </strong> <Badge bg="success">{question.options[parseInt(question.correctOption) - 1]}</Badge>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item>
                                                            <strong>Option Chosen : </strong> <Badge bg={question.status === 'wrong' ? 'danger' : 'success'}>{question.options[parseInt(question.optionChoosed) - 1]}</Badge>
                                                        </ListGroup.Item>
                                                        <ListGroup.Item>
                                                            <strong>Status : </strong>
                                                            <Badge bg={question.status === 'wrong' ? 'danger' : 'success'}>
                                                                {question.status}
                                                            </Badge>
                                                        </ListGroup.Item>
                                                    </ListGroup>
                                                </div>
                                            </>
                                        )}
                                        {question.questionType === "Essay" && (
                                            <div>
                                                <p>Mark Given :
                                                    <Badge bg="warning" className="ml-2">
                                                        {question.final_mark}
                                                    </Badge></p>
                                                <p>Entered Paragraph : {question.details[0].paragraph}</p>
                                                {question.details[0].details.length > 0 && question.details[0].details.map((detail, i) => (
                                                    (detail.spelling_errors.length > 0 || detail.tense_array.length > 0) && (
                                                        <div key={i}>
                                                            <Card className="mb-2">
                                                                <Card.Body>
                                                                    <Card.Title>Error Details</Card.Title>
                                                                    <Card.Text>
                                                                        <strong>Incorrect Sentence:</strong> {detail.incorrect_sentence}<br />
                                                                        <strong>Original Sentence:</strong> {detail.original}
                                                                    </Card.Text>
                                                                    {detail.spelling_errors.length > 0 && (
                                                                        <Alert variant="danger">
                                                                            <Alert.Heading>Spelling Errors:</Alert.Heading>
                                                                            <ul>
                                                                                {detail.spelling_errors.map((error, index) => (
                                                                                    <li key={index}>
                                                                                        <Badge variant="info" className="mr-2">{error[0]}</Badge>
                                                                                        <Badge variant="secondary" className="mr-2">{error[1]}</Badge>
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        </Alert>
                                                                    )}
                                                                    {detail.tense_array.length > 0 && (
                                                                        <Alert variant="warning">
                                                                            <Alert.Heading>Tense Errors:</Alert.Heading>
                                                                            <ul>
                                                                                {detail.tense_array.map((tense, index) => (
                                                                                    <li key={index}>
                                                                                        <div className="d-flex flex-wrap m-2">
                                                                                            <Badge variant="info" className="mr-2">{tense[0]}</Badge>
                                                                                            <Badge variant="secondary" className="mr-2">{tense[1]}</Badge>
                                                                                            {tense.slice(2).map((part, i) => (
                                                                                                <Badge variant="light" className="mr-2" key={i}>{part}</Badge>
                                                                                            ))}
                                                                                        </div>
                                                                                    </li>
                                                                                ))}
                                                                            </ul>
                                                                        </Alert>
                                                                    )}
                                                                </Card.Body>
                                                            </Card>
                                                        </div>
                                                    )
                                                ))}
                                            </div>
                                        )}
                                    </Card.Body>
                                </Card>
                            ))}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
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
                        <Card
                            onClick={() => onQuizClick(quiz._id)}
                            style={{
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                transition: 'box-shadow 0.3s ease',
                                cursor: 'pointer'
                            }}
                        >
                            <Card.Body>
                                <Card.Title>{quiz.quizName.toUpperCase()}</Card.Title>
                                <Card.Text>Description : {quiz.description}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))
            )}
        </Row>
    );
};

export default StudentProfilePage;
