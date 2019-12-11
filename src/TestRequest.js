import React, {Component, useState} from 'react';
import {Accordion, Button, Card,Form} from "react-bootstrap";
import _filter from "lodash/filter";
import _groupBy from "lodash/groupBy";
class OSTypes extends Component{
    constructor(props){
        super(props);
        this.state = {
            operatingSystems:[
                {id: 1, pid:0, name: 'RS1'},
                {id: 2, pid:0, name: 'RS2'},
                {id: 3, pid: 1, name: 'x86'},
                {id: 4, pid: 1, name: 'x64'},
                {id: 5, pid: 2, name: 'x86'},
                {id: 6, pid: 2, name: 'x64'},
            ],
            filteredOS:[],
            childOS:[]
        };
    }
    componentDidMount() {
        this.filterOperatingSystems();
    }

    filterOperatingSystems = () => {
        let filtered = _filter(this.state.operatingSystems,(os=>os.pid<1));
        let child = _groupBy(_filter(this.state.operatingSystems,(os=>os.pid>0)),'pid');
        this.setState({filteredOS:filtered,childOS:child});
    };
    render() {
        const {showOSDiv} = this.props;
        return showOSDiv ?
        <div className="mt-3 row">
            {this.state.filteredOS.map((os,k) =>
                 <div className="col-sm-4">
                     <h3>{os.name}</h3>
                     {
                         this.state.childOS[os.id].map(version=>
                         <Form.Check custom type="checkbox" id={`custom-${version.name}-${version.id}`} label={`${version.name}`}/>
                         )
                     }
                 </div>
            )}
        </div>
        : '';
    }
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
                            <a href="#href" onClick={(e)=>{e.preventDefault();setOSDiv(true);}} className="text-white text-decoration-none">Select an Operating System</a>
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
            </Accordion>
        </div> : '';
};

export default class TestRequest extends Component {
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
};