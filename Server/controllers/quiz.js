// controllers/quiz.js
import express from "express"
import Quiz from "../models/quiz.js";
import Teacher from "../models/teacher.js";
import mongoose from 'mongoose';
const router = express.Router()

export const createQuiz = async (req, res) => {
    console.log(req.body);
    const { teacherId, quizName, description, numberofQuestions } = req.body;

    try {
        const newQuiz = await Quiz.create({
            teacherId,
            quizName,
            description,
            numberofQuestions
        });

        await Teacher.findByIdAndUpdate(teacherId, {
            $push: { quizList: newQuiz._id }
        });

        res.json({ message: 'Quiz created successfully', quiz: newQuiz });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
};


export const getTeacherQuizzes = async (req, res) => {
    console.log("retrieve request fetched...");
    const { teacherId } = req.params;

    try {
        // Find the teacher by ID and get their quiz list
        const teacher = await Teacher.findById(teacherId).exec();
        console.log(teacher);
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        // Get the list of quiz IDs
        const quizIds = teacher.quizList;

        if (!quizIds.length) {
            return res.json({ 'QuizInformation': [] });
        }

        // Fetch all quizzes that match the quiz IDs
        const quizzes = await Quiz.find({ _id: { $in: quizIds } }).exec();
        console.log(quizzes);
        return res.json({ 'QuizInformation': quizzes });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'An error occurred' });
    }
};

export const retrievequiz=async (req, res) => {
    try {
        // Extract the quizId from request parameters
        const { quizId } = req.params;

        // Find the quiz by quizId in the database
        const quiz = await Quiz.findById(quizId);

        // If quiz is found, send it in the response
        if (quiz) {
            res.json({ quiz });
        } else {
            // If quiz is not found, send a 404 Not Found response
            res.status(404).json({ message: "Quiz not found" });
        }
    } catch (error) {
        // If any error occurs, send a 500 Internal Server Error response
        console.error("Error fetching quiz detail:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const addQuestion=async (req, res) => {
    console.log("adding Question...");
    const { quizId } = req.params;
    const { questionText, options, correctOption, questionType, marks } = req.body;

    try {
        // Find the quiz by ID
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // Create the new question
        const newQuestion = {
            questionText,
            options,
            correctOption,
            questionType,
            marks
        };

        // Add the question to the quiz
        quiz.questions.push(newQuestion);

        // Update the number of questions
        quiz.numberofQuestions = quiz.questions.length;

        // Save the updated quiz
        await quiz.save();
        console.log(quiz);
        res.status(201).json({ questions: quiz.questions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
};

export const deleteQuestion = async (req, res) => {
    const { index } = req.params;
    const { quizId } = req.body;

    try {
        // Find the quiz by ID
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // Remove the question at the specified index
        quiz.questions.splice(index, 1);

        // Save the updated quiz document
        await quiz.save();

        // Send the updated list of questions back to the client
        res.status(200).json({ questions: quiz.questions });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ error: 'Failed to delete question' });
    }
};

export const updateQuestion = async (req, res) => {
    console.log(req.body);
    const { 
        questionText,
        options,
        correctOption,
        marks,
        index,
        quizid
    } = req.body;

    const questionIndex = parseInt(index, 10); // Convert index to integer

    try {
        // Check if quizid is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(quizid)) {
            return res.status(400).json({ error: 'Invalid quiz ID' });
        }

        // Create the update object
        const update = {
            $set: {
                [`questions.${questionIndex}.questionText`]: questionText,
                [`questions.${questionIndex}.options`]: options,
                [`questions.${questionIndex}.correctOption`]: correctOption,
                [`questions.${questionIndex}.marks`]: marks
            }
        };

        // Update the specific question in the quiz
        const result = await Quiz.updateOne({ _id: quizid }, update);

        if (result.nModified === 0) {
            return res.status(404).json({ error: 'Quiz not found or question not updated' });
        }

        // Find the updated quiz to return the updated questions
        const updatedQuiz = await Quiz.findById(quizid);
        res.json({ message: 'Question updated successfully', questions: updatedQuiz.questions });
    } catch (error) {
        console.error("Error updating question:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
