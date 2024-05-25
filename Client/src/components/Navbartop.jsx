import React from "react";
import Logo from "../assets/Logo.png";

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function Navbartop() {
  return (
    <Navbar className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src={Logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            React Bootstrap
          </Navbar.Brand>
        </Container>
      </Navbar>
  );
}

export default Navbartop;
