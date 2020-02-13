import React from 'react'; // importing the react library to write react operations
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap library to Style the application
import {Nav, Navbar} from "react-bootstrap"; // React Bootstrap library to use Bootstrap with react
import TestRequest from "./TestRequest"; // Source code of the entire library
/* Main wrapper for the application i.e. Header and Body of the application */
const App = () => (
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

export default App;
