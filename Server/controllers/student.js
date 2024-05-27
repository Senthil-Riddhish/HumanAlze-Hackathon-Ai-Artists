import Student from "../models/student.js";
import fetch from "node-fetch"
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    try {
      const { name, email, regno, password } = req.body;
      console.log("student signup...");
      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const newStudent = new Student({ name, email, regno, password });
      await newStudent.save();
      res.status(201).json({ message: 'ok' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
export const login = async (req, res) => {
    try {
      const { regno, password } = req.body;
      const student = await Student.findOne({ regno });
      if (!student) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
      const token = jwt.sign({
        name: student.name,
        studentId: student._id
    }, 'secret123')
      res.json({ message: 'ok', token, studentId: student._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

export const addStudent = async (req, res) => {
    try {
        const { studentName, rollNumber, studentClass, studentClassId, marks, defaulter } = req.body;

        const existingStudent = await Student.findOne({ rollNumber, studentClassId });
        if (existingStudent) {
            return res.status(400).json({ message: 'A student with the same roll number already exists in this class' });
        }

        const Defaulter = defaulter === "Yes" ? '1' : '0'
        console.log(Defaulter)

        const marksArray = Object.values(marks)
        const sum = marksArray.reduce((acc, curr) => acc + parseInt(curr), 0);
        const sgpi = (sum / 500 * 10).toFixed(2)

        const dataFrame = {
            "Defaulter": Defaulter,
            "DMBI_ESE": marksArray[0],
            "WEBX_ESE": marksArray[1],
            "DS_ESE": marksArray[2],
            "WT_ESE": marksArray[3],
            "GIT_ESE": marksArray[4],
            "SGPI_(GPA)": sgpi
        }
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataFrame)
        });
        const result = await response.json();
        console.log(result)
        let prediction = ""

        if (result[0] == "1") {
            prediction = "Good Performer"
        }
        else if (result[0] == "2") {
            prediction = "Average Performer"
        }
        else if (result[0] == "3") {
            prediction = "Slow Performer"
        }


        const newStudent = new Student({
            studentName,
            rollNumber,
            studentClass,
            studentClassId,
            marks,
            sgpi,
            defaulter,
            prediction: prediction
        });

        const savedStudent = await newStudent.save();

        res.status(201).json({ message: 'Student Added Successfully', savedStudent }); // Return the saved student document as JSON
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding student to database' });
    }
};

export const getStudents = async (req, res) => {
    const studentClassId = req.query.classId;
    try {
        const students = await Student.find({ studentClassId });
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const getStudentData = async (req, res) => {
    const studentId = req.query.studentId;
    try {
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

export const deleteStudent = async (req, res) => {
    const studentId = req.query.studentId;

    try {
        const deletedStudent = await Student.findByIdAndDelete(studentId);

        if (!deletedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({ message: 'Student deleted successfully', status: 'ok' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}

