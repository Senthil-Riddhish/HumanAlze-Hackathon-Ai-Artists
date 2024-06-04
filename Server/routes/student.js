import express from "express"
import { addStudent, getStudents, getStudentData, signup,login, deleteStudent,studentQuizStatus,getQuizDetails,submitQuiz,getstudentresult,getStudentmarks} from "../controllers/student.js"


const router = express.Router()

router.post('/signup', signup);
router.post('/login', login);
router.post('/add-student', addStudent);
router.get('/get-students', getStudents);
router.get('/get-student-data', getStudentData);
router.delete('/delete-student', deleteStudent);
router.get('/studentpage/:regn',studentQuizStatus);
router.get('/test/:quizId',getQuizDetails);
router.post('/getstudentresult',getstudentresult);
router.post('/submit-quiz/:quizId', submitQuiz);
router.get('/details/:regno',getStudentmarks)

export default router