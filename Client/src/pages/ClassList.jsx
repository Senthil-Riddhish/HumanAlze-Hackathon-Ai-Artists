import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ClassBox from "../components/ClassBox";
import Dashboard from "../components/Dashboard";
import { API_ENDPOINT } from "../constants";
import jwt from "jwt-decode";
import { AiFillDelete } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";

function ClassList() {
  const [Teacher, setTeacher] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [allClassData, setAllClassData] = useState([]);
  const [allTestData, setAllTestData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      const user = jwt(token);
      const userName = user.name;
      setTeacher(userName);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const getAllClasses = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}class/get-all-class`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });

      const classes = await response.json();

      if (classes) {
        setAllClassData(classes);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAllTests = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}class/get-all-test/${localStorage.getItem('userID')}`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });

      const tests = await response.json();

      if (tests) {
        setAllTestData(tests);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllClasses();
    getAllTests();
  }, []);

  const deleteClass = async (classId) => {
    try {
      const response = await fetch(
        `${API_ENDPOINT}class/delete-class?classId=${classId}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        const error = await response.json();
        alert(error.error);
      }

      const result = await response.json();
      if (result.status === "ok") {
        getAllClasses();
      } else {
        alert(result.message);
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <div className="d-flex">
      <Dashboard name={Teacher} role={"Teacher"} />
      <Container className="mt-4">
        <h2 className="text-2xl font-bold mb-4">Classes</h2>
        <Row>
          {isLoading ? (
            <Spinner animation="border" className="mx-auto" />
          ) : allClassData.length !== 0 ? (
            allClassData.map((classData) => (
              <Col key={classData._id} md={4} className="mb-4">
                <ClassBox
                  classData={classData}
                  deleteClass={() => deleteClass(classData._id)}
                />
              </Col>
            ))
          ) : (
            <Col>
              <h2 className="text-center text-2xl font-bold">
                Please Add a Class First
              </h2>
            </Col>
          )}
        </Row>
        <h2 className="text-2xl font-bold mb-4 mt-4">Tests</h2>
        <Row>
          {isLoading ? (
            <Spinner animation="border" className="mx-auto" />
          ) : allTestData.length !== 0 ? (
            allTestData.map((testData) => (
              <Col key={testData._id} md={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title>
                      <Link to={`/teacher-create-test/quiz/${testData._id}`}>
                        {testData.quizName}
                      </Link>
                    </Card.Title>
                    <Card.Text>
                      <strong>Questions:</strong> {testData.numberofQuestions}
                    </Card.Text>
                    <Card.Text>
                      <strong>Created At:</strong> {testData.createdAt}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <h2 className="text-center text-2xl font-bold">
                Please Add a Test First
              </h2>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default ClassList;
