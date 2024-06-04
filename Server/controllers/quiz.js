// controllers/quiz.js
import express from "express"
import Quiz from "../models/quiz.js";
import Teacher from "../models/teacher.js";
import mongoose from 'mongoose';
import QuizStudent from '../models/QuizStudent.js';
import StudentQuizStatus from '../models/StudentQuizStatus.js';
import QuizRecommendation from "../models/QuizRecommendationSchema.js";
const router = express.Router()

export const createQuiz = async (req, res) => {
    console.log(req.body);
    const { teacherId, quizName, description} = req.body;

    try {
        const newQuiz = await Quiz.create({
            teacherId,
            quizName,
            description
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

export const retrievequiz = async (req, res) => {
    try {
        const { quizId } = req.params;

        // Find the quiz by quizId in the database
        let quiz = await Quiz.findById(quizId);

        // Find the recommendations by quizId in the database
        const recommend = await QuizRecommendation.findOne({ quizId: quizId });

        // Attach recommendations to the quiz object if found
        if (recommend) {
            quiz = quiz.toObject(); // Convert mongoose document to plain JS object
            quiz.recommendations = {
                good: recommend.good,
                average: recommend.average,
                bad: recommend.bad
            };
        }

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


export const addQuestion = async (req, res) => {
    console.log("adding Question...", req.body);
    const { quizId } = req.params;
    const { questionType, questionText, options, correctOption, marks, switchclick } = req.body;

    let newQuestion = {};

    try {
        // Find the quiz by ID
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        // Create the new question
        if (questionType == 'MCQ' || questionType == 'MAQ') {
            newQuestion = {
                questionText,
                options,
                correctOption,
                questionType,
                marks
            };
        } else if (questionType == 'Essay') {
            newQuestion = {
                questionText,
                questionType,
                marks,
                switchclick
            };
            console.log(newQuestion);
        }

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
        quiz.numberofQuestions = quiz.questions.length;
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
    const { questionType, questionText, options, correctOption, marks, switchclick, index, quizid } = req.body;

    try {
        // Check if quizid is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(quizid)) {
            return res.status(400).json({ error: 'Invalid quiz ID' });
        }
        console.log("upadted...");
        const questionIndex = parseInt(index, 10); // Convert index to integer

        // Create the update object based on question type
        let update;
        if (questionType == 'MCQ' || questionType == 'MAQ') {
            update = {
                $set: {
                    [`questions.${questionIndex}.questionText`]: questionText,
                    [`questions.${questionIndex}.options`]: options,
                    [`questions.${questionIndex}.correctOption`]: correctOption,
                    [`questions.${questionIndex}.marks`]: marks
                }
            };
        } else if (questionType == 'Essay') {
            update = {
                $set: {
                    [`questions.${questionIndex}.questionText`]: questionText,
                    [`questions.${questionIndex}.marks`]: marks,
                    [`questions.${questionIndex}.switchclick`]: switchclick
                }
            };
        } else {
            return res.status(400).json({ error: 'Invalid question type' });
        }

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
}

export const quizHeading = async (req, res) => {
    const { teacherId } = req.params;
    console.log(teacherId);
    try {
        // Find quizzes by teacher ID
        const quizzes = await Quiz.find({ teacherId });
        console.log(quizzes);
        // Check if quizzes exist
        if (!quizzes) {
            return res.status(404).json({ message: 'No quizzes found for this teacher' });
        }

        // Create a list of quiz details
        const list = quizzes.map(quiz => ({
            _id: quiz._id,
            quizName: quiz.quizName
        }));
        return res.json({data: list});
    } catch (error) {
        console.error('Error fetching quizzes:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const allocateQuiz=async(req,res)=>{
    const { quizId, studentRegno } = req.body;

    try {
        let quizStudent = await QuizStudent.findOne({ quizId });

        if (quizStudent) {
            // Check if the student registration number already exists in the array
            const existingStudent = quizStudent.studentRegnArray.find(student => student.regn === studentRegno);
            if (!existingStudent) {
                quizStudent.studentRegnArray.push({ regn: studentRegno, status: false });
                await quizStudent.save();
            }
        } else {
            // If the document does not exist, create a new one
            quizStudent = new QuizStudent({
                quizId,
                studentRegnArray: [{ regn: studentRegno, status: false }]
            });
            await quizStudent.save();
        }

        // Update or create the student's quiz status
        let studentQuizStatus = await StudentQuizStatus.findOne({ studentRegn: studentRegno });

        if (studentQuizStatus) {
            // If the document exists, append the quiz ID to the incompleteQuizList array
            if (!studentQuizStatus.incompleteQuizList.includes(quizId)) {
                studentQuizStatus.incompleteQuizList.push(quizId);
                await studentQuizStatus.save();
            }
        } else {
            // If the document does not exist, create a new one
            studentQuizStatus = new StudentQuizStatus({
                studentRegn: studentRegno,
                incompleteQuizList: [quizId]
            });
            await studentQuizStatus.save();
        }

        res.status(200).json({ message: 'Quiz allocated to student successfully' });
    } catch (error) {
        console.error('Error allocating quiz to student:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const teacherName=(req,res)=>{
    const {id}=req.params;
    console.log(id);
    let teacher=Teacher.findById({_id:id});
    return res.status(200).json({_idteacher:teacher.name})
}

export const getrecommendations=async(req,res)=>{
    console.log("recommendations");
    try {
        const recommendations = await QuizRecommendation.findOne({ quizId: req.params.quizId });
        res.json(recommendations);
      } catch (error) {
        res.status(500).send('Server error');
      }
}

export const updaterecommendations=async(req,res)=>{
    try {
        const { good, average, bad } = req.body;
        let recommendations = await QuizRecommendation.findOne({ quizId: req.params.quizId });
    
        if (!recommendations) {
          recommendations = new QuizRecommendation({ quizId: req.params.quizId, good, average, bad });
        } else {
          recommendations.good = good;
          recommendations.average = average;
          recommendations.bad = bad;
        }
    
        await recommendations.save();
        res.json(recommendations);
      } catch (error) {
        res.status(500).send('Server error');
      }
}

export const deleterecommendation=async(req,res)=>{
    try {
        const { category, index } = req.body;
        const recommendations = await QuizRecommendation.findOne({ quizId: req.params.quizId });
    
        if (!recommendations) {
          return res.status(404).send('Recommendations not found');
        }
    
        recommendations[category].splice(index, 1);
        await recommendations.save();
    
        res.json(recommendations);
      } catch (error) {
        res.status(500).send('Server error');
      }
}

export const getstudentsDetail = async (req, res) => {
    const { quizId } = req.params;
    
    try {
        // Fetch the quiz student status based on the quizId
        let studentStatus = await QuizStudent.findOne({ quizId });
        
        if (!studentStatus) {
            return res.status(404).json({ message: "No student status found for the given quizId" });
        }

        const { studentRegnArray } = studentStatus;
        const notAttended = [];
        const attended = [];

        // Iterate over the studentRegnArray
        for (const student of studentRegnArray) {
            const { regn, status } = student;

            if (!status) {
                // If the student has not attended the quiz, add to notAttended list
                notAttended.push(regn);
            } else {
                // If the student has attended the quiz, fetch their quiz data
                const studentQuizStatus = await StudentQuizStatus.findOne({ studentRegn: regn });
                
                if (studentQuizStatus) {
                    // Extract quiz answer and details for the specific quizId
                    const { quizAnswer } = studentQuizStatus;

                    const quizData = quizAnswer.find(quiz => quiz[quizId]);
                    if (quizData) {
                        const { quizDetails,totalMark } = quizData[quizId];
                        attended.push({
                            regn,
                            quizId,
                            quizDetails,
                            totalMark
                        });
                    }
                }
            }
        }

        // Return the result
        res.status(200).json({
            notAttended,
            attended
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while fetching the student details" });
    }
};


