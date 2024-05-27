import express from "express"
import { addStudent, getStudents, getStudentData, signup,login, deleteStudent } from "../controllers/student.js"


const router = express.Router()

router.post('/signup', signup);
router.post('/login', login);
router.post('/add-student', addStudent)
router.get('/get-students', getStudents)
router.get('/get-student-data', getStudentData)
router.delete('/delete-student', deleteStudent)

export default router