import React from "react";
import Logo from "../assets/Logo.png";
import { Container, Navbar } from 'react-bootstrap';

function Navbartop() {
  return (
    <Navbar   className="shadow-sm" style={{backgroundColor:"#8EC5FC",backgroundImage:"linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)"}}>
      <Container>
        <Navbar.Brand href="#home" className="d-flex align-items-center">
          <img
            alt=""
            src={Logo}
            width="30"
            height="30"
            className="d-inline-block align-top mr-2"
          />
          <span className="text-dark" style={{ fontFamily: "cursive", fontWeight: "bold", fontSize: "1.5rem",letterSpacing:"1px"}}>SmartExamPro</span>
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default Navbartop;
