import express from "express";
import cors from "cors"
import mongoose from "mongoose"
import userRoutes from "./routes/user.js"
import classRoutes from "./routes/class.js"
import studentRoutes from "./routes/student.js"
import dotenv from 'dotenv';
dotenv.config();

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

app.use("/user", userRoutes)
app.use("/class", classRoutes)
app.use("/student", studentRoutes)

app.get("/", (req, res) => {
    res.send("Student Progress Analyzer API")
});



const CONNECTION_URL = "mongodb+srv://riddhishwar:4eYSaL5U7NpFEId9@cluster0.son3w.mongodb.net/"
const PORT = 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    }))
    .catch(err => console.log(err.message))







