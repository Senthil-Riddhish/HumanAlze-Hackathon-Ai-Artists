import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_ENDPOINT } from "../constants";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { MdDelete } from "react-icons/md";
import Example from "../components/Example";
import Updatequiz from "../components/Updatequiz";

const QuizDetail = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [error, setError] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [recommendations, setRecommendations] = useState({ good: [], average: [], bad: [] });
    const [show, setShow] = useState(false);
    const [showRecommendation, setShowRecommendation] = useState(false);
    const [recommendationCategory, setRecommendationCategory] = useState('good');
    const [recommendationTitle, setRecommendationTitle] = useState('');
    const [recommendationLink, setRecommendationLink] = useState('');
    const [recommendationDescription, setRecommendationDescription] = useState('');
    const [questionType, setQuestionType] = useState('');
    const [numOptions, setNumOptions] = useState(0);
    const [options, setOptions] = useState([]);
    const [marks, setMarks] = useState(0);
    const [questionText, setQuestionText] = useState('');
    const [correctOption, setCorrectOption] = useState('');
    const [numberofQuestions, setnumberofQuestions] = useState('0');
    const [switchclick, setSwitchclick] = useState(false);
    let data = {};

    useEffect(() => {
        const fetchQuizDetail = async () => {
            try {
                const response = await fetch(`${API_ENDPOINT}user/getquiz/${quizId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    const text = await response.text();
                    console.error("Error fetching quiz detail:", text);
                    setError('Network response was not ok');
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                console.log("page lad : ", result.quiz);
                setQuiz(result.quiz);
                setQuizzes(result.quiz.questions);
                setRecommendations(result.quiz.recommendations || { good: [], average: [], bad: [] });
                setnumberofQuestions(result.quiz.numberofQuestions.toString());
            } catch (error) {
                console.error("Error fetching quiz detail:", error);
                setError('Failed to fetch quiz details');
            }
        };

        fetchQuizDetail();
    }, [quizId]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!quiz) {
        return <div>Loading...</div>;
    }

    const handleQuestionTypeSelect = (type) => {
        setQuestionType(type);
        if (type === "MCQ" || type === "MAQ") {
            setNumOptions(0); // Default to 4 options for MCQ and MAQ
        } else {
            setNumOptions(0);
        }
    };

    const handleNumOptionsSubmit = () => {
        let array = [];
        for (let i = 0; i < numOptions; i++) {
            array.push('');
        }
        setOptions(array);
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = async () => {
        if (questionType === "MCQ" || questionType === "MAQ") {
            data = {
                questionText,
                options,
                correctOption,
                questionType,
                marks
            };
        }
        if (questionType === "Essay") {
            data = {
                questionText,
                questionType,
                marks,
                switchclick
            };
            console.log({
                questionText,
                questionType,
                marks,
                switchclick
            });
            console.log("essay data : ", data);
        }

        setShow(false);
        setQuestionType('');
        setNumOptions(0);
        setOptions([]);
        setMarks(0);
        setQuestionText('');
        setCorrectOption('');
        setSwitchclick(false);

        try {
            const response = await fetch(`${API_ENDPOINT}user/addquestion/${quizId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Error adding question:", text);
                setError('Network response was not ok');
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log("submit result : ", result);
            setQuizzes(result.questions);
            setnumberofQuestions((parseInt(numberofQuestions) + 1).toString());
        } catch (error) {
            console.error("Error adding question:", error);
            setError('Failed to add question');
        }
    };

    const handleRecommendationSubmit = async () => {
        const newRecommendation = {
            title: recommendationTitle,
            link: recommendationLink,
            description: recommendationDescription,
        };

        const updatedRecommendations = {
            ...recommendations,
            [recommendationCategory]: [...recommendations[recommendationCategory], newRecommendation],
        };
        setRecommendations(updatedRecommendations);
        try {
            const response = await fetch(`${API_ENDPOINT}user/updaterecommendations/${quizId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedRecommendations)
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Error updating recommendations:", text);
                setError('Network response was not ok');
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log("Updated recommendations:", result);
        } catch (error) {
            console.error("Error updating recommendations:", error);
            setError('Failed to update recommendations');
        }

        setShowRecommendation(false);
        setRecommendationTitle('');
        setRecommendationLink('');
        setRecommendationDescription('');
    };

    const handleDeleteRecommendation = async (category, index) => {
        const updatedCategory = [...recommendations[category]];
        updatedCategory.splice(index, 1);

        const updatedRecommendations = {
            ...recommendations,
            [category]: updatedCategory,
        };
        console.log(updatedRecommendations);
        setRecommendations(updatedRecommendations);
        try {
            const response = await fetch(`${API_ENDPOINT}user/updaterecommendations/${quizId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedRecommendations)
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Error deleting recommendation:", text);
                setError('Network response was not ok');
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log("Delete recommendations:", result);
        } catch (error) {
            console.error("Error deleting recommendation:", error);
            setError('Failed to delete recommendation');
        }
    };

    function handleShow() {
        setShow(true);
        setQuestionType('');
        setNumOptions(0);
        setOptions([]);
        setMarks(0);
        setQuestionText('');
        setCorrectOption('');
        setSwitchclick(false);
    }

    function handleShowRecommendation() {
        setShowRecommendation(true);
    }

    function handleView(index) {
        console.log(index);
    }

    const handleDelete = async (index) => {
        try {
            const response = await fetch(`${API_ENDPOINT}user/deletequestion/${index}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quizId })
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Error deleting question:", text);
                setError('Network response was not ok');
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log("Delete result:", result);
            setQuizzes(result.questions);
            setnumberofQuestions((parseInt(numberofQuestions) - 1).toString());
        } catch (error) {
            console.error("Error deleting question:", error);
            setError('Failed to delete question');
        }
    };

    const handleSwitchChange = (event) => {
        if (event.target.checked) {
            setSwitchclick(true);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{quiz.quizName}</h1>
            <p><strong>Quiz Description:</strong> {quiz.quizDesc}</p>
            <p><strong>Number of Questions:</strong> {numberofQuestions}</p>
            <Button className="mb-4" onClick={handleShow}>Add Question</Button>
            <Button className="mb-4 ms-2" onClick={handleShowRecommendation}>Add Recommendation</Button>

            <div>
                {quizzes.length > 0 ? (
                    <Row xs={1} md={3} className="g-4">
                        {quizzes.map((q, idx) => (
                            <Col key={idx} id={`${idx}`}>
                                <Card>
                                    <Card.Body>
                                        <Card.Title>Question {idx + 1}</Card.Title>
                                        <div className="d-flex align-items-center">
                                            <Updatequiz
                                                index={idx}
                                                quiz={quizzes[idx]}
                                                quizid={quizId}
                                                setQuizzes={setQuizzes}
                                            />
                                            <Button className="mr-1">
                                                <Example index={idx} quiz={quizzes[idx]} />
                                            </Button>
                                            <Button onClick={() => handleDelete(idx)}> <MdDelete /></Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                ) : (
                    <p>No Questions Added.</p>
                )}
            </div>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Question No: {quizzes.length + 1}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Type of Question
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleQuestionTypeSelect('MCQ')}>MCQ</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleQuestionTypeSelect('MAQ')}>MAQ</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleQuestionTypeSelect('Essay')}>Essay/Paragraph writing</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    {(
                        <Form.Group className="mt-3">
                            {(questionType === 'MCQ' || questionType === 'MAQ') && (
                                <>
                                    <Form.Label className="me-2">Number of Options : </Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={numOptions}
                                        onChange={(e) => setNumOptions(e.target.value)}
                                        min="2"
                                        max="10"
                                        className="d-inline-block w-auto me-2"
                                    />
                                </>
                            )}
                            {(questionType.length > 0) && (
                                <>
                                    <Form.Label className="me-2">Marks Alloted : </Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={marks}
                                        onChange={(e) => setMarks(e.target.value)}
                                        min="2"
                                        max="10"
                                        className="d-inline-block w-auto me-2"
                                    />
                                    {(questionType !== "Essay") && (
                                        <Button onClick={handleNumOptionsSubmit}>Submit</Button>
                                    )}
                                </>
                            )}
                        </Form.Group>
                    )}
                    {options.length > 0 && (
                        <>
                            <Form.Group className="mt-3">
                                <Form.Label>Type the Question</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={questionText}
                                    onChange={(e) => setQuestionText(e.target.value)}
                                />
                            </Form.Group>
                            {options.map((option, index) => (
                                <Form.Group key={index} className="mt-3">
                                    <Form.Label>Option {index + 1}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                    />
                                </Form.Group>
                            ))}
                            <Form.Group className="mt-3">
                                <Form.Label>Which option is the right answer?</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={correctOption}
                                    onChange={(e) => setCorrectOption(e.target.value)}
                                    min="1"
                                    max={numOptions}
                                />
                            </Form.Group>
                            <div className="text-center mt-3">
                                <Button onClick={handleSubmit}>Submit</Button>
                            </div>
                        </>
                    )}
                    {(questionType === "Essay") && (
                        <>
                            <Form.Check // prettier-ignore
                                type="switch"
                                id="custom-switch"
                                label="Plagiarism Check"
                                onChange={handleSwitchChange}
                            />
                            <Form.Group className="mt-3">
                                <Form.Label>Type the Question</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={questionText}
                                    onChange={(e) => setQuestionText(e.target.value)}
                                />
                            </Form.Group>
                            <div className="text-center mt-3">
                                <Button onClick={handleSubmit}>Submit</Button>
                            </div>
                        </>
                    )}
                </Modal.Body>
            </Modal>
            <Modal show={showRecommendation} onHide={() => setShowRecommendation(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Recommendation Materials</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mt-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select value={recommendationCategory} onChange={(e) => setRecommendationCategory(e.target.value)}>
                            <option value="good">Good</option>
                            <option value="average">Average</option>
                            <option value="bad">Bad</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={recommendationTitle}
                            onChange={(e) => setRecommendationTitle(e.target.value)}
                            placeholder="Enter the title"
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Link</Form.Label>
                        <Form.Control
                            type="url"
                            value={recommendationLink}
                            onChange={(e) => setRecommendationLink(e.target.value)}
                            placeholder="Enter the URL"
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={recommendationDescription}
                            onChange={(e) => setRecommendationDescription(e.target.value)}
                            placeholder="Enter the description"
                        />
                    </Form.Group>
                    <div className="text-center mt-3">
                        <Button onClick={handleRecommendationSubmit}>Add Recommendation</Button>
                    </div>
                </Modal.Body>
            </Modal>
            <div className="mt-4">
                <h2>Recommendations</h2>
                {["good", "average", "bad"].map((category) => (
                    <div key={category} className="mb-4">
                        <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                        {recommendations[category].length > 0 ? (
                            recommendations[category].map((rec, index) => (
                                <Card key={index} className="mb-2">
                                    <Card.Body>
                                        <Card.Title>{rec.title}</Card.Title>
                                        <Card.Text>
                                            <a href={rec.link} target="_blank" rel="noopener noreferrer">{rec.link}</a>
                                            <p>{rec.description}</p>
                                        </Card.Text>
                                        <Button variant="danger" onClick={() => handleDeleteRecommendation(category, index)}>
                                            <MdDelete />
                                        </Button>
                                    </Card.Body>
                                </Card>
                            ))
                        ) : (
                            <p>No recommendations in this category.</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizDetail;
