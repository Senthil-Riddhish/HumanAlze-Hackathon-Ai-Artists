import React, { useState } from 'react';
import { FaPencilAlt } from "react-icons/fa";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { API_ENDPOINT } from "../constants";

function Updatequiz({ index, quiz, quizid, setQuizzes }) {
    const values = [true];
    const [fullscreen, setFullscreen] = useState(true);
    const [show, setShow] = useState(false);
    const [questionText, setQuestionText] = useState(quiz.questionText);
    const [options, setOptions] = useState(quiz.options || []);
    const [correctOption, setCorrectOption] = useState(quiz.correctOption);
    const [marks, setMarks] = useState(quiz.marks);
    const [questionType, setQuestionType] = useState(quiz.questionType);
    const [switchclick, setSwitchclick] = useState(quiz.switchclick || false);

    let updatedQuiz = {};

    function handleShow(breakpoint) {
        setFullscreen(breakpoint);
        setShow(true);
        setQuestionText(quiz.questionText);
        setOptions(quiz.options || []);
        setCorrectOption(quiz.correctOption);
        setMarks(quiz.marks);
        setQuestionType(quiz.questionType);
        setSwitchclick(quiz.switchclick || false);
    }

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleUpdate = async () => {
        console.log("update : ", index, quizid);
        if (quiz.questionType === "Essay") {
            updatedQuiz = {
                questionType,
                questionText,
                marks,
                index,
                quizid,
                switchclick
            };

        } else {
            updatedQuiz = {
                questionType,
                questionText,
                options,
                correctOption,
                marks,
                index,
                quizid
            };
        }

        try {
            const response = await fetch(`${API_ENDPOINT}user/updatequestion`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedQuiz)
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Error updating question:", text);
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log("Update result:", result);
            // Handle the update success (e.g., update the state or notify the user)
            setQuizzes(result.questions);

        } catch (error) {
            console.error("Error updating question:", error);
        }

        setShow(false);
    };

    const handleSwitch = (event) => {
        setSwitchclick(event.target.checked);
    };

    return (
        <>
            <div className="d-flex align-items-center">
                {values.map((v, idx) => (
                    <Button key={idx} className="mr-1" onClick={() => handleShow(v)}>
                        <FaPencilAlt />
                        {typeof v === 'string' && `below ${v.split('-')[0]}`}
                    </Button>
                ))}
            </div>
            <Modal show={show} fullscreen={fullscreen} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Question {index + 1}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mt-3">
                        {
                            (questionType === "Essay") && (
                                <Form.Check
                                    type="switch"
                                    id="custom-switch"
                                    label="Plagiarism Check"
                                    onChange={handleSwitch}
                                    checked={switchclick} // Set the initial checked state
                                />
                            )
                        }
                        <Form.Label>Question Text</Form.Label>
                        <Form.Control
                            type="text"
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                        />
                    </Form.Group>
                    {(questionType === 'MCQ' || questionType === 'MAQ') && options.map((option, idx) => (
                        <Form.Group key={idx} className="mt-3">
                            <Form.Label>Option {idx + 1}</Form.Label>
                            <Form.Control
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(idx, e.target.value)}
                            />
                        </Form.Group>
                    ))}
                    {(questionType === 'MCQ' || questionType === 'MAQ') && (
                        <Form.Group className="mt-3">
                            <Form.Label>Correct Option</Form.Label>
                            <Form.Control
                                type="text"
                                value={correctOption}
                                onChange={(e) => setCorrectOption(e.target.value)}
                            />
                        </Form.Group>
                    )}
                    <Form.Group className="mt-3">
                        <Form.Label>Marks</Form.Label>
                        <Form.Control
                            type="number"
                            value={marks}
                            onChange={(e) => setMarks(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Updatequiz;
