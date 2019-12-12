import React, {Component} from 'react';
import {Accordion, Button, Card, Form} from "react-bootstrap";
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
            childOS:[],
            selectedOS:[]
        };
    }
    componentDidMount() {
        this.filterOperatingSystems();
    }
    updateSelectedOS = (e) => {
        const operatingSystem = e.target.value;
        const isChecked = e.target.checked;
        if(isChecked) {
            this.setState({selectedOS: [...this.state.selectedOS, operatingSystem]});
            this.props.handleChange([...this.state.selectedOS, operatingSystem]);
        }else {
            this.setState({selectedOS: this.state.selectedOS.filter(item => item !== operatingSystem)});
            this.props.handleChange(this.state.selectedOS.filter(item => item !== operatingSystem));
        }
    };
    filterOperatingSystems = () => {
        let filtered = _filter(this.state.operatingSystems,(os=>os.pid<1));
        let child = _groupBy(_filter(this.state.operatingSystems,(os=>os.pid>0)),'pid');
        this.setState({filteredOS:filtered,childOS:child});
    };
    render() {
        const {showOSDiv} = this.props;
        return showOSDiv !=='' ?
        <div className="mt-3 row">
            {this.state.filteredOS.map((os,k) =>
                 <div className="col-sm-4" key={k}>
                     <h3>{os.name}</h3>
                     {
                         this.state.childOS[os.id].map(version=>
                         <Form.Check custom type="checkbox" key={version.id} value={`${this.props.testType}-${showOSDiv}-${os.name}-${version.name}`} onChange={this.updateSelectedOS} id={`custom-${version.name}-${version.id}`} label={`${version.name}`}/>
                         )
                     }
                 </div>
            )}
        </div>
        : '';
    }
};
class TestTypes extends Component{
    state = {
        showOSDiv: ''
    };
    setOSDiv = value => {
        this.setState({'showOSDiv':value});
    };
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.selectedOption !== this.props.selectedOption){
            this.setState({'showOSDiv':''});
        }
    }

    render() {
        const {selectedOption} = this.props;
        return selectedOption !== '' ?
            <div>
                <h1>{selectedOption}</h1>
                <Accordion defaultActiveKey="" className="mt-3">
                    <Card bg="secondary">
                        <Accordion.Toggle as={Card.Header} onClick={()=>this.setOSDiv('')} eventKey="0">&gt;&gt; WSH </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                <a href="#href" onClick={(e)=>{e.preventDefault();this.setOSDiv("WSH");}} className="btn btn-primary">Select an Operating System</a>
                                <OSTypes showOSDiv={this.state.showOSDiv} handleChange={this.props.handleChange} testType={selectedOption}/>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                    <Card bg="secondary">
                        <Accordion.Toggle as={Card.Header} onClick={()=>this.setOSDiv('')} eventKey="1">&gt;&gt; Web Crawler </Accordion.Toggle>
                        <Accordion.Collapse eventKey="1">
                            <Card.Body>
                                <ul>
                                    <li><button type="button" onClick={(e)=>{e.preventDefault();this.setOSDiv('WebCrawler');}} className="btn btn-link text-white">Top 100 Sites</button></li>
                                    <li><button type="button" onClick={(e)=>{e.preventDefault();this.setOSDiv('WebCrawler');}} className="btn btn-link text-white">Top 50 Sites</button></li>
                                </ul>
                                <OSTypes showOSDiv={this.state.showOSDiv} handleChange={this.props.handleChange} testType={selectedOption}/>
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </div> : '';
    }
}
export default class TestRequest extends Component {
    state = {
        selectedOption: '',
        selectedOperatingSystems:[]
    };
    handleOSChange = os => {
        this.setState({selectedOperatingSystems:os});
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
                            <TestTypes selectedOption={this.state.selectedOption} handleChange={this.handleOSChange}/>
                            <div className="mt-3 d-flex">
                                {this.state.selectedOperatingSystems.length>0 ? <button type="button" className="btn btn-primary ml-auto">Next &gt;&gt;</button> : null}
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        );
    }
};