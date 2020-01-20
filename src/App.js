import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Nav, Navbar} from "react-bootstrap";
import TestRequest from "./TestRequest";
window._ = require('lodash');
function App() {
  return (
    <div className="App">
      <Navbar bg="primary" variant="dark">
        <Navbar.Brand href="#home">Test Project</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="/" className="active">Request Test</Nav.Link>
        </Nav>
      </Navbar>
      <TestRequest/>
    </div>
  );
}

export default App;
