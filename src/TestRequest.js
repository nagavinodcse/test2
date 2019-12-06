import React, {Component,useState} from 'react';
import {Accordion, Button, Card} from "react-bootstrap";
import { TreeViewComponent } from '@syncfusion/ej2-react-navigations';
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-react-navigations/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(true);
const OSTypes = ({showOSDiv}) =>{
    let os = [
            { id: 1, name: 'RS1', hasChild: true, expanded: true },
            { id: 2, name: 'RS2', hasChild: true, expanded: true },
            { id: 3, pid: 1, name: 'x86', isChecked: false },
            { id: 4, pid: 1, name: 'x64',isChecked:false },
            { id: 5, pid: 2, name: 'x86',isChecked:false },
            { id: 6, pid: 2, name: 'x64', isChecked: false },
        ];
    let field = { dataSource: os, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild' };
    const [operatingSystems,setOperatingSystems] = useState(field);
    const [isChecked,setIsChecked] = useState(true);
    return (showOSDiv) ?
        <div className="mt-3">
            <TreeViewComponent fields={operatingSystems} showCheckBox={isChecked}/>
        </div> : '';
};
const TestTypes = ({selectedOption}) => {
    const [showOSDiv, setOSDiv] = useState(false);
    return selectedOption !== '' ?
        <div>
            <h1>{selectedOption}</h1>
            <Accordion defaultActiveKey="" className="mt-3">
                <Card bg="secondary">
                    <Accordion.Toggle as={Card.Header} eventKey="0">&gt;&gt; WSH </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body>
                            <a href="#" onClick={()=>setOSDiv(true)}>Select an Operating System</a>
                            <OSTypes showOSDiv={showOSDiv}/>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                <Card bg="secondary">
                    <Accordion.Toggle as={Card.Header} eventKey="1">&gt;&gt; Web Crawler </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                        <Card.Body>
                        <ul>
                            <li>Top 100 Sites</li>
                            <li>Top 50 Sites</li>
                        </ul>
                    </Card.Body>
                    </Accordion.Collapse>
                </Card>
                {/*<OSTypes showOSDiv={showOSDiv}/>*/}
            </Accordion>
        </div> : '';
};

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