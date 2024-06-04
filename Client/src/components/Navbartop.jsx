import React from "react";
import Logo from "../assets/Logo.png";
import { Container, Navbar } from 'react-bootstrap';

function Navbartop() {
  return (
    <Navbar className="shadow-sm" style={{backgroundColor:"#1A202C", color: "#E2E8F0"}}>
      <Container>
        <Navbar.Brand href="#home" className="d-flex align-items-center">
          <img
            alt=""
            src={Logo}
            width="40"
            height="40"
            className="d-inline-block align-top mr-3"
          />
          <span className="text-white" style={{ fontFamily: "cursive", fontWeight: "bold", fontSize: "1.5rem", letterSpacing: "1px" }}>
            SmartExamPro
          </span>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Navbartop;
