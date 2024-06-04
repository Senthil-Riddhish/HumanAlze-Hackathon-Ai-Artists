import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINT } from "../constants";
import Dashboard from "../components/Dashboard";
import jwt from "jwt-decode";
import { Pie, Bar } from "react-chartjs-2";
import Popover from 'react-bootstrap/Popover';
import { Card, Container, Row, Col, Modal, Button, Alert, Badge, ListGroup } from "react-bootstrap";

function ViewTestAnalytics() {
    const [Teacher, setTeacher] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [quizQuestionData, setQuizQuestionData] = useState([]);
    const [selectedQuizId, setSelectedQuizId] = useState("");
    const [studentStatus, setStudentStatus] = useState(null);
    const [quizTotalMark, setQuizTotalMark] = useState(0);
    const [chosedQuiz, setChosedQuiz] = useState({});
    const [selectedStudent, setSelectedStudent] = useState(null); // Track selected student
    const [fullscreen, setFullscreen] = useState(true);
    const [show, setShow] = useState(false);
    const [fullscreen1, setFullscreen1] = useState(true);
    const [show1, setShow1] = useState(false);
    const navigate = useNavigate();
    const [answers, setAnswers] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("user");
        if (token) {
            const user = jwt(token);
            const userName = user.name;
            setTeacher(userName);
            const fetchTests = async () => {
                try {
                    const response = await fetch(`${API_ENDPOINT}user/allquiz/${localStorage.getItem('userID')}`, {
                        method: "GET",
                        headers: {
                            "Content-type": "application/json",
                        },
                    });

                    const tests = await response.json();

                    if (tests) setQuizQuestionData(tests.QuizInformation);
                    console.log(tests);
                } catch (error) {
                    console.error(error);
                }
            };

            fetchTests();
        } else {
            navigate("/");
        }
    }, [navigate]);

    function handleShow(student) {
        console.log(student);
        setAnswers(student.quizDetails)
        setFullscreen(true);
        setShow(true);
    }

    function handleShow1(student) {
        console.log(student);
        setAnswers(student.quizDetails)
        setFullscreen1(true);
        setShow1(true);
    }

    const handleQuizChange = (event) => {
        const selectedQuizId = event.target.value;
        setSelectedQuizId(selectedQuizId);

        const selectedQuiz = quizQuestionData.find(quiz => quiz._id === selectedQuizId);
        console.log(selectedQuiz);
        let total = 0.0;
        selectedQuiz.questions.forEach(element => {
            total = total + parseFloat(element.marks);
        });
        setQuizTotalMark(total);
        setChosedQuiz(selectedQuiz);
        if (selectedQuiz) {
            const fetchstudents = async () => {
                try {
                    const response = await fetch(`${API_ENDPOINT}user/fetchstudents/${selectedQuiz._id}`, {
                        method: "GET",
                        headers: {
                            "Content-type": "application/json",
                        },
                    });

                    const studentstatus = await response.json();
                    setStudentStatus(studentstatus);
                    console.log(studentstatus);
                } catch (error) {
                    console.error(error);
                }
            };

            fetchstudents();
        }
    };

    // Handle popover display
    const handlePopoverShow = (student) => {
        console.log(student)
        setSelectedStudent(student);
    };

    // Handle popover close
    const handlePopoverClose = () => {
        setSelectedStudent(null);
    };

    const renderReport = () => {
        if (!studentStatus) {
            return <div>Please select a quiz to view the report.</div>;
        }

        const { attended, notAttended } = studentStatus;

        const attendanceData = {
            labels: ['Attended', 'Not Attended'],
            datasets: [{
                data: [attended.length, notAttended.length],
                backgroundColor: ['#36A2EB', '#FF6384']
            }]
        };

        const marksData = {
            labels: attended.map(student => student.regn),
            datasets: [{
                label: 'Total Marks',
                data: attended.map(student => student.totalMark),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };

        const getAlertVariant = (level) => {
            switch (level) {
                case 'High':
                    return 'danger';
                case 'Average':
                    return 'warning';
                case 'Low':
                    return 'success';
                default:
                    return 'secondary';
            }
        };

        return (
            <div className="report">
                <h3 className="text-xl font-bold mb-4">Quiz Report</h3>
                <h2 className="text-xl font-bold mb-4">Quiz Name : {chosedQuiz.quizName}</h2>
                <h2 className="text-xl font-bold mb-4">Total Mark : {quizTotalMark}</h2>
                <h4 className="text-lg font-semibold mb-4">Attendance</h4>
                <div className="mb-4" style={{ width: '400px', height: '400px' }}>
                    <Pie data={attendanceData} />
                </div>
                <h4 className="text-lg font-semibold mb-4">Marks Distribution</h4>
                <div className="mb-4" style={{ width: '600px', height: '400px' }}>
                    <Bar data={marksData} options={{
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }} />
                </div>
                <h4 className="text-lg font-semibold mb-4">Attended Students</h4>
                <table className="table-auto w-full mb-4">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Reg. No</th>
                            <th className="border px-4 py-2">Total Marks</th>
                            <th className="border px-4 py-2">Details</th>
                            <th className="border px-4 py-2">Plagiarism Report</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attended.map((student, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{student.regn}</td>
                                <td className="border px-4 py-2">{student.totalMark}</td>
                                <td className="border px-4 py-2">
                                    <Button className="me-2 mb-2" onClick={() => handleShow(student)}>
                                        Mark
                                    </Button>
                                </td>
                                <td className="border px-4 py-2">
                                    <Button className="me-2 mb-2" onClick={() => handleShow1(student)}>
                                        plagiarism
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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
                    </Modal.Body>
                </Modal>
                <Modal show={show1} fullscreen={fullscreen1} onHide={() => setShow1(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {answers && answers.map((question, index) => (
                            question.questionType === "Essay" && (
                                <div key={index}>
                                    <Card className="mb-4 shadow-sm">
                                        <Card.Body>
                                            <Card.Title>Question {index + 1} : {question.questionText}</Card.Title>
                                            <Card.Subtitle className="mb-2 text-muted">
                                                Type: <Badge bg="secondary">{question.questionType}</Badge>
                                            </Card.Subtitle>
                                            <Card.Text>
                                                Mark Allotted: <Badge bg="secondary">{question.marks}</Badge>
                                            </Card.Text>
                                            <p>Mark Given:
                                                <Badge bg="warning" className="ml-2">
                                                    {question.final_mark}
                                                </Badge>
                                            </p>
                                            <p>Entered Paragraph: {question.details[0].paragraph}</p>
                                            <div className="plagiarism-report mt-3">
                                                <h5>Plagiarism Report:</h5>
                                                {question.plagarism_report && question.plagarism_report.length > 0 ? (
                                                    <div className="plagiarism-report-list">
                                                        {question.plagarism_report.map((report, idx) => (
                                                            <Alert key={idx} variant={getAlertVariant(report.similarity_level)}>
                                                                <Alert.Heading>
                                                                    <a href={report.link} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                                                                        {report.title}
                                                                    </a>
                                                                </Alert.Heading>
                                                                <p>Similarity Score: {report.similarity_score}</p>
                                                                <p>Similarity Percentage: {report.similarity_percentage.toFixed(2)}%</p>
                                                                <p>Similarity Level: <Badge bg={getAlertVariant(report.similarity_level)}>{report.similarity_level}</Badge></p>
                                                            </Alert>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p>No plagiarism detected.</p>
                                                )}
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            )
                        ))}
                    </Modal.Body>
                </Modal>

                <h4 className="text-lg font-semibold mb-4">Not Attended Students</h4>
                <ul className="list-disc pl-6">
                    {notAttended.map((regn, index) => (
                        <li key={index}>{regn}</li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="flex">
            <Dashboard name={Teacher} role={"Teacher"} />
            <div className="flex-1 p-8">
                <h2 className="text-2xl font-bold mb-4">View Test Analytics</h2>
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        <select onChange={handleQuizChange} value={selectedQuizId} className="border p-2 mb-4">
                            <option value="">Select a quiz</option>
                            {quizQuestionData.map((quiz) => (
                                <option key={quiz._id} value={quiz._id}>
                                    {quiz.quizName}
                                </option>
                            ))}
                        </select>

                        {renderReport()}
                    </>
                )}
            </div>
        </div>
    );
}

export default ViewTestAnalytics;
