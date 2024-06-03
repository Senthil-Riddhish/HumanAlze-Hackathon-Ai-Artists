import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINT } from "../constants";
import Dashboard from "../components/Dashboard";
import jwt from "jwt-decode";
import { Pie, Bar } from "react-chartjs-2";

function ViewTestAnalytics() {
    const [Teacher, setTeacher] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [quizQuestionData, setQuizQuestionData] = useState([]);
    const [selectedQuizId, setSelectedQuizId] = useState("");
    const [studentStatus, setStudentStatus] = useState(null);
    const [quizTotalMark, setQuizTotalMark] = useState(0);
    const [chosedQuiz, setChosedQuiz] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("user");
        if (token) {
            const user = jwt(token);
            const userName = user.name;
            setTeacher(userName);
            const fetchTests = async () => {
                try {
                    const response = await fetch(`${API_ENDPOINT}user/allquiz/${localStorage.getItem('userID')}`, {
                        method: "GET",
                        headers: {
                            "Content-type": "application/json",
                        },
                    });

                    const tests = await response.json();

                    if (tests) setQuizQuestionData(tests.QuizInformation);
                    console.log(tests);
                } catch (error) {
                    console.error(error);
                }
            };

            fetchTests();
        } else {
            navigate("/");
        }
    }, [navigate]);

    const handleQuizChange = (event) => {
        const selectedQuizId = event.target.value;
        setSelectedQuizId(selectedQuizId);

        const selectedQuiz = quizQuestionData.find(quiz => quiz._id === selectedQuizId);
        console.log(selectedQuiz);
        let total = 0.0;
        selectedQuiz.questions.forEach(element => {
            total = total + parseFloat(element.marks);
        });
        setQuizTotalMark(total);
        setChosedQuiz(selectedQuiz);
        if (selectedQuiz) {
            const fetchstudents = async () => {
                try {
                    const response = await fetch(`${API_ENDPOINT}user/fetchstudents/${selectedQuiz._id}`, {
                        method: "GET",
                        headers: {
                            "Content-type": "application/json",
                        },
                    });

                    const studentstatus = await response.json();
                    setStudentStatus(studentstatus);
                    console.log(studentstatus);
                } catch (error) {
                    console.error(error);
                }
            };

            fetchstudents();
        }
    };

    const renderReport = () => {
        if (!studentStatus) {
            return <div>Please select a quiz to view the report.</div>;
        }

        const { attended, notAttended } = studentStatus;

        const attendanceData = {
            labels: ['Attended', 'Not Attended'],
            datasets: [{
                data: [attended.length, notAttended.length],
                backgroundColor: ['#36A2EB', '#FF6384']
            }]
        };

        const marksData = {
            labels: attended.map(student => student.regn),
            datasets: [{
                label: 'Total Marks',
                data: attended.map(student => student.totalMark),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };

        return (
            <div className="report">
                <h3 className="text-xl font-bold mb-4">Quiz Report</h3>
                <h2 className="text-xl font-bold mb-4">Quiz Name : {chosedQuiz.quizName}</h2>
                <h2 className="text-xl font-bold mb-4">Total Mark : {quizTotalMark}</h2>
                <h4 className="text-lg font-semibold mb-4">Attendance</h4>
                <div className="mb-4" style={{ width: '400px', height: '400px' }}>
                    <Pie data={attendanceData} />
                </div>
                <h4 className="text-lg font-semibold mb-4">Marks Distribution</h4>
                <div className="mb-4" style={{ width: '600px', height: '400px' }}>
                    <Bar data={marksData} options={{
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }} />
                </div>
                <h4 className="text-lg font-semibold mb-4">Attended Students</h4>
                <table className="table-auto w-full mb-4">
                    <thead>
                        <tr>
                            <th className="border px-4 py-2">Reg. No</th>
                            <th className="border px-4 py-2">Total Marks</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attended.map((student, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{student.regn}</td>
                                <td className="border px-4 py-2">{student.totalMark}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h4 className="text-lg font-semibold mb-4">Not Attended Students</h4>
                <ul className="list-disc pl-6">
                    {notAttended.map((regn, index) => (
                        <li key={index}>{regn}</li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        <div className="flex">
            <Dashboard name={Teacher} role={"Teacher"} />
            <div className="flex-1 p-8">
                <h2 className="text-2xl font-bold mb-4">View Test Analytics</h2>
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        <select onChange={handleQuizChange} value={selectedQuizId} className="border p-2 mb-4">
                            <option value="">Select a quiz</option>
                            {quizQuestionData.map((quiz) => (
                                <option key={quiz._id} value={quiz._id}>
                                    {quiz.quizName}
                                </option>
                            ))}
                        </select>

                        {renderReport()}
                    </>
                )}
            </div>
        </div>
    );
}

export default ViewTestAnalytics;
