import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Form } from 'react-bootstrap';
import { API_ENDPOINT } from '../constants';

const QuizPlatform = () => {
    const { quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`${API_ENDPOINT}student/test/${quizId}`);
                const data = await response.json();
                console.log(data);
                setQuiz(data);
                setAnswers(new Array(data.questions.length).fill(null)); // Initialize answers array
            } catch (error) {
                console.error('Error fetching quiz details:', error);
            }
        };

        fetchQuiz();
    }, [quizId]);

    const handleAnswerChange = (index, answer) => {
        const newAnswers = [...answers];
        newAnswers[index] = answer;
        setAnswers(newAnswers);
    };

    const handleNextQuestion = () => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
    };

    const handleSubmitQuiz = async () => {
        // Compile answers into the required format
        const compiledAnswers = quiz.questions.map((question, index) => ({
            questionText: question.questionText,
            questionType: question.questionType,
            answer: question.questionType === 'MCQ' ? answers[index] : answers[index]
        }));

        // Count correct answers for MCQ type questions
        let correctAnswerCount = 0;
        compiledAnswers.forEach((answer, index) => {
            if (answer.questionType === 'MCQ' && answers[index] === quiz.questions[index].correctOption) {
                correctAnswerCount++;
            }
        });

        // Process Essay questions with Flask server
        for (let i = 0; i < compiledAnswers.length; i++) {
            if (compiledAnswers[i].questionType === 'Essay') {
                try {
                    const response = await fetch('http://127.0.0.1:5000/grammerpredict', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ text: compiledAnswers[i].answer }),
                    });
                    const data = await response.json();
                    compiledAnswers[i].answer = data[0]; // Assuming the Flask server returns a list with a single element
                } catch (error) {
                    console.error('Error processing essay question:', error);
                }
            }
        }

        console.log("compiledAnswers : ", compiledAnswers); // Print the compiled answers in the desired format
        console.log("correctAnswerCount : ", correctAnswerCount); // Print the count of correct answers

        try {
            const response = await fetch(`${API_ENDPOINT}student/submit-quiz`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quizId, answers: compiledAnswers, correctAnswerCount }),
            });
            if (response.ok) {
                alert('Quiz submitted successfully!');
                navigate('/student-profile');
            } else {
                const errorData = await response.json();
                alert(`Error submitting quiz: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    };

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
                                    value={index}
                                    checked={answers[currentQuestionIndex] === index}
                                    onChange={() => handleAnswerChange(currentQuestionIndex, index)}
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
