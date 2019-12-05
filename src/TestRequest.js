import React, {Component} from 'react';
import {Accordion, Button, Card} from "react-bootstrap";
import divWithClassName from "react-bootstrap/esm/divWithClassName";

/**
 * @return {string}
 */
const TestTypes = ({selectedOption}) => selectedOption !== '' ?
    <div>
        <h1>{selectedOption }</h1>
        <Accordion defaultActiveKey="" className="mt-3">
            <Card bg="secondary">
                <Accordion.Toggle as={Card.Header} eventKey="0">&gt;&gt; WSH </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>Hello! I'm the body</Card.Body>
                    </Accordion.Collapse>
            </Card>
            <Card bg="secondary">
                <Accordion.Toggle as={Card.Header} eventKey="1">&gt;&gt; Web Crawler </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                    <Card.Body>Hello! I'm another body</Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    </div> : '';

class TestRequest extends Component {
    state = {
        selectedOption: ''
    };

    render() {
        return (
            <div className="mt-3 container">
                <Card bg="dark" text="white">
                    <Card.Header>Test Request</Card.Header>
                    <Card.Body>
                        <Button type="button" onClick={()=>this.setState({selectedOption:'Official'})} className="mr-3">Official</Button>
                        <Button type="button" onClick={()=>this.setState({selectedOption:'Private'})} className="mr-3">Private</Button>
                        <Button type="button" onClick={()=>this.setState({selectedOption:'Public'})}>Public</Button>
                        <div className="mt-3">
                            <TestTypes selectedOption={this.state.selectedOption}/>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}

export default TestRequest;