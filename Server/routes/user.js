import express from "express"
import { teacherSignup, teacherLogin } from "../controllers/teacher.js"
import { createQuiz,getTeacherQuizzes,retrievequiz,quizHeading,addQuestion,deleteQuestion,updateQuestion,allocateQuiz,teacherName } from "../controllers/quiz.js";

const router = express.Router()

router.post('/teacher-signup', teacherSignup);
router.post('/teacher-login', teacherLogin);
router.post('/create-quiz', createQuiz);
router.get('/getquiz/:quizId',retrievequiz);
router.get('/allquiz/:teacherId',getTeacherQuizzes);
router.post('/addquestion/:quizId',addQuestion);
router.delete('/deletequestion/:index',deleteQuestion);
router.put('/updatequestion',updateQuestion);
router.get('/quizzes/:teacherId',quizHeading);
router.post('/allocatequiz',allocateQuiz);
router.get('/getteacherName/:id',teacherName);
export default router