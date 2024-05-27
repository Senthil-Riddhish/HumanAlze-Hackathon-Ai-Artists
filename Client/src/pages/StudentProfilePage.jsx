import {useNavigate} from "react-router-dom";
import Dashboard from "../components/Dashboard";
import { useEffect, useState } from "react";
import jwt from "jwt-decode";

const StudentProfilePage = () => {
    const [student, setStudent] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("studentToken");
        if (token) {
            const studentToken = jwt(token);
            const studentName = studentToken.name;
            console.log(studentName)
            setStudent(studentName);
          } else {
            navigate("/");
          }
    }, [navigate])

    return (
        <div className="flex ">
            <Dashboard name={student} role={"Student"} />
        </div>
    );
}

export default StudentProfilePage;