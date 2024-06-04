import { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Button, Modal } from 'react-bootstrap';
import { API_ENDPOINT } from "../constants";
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';
import React from 'react';

const QuizList1 = ({ quizzes, onQuizClick, data }) => {
    const [recommendations, setRecommendations] = useState({});
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedQuizRecommendations, setSelectedQuizRecommendations] = useState({});
    const [selectedQuizId, setSelectedQuizId] = useState(null);
    const [quizMark, setQuizmark] = useState({});
    useEffect(() => {
        const fetchRecommendations = async () => {
            const fetchedRecommendations = {};
            const fetchquizMark = {};
            if (data && data.quizAnswer && Array.isArray(data.quizAnswer)) {
                await Promise.all(data.quizAnswer.map(async quiz => {
                    const quizId = Object.keys(quiz)[0];
                    const matchingQuiz = quizzes.find(element => element._id === quizId);
                    if (matchingQuiz) {
                        let totalMarks = 0
                        quiz[quizId].quizDetails.forEach(element => {
                            totalMarks = totalMarks + parseFloat(element.marks)
                        });
                        fetchquizMark[quizId] = totalMarks;
                        console.log(quizId,totalMarks);
                        try {
                            const response = await fetch(`${API_ENDPOINT}user/getrecommendations/${quizId}`, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                            });
                            if (response.ok) {
                                const result = await response.json();
                                fetchedRecommendations[quizId] = result;
                                console.log(result);
                            } else {
                                console.error('Failed to fetch recommendations', response.statusText);
                            }
                        } catch (error) {
                            console.error('Error fetching recommendations', error);
                        }
                    }
                }));
                setRecommendations(fetchedRecommendations);
                setQuizmark(fetchquizMark)
                setLoading(false);
            } else {
                setLoading(false); // Ensure loading is set to false if there's no data
            }
        };

        fetchRecommendations();
    }, [data, quizzes]);

    const handleShowRecommendations = (quizId) => {
        setSelectedQuizRecommendations(recommendations[quizId] || {});
        setSelectedQuizId(quizId);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedQuizRecommendations({});
        setSelectedQuizId(null);
    };

    if (loading) {
        return <Spinner animation="border" />;
    }

    return (
        <>
            <Row>
                {quizzes.length === 0 ? (
                    <Col>
                        <p>No quizzes available</p>
                    </Col>
                ) : (
                    data.quizAnswer.map(quiz => {
                        const quizId = Object.keys(quiz)[0];
                        const matchingQuiz = quizzes.find(element => element._id === quizId);
                        if (matchingQuiz) {
                            return (
                                <Col key={quizId} sm={12} md={6} lg={4} className="mb-4">
                                    <Card>
                                        <Card.Body onClick={() => onQuizClick(quizId)}>
                                            <Card.Title>{matchingQuiz.quizName.toUpperCase()}</Card.Title>
                                            <Card.Text>{matchingQuiz.description}</Card.Text>
                                            <Card.Subtitle>
                                                <Badge pill bg="warning" text="dark">
                                                    Mark : {quiz[quizId].totalMark} / {quizMark[quizId]}
                                                </Badge>
                                            </Card.Subtitle>
                                        </Card.Body>
                                        <Button onClick={() => handleShowRecommendations(quizId)}>
                                            Show Recommendations
                                        </Button>
                                    </Card>
                                </Col>
                            );
                        }
                        return null;
                    })
                )}
            </Row>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Recommendations for Quiz</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <strong>Top Recommendations : </strong>
                    {selectedQuizRecommendations.good?.map(rec => (
                        <div key={rec._id}>
                            <a href={rec.link} target="_blank" rel="noopener noreferrer">
                                {rec.title}
                            </a>
                            <p>{rec.description}</p>
                        </div>
                    )) || 'Not Recommended For You'}
                    <div className='mb-2'></div>
                    <strong>Intermediate Recommendations : </strong>
                    {selectedQuizRecommendations.average?.map(rec => (
                        <div key={rec._id}>
                            <a href={rec.link} target="_blank" rel="noopener noreferrer">
                                {rec.title}
                            </a>
                            <p>{rec.description}</p>
                        </div>
                    )) || 'Not Recommended For You'}
                    <div className='mb-2'></div>
                    <strong>Average Recommendations : </strong>
                    {selectedQuizRecommendations.bad?.map(rec => (
                        <div key={rec._id}>
                            <a href={rec.link} target="_blank" rel="noopener noreferrer">
                                {rec.title}
                            </a>
                            <p>{rec.description}</p>
                        </div>
                    )) || 'Not Recommended For You'}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default QuizList1;
