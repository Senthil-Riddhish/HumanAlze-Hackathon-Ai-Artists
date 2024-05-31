import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaEye } from "react-icons/fa";
import ListGroup from 'react-bootstrap/ListGroup';

function Example({ index, quiz }) {
    console.log(index, quiz);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <div className="d-flex align-items-center">
                <FaEye onClick={handleShow} />
            </div>

            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Question {index + 1}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {quiz.questionText}
                    <div>Marks : {quiz.marks}</div>
                    {
                        (quiz.questionType === "MCQ") && (quiz.options.length > 0) && (
                            <ListGroup as="ol" numbered className='pt-3'>
                               {
                                    quiz.options.map((list,key)=>(
                                        <ListGroup.Item as="li">{list}</ListGroup.Item>
                                    ))
                               } 
                            </ListGroup>
                        )
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary">Understood</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Example;
