import React, {Component} from 'react';
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import TestTypes from "./TestTypes";// Adding the test types to use in Step1
import moment from 'moment';// Library to parse, validate, manipulate, and display dates and times in react.js.
import axios from 'axios';// Library that helps us make http requests to external resources
import './animate.css';// CSS Library for cross-browser animations.
import {Animated} from "react-animated-css"; // Apply animations to components
import DatePicker from "react-datepicker";// Component for date picker widget.
import "react-datepicker/dist/react-datepicker.css"; // Styles for Date picker

// Component to select the testType Ex:- Official/Private/MTP
class Step1 extends Component {
    constructor(props) {
        super(props);
        //Local storage for the component
        this.state = {
            selectedOption: '',
        }
    }

//Transforming react components into DOM (Document Object Model)
    render() {
        // verify and show which step is activated
        return this.props.parentState.step1 ?
            // Animation to load and hide the Component
            <Animated animationIn="bounceInRight" animationOut="bounceOutLeft" isVisible={true}>
                {/*Buttons to select the different types of test packages*/}
                <Button type="button" onClick={() => {
                    this.setState({selectedOption: 'Official'});
                    this.props.handleChange('selectedOption', 'Official')
                }} className="mr-3">Official</Button>
                <Button type="button" onClick={() => {
                    this.setState({selectedOption: 'Private'});
                    this.props.handleChange('selectedOption', 'Private')
                }} className="mr-3">Private</Button>
                <Button type="button" onClick={() => {
                    this.setState({selectedOption: 'MTP'});
                    this.props.handleChange('selectedOption', 'MTP')
                }}>MTP</Button>
                <div className="mt-3">
                    {/*Adding the test packages*/}
                    <TestTypes selectedOption={this.props.parentState.selectedOption} wsh={this.props.parentState.wsh} webcrawler={this.props.parentState.webcrawler} accordionKey={this.props.parentState.accordionKey} handleChange={this.props.handleChange}/>
                    {/*Showing the Review and next buttons according to condition*/}
                    <div className="mt-3 d-flex">
                        {
                            this.props.parentState.gotoReview ? (
                                <button type="button" className="btn btn-success ml-auto" onClick={() => this.props.submitTest('step1', 'review')}>Goto
                                    Review</button>
                            ) : (
                                (this.props.parentState.wsh.length > 0 || this.props.parentState.webcrawler !== '') ?
                                    <button type="button" onClick={() => this.props.submitTest('step1', 'step2')} className="btn btn-primary ml-auto">Next &gt;&gt;</button> : null
                            )
                        }
                    </div>
                </div>
            </Animated> : '';
    }
}

// Component to select the OS Ex:- RS1_x64, RS1_x86.
class Step2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOS: []
        }
    }

    // Method to filter operating systems based on the architecture type.
    filterOperatingSystems = (type) => {
        if (this.props.operatingSystems.length > 0)
            return this.props.operatingSystems.filter(os => os.arch === type);
    };
    // Method to handle changes when all the available OS are selected.
    handleSelectAll = (e) => {
        let isChecked = e.target.checked, type = e.target.value, val = this.filterOperatingSystems(type).map(a => a.id);
        if (isChecked) {
            this.setState({selectedOS: [...this.state.selectedOS, ...val]});
            this.props.handleParent('selectedOS', [...this.state.selectedOS, ...val]);
        } else {
            this.setState({selectedOS: this.state.selectedOS.filter((item) => val.indexOf(item) === -1)});
            this.props.handleParent('selectedOS', this.state.selectedOS.filter(item => val.indexOf(item) === -1));
        }
    };
    // Method to handle changes when a particular OS is selected.
    handleSelectOS = (e) => {
        let verifyCheck = e.target.checked, selected = parseInt(e.target.value);
        if (verifyCheck) {
            if (!this.state.selectedOS.includes(selected)) {
                this.setState({selectedOS: [...this.state.selectedOS, selected]});
                this.props.handleParent('selectedOS', [...this.state.selectedOS, selected]);
            }
        } else {
            if (this.state.selectedOS.includes(selected)) {
                this.setState({selectedOS: this.state.selectedOS.filter(item => item !== selected)});
                this.props.handleParent('selectedOS', this.state.selectedOS.filter(item => item !== selected));
            }
        }
    };

    // Transforming react components into DOM (Document Object Model)
    render() {
        // Parsing the x86 and x64 OS
        let OS32 = this.filterOperatingSystems('x86'), OS64 = this.filterOperatingSystems('x64'),
            OS32ids = OS32 ? OS32.map(a => a.id) : [], OS64ids = OS64 ? OS64.map(a => a.id) : [];
        return this.props.step2 ?
            <Animated animationIn="bounceInRight" animationOut="bounceOutLeft" isVisible={true}>
                <h3>Operating System to Run</h3>
                {/*Looping the OS checkboxes using map method*/}
                <div className="row">
                    <div className="col-sm-4">
                        <Form.Check custom type="checkbox" id="selectOS32" checked={this.state.selectedOS.length > 0 && OS32ids.length > 0 && OS32ids.every(item => this.state.selectedOS.includes(item))} onChange={this.handleSelectAll} value="x86" label="x86 (Select all)"/>
                        {OS32ids.length ?
                            OS32.map((os, i) =>
                                <Form.Check key={`OS32-${i}`} custom type="checkbox" id={`os32-${os.id}`} onChange={this.handleSelectOS} checked={this.state.selectedOS.includes(os.id)} value={os.id} label={os.name}/>)
                            : ""}
                    </div>
                    <div className="col-sm-4">
                        <Form.Check custom type="checkbox" id="selectOS64" checked={this.state.selectedOS.length > 0 && OS64ids.length > 0 && OS64ids.every(item => this.state.selectedOS.includes(item))} onChange={this.handleSelectAll} value="x64" label="x64 (Select all)"/>
                        {OS64ids.length ?
                            OS64.map((os, i) =>
                                <Form.Check key={`OS64-${i}`} custom type="checkbox" id={`os64-${os.id}`} onChange={this.handleSelectOS} checked={this.state.selectedOS.includes(os.id)} value={os.id} label={os.name}/>)
                            : ""}
                    </div>
                </div>
                <div className="mt-3 d-flex">
                    {
                        this.props.gotoReview ? (
                            <button type="button" className="btn btn-success ml-auto" onClick={() => this.props.submitOS('step2', 'review')}>Goto
                                Review</button>
                        ) : (
                            <>
                                <button type="button" onClick={() => this.props.submitOS('step2', 'step1')} className="btn btn-primary ml-auto">&lt;&lt; Back</button>
                                {
                                    (this.props.selectedOS.length > 0) ?
                                        <button type="button" className="btn btn-primary ml-3" onClick={() => this.props.submitOS('step2', 'step3')}>Next &gt;&gt;</button> : null
                                }
                            </>
                        )
                    }
                </div>
            </Animated> : '';
    }
}

// Component to provide .msu package path Ex: \\winsehotfix\hotfixes\Windows10\RS1\RTM\KB4537764\V1.001\free\NEU\X64\Windows10.0-KB4537764-x64.msu
class Step3 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paths: ['']
        }
    }

// Saving the paths to state and sending to parent
    handlePath = i => (e) => {
        let paths = [...this.state.paths], val = e.target.value;
        if (val === '') {
            paths.splice(i, 1);
        } else {
            paths[i] = e.target.value;
        }
        this.setState({paths});
        this.props.handleParent('paths', paths);
    };

    render() {
        const operatingSystems = this.props.operatingSystems;
        return this.props.step3 ?
            <Animated animationIn="bounceInRight" animationOut="bounceOutLeft" isVisible={true}>
                {/*Looping through the OS selected to show the input boxes to enter the paths*/}
                {
                    this.props.selectedOS.map((os, i) =>
                        (
                            <Form.Group key={`OS-${i}`}>
                                <Form.Label>{operatingSystems.find(i => i.id === os).name} {operatingSystems.find(i => i.id === os).type} Path</Form.Label>
                                <Form.Control id={`OS-${i}`} type="text" name={`OS[${i}]`} value={this.state.paths[i] ? this.state.paths[i] : ''} onChange={this.handlePath(i)}/>
                            </Form.Group>
                        ))
                }
                <div className="mt-3 d-flex">
                    {
                        this.props.gotoReview ? (
                            <button type="button" className="btn btn-success ml-auto" onClick={() => this.props.submitStep('step3', 'review')}>Goto
                                Review</button>
                        ) : (
                            <>
                                <button type="button" onClick={() => this.props.submitStep('step3', 'step2')} className="btn btn-primary ml-auto">&lt;&lt; Back</button>
                                {(this.props.paths.length === this.props.selectedOS.length) ?
                                    <button type="button" className="btn btn-primary ml-3" onClick={() => this.props.submitStep('step3', 'step4')}>Next &gt;&gt;</button> : null}
                            </>
                        )
                    }
                </div>
            </Animated>
            : '';
    }
}

// Component to enable Postmortem debugging and provide gflags application name Ex:- iexplore.exe
class Step4 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            settings: {
                postmortem_debugging: false,
                gflag: false
            }
        }
    }

// Saving the settings to state and sending to parent component
    handleSettings = (e) => {
        let verifyCheck = e.target.checked, selected = e.target.id;
        let settings = {...this.state.settings};
        if (verifyCheck) {
            settings[selected] = true;
            this.setState({settings});
            this.props.handleParent('settings', settings);
        } else {
            settings[selected] = false;
            this.setState({settings});
            this.props.handleParent('settings', settings);
        }
    };
// Handling different conditions to show the next button
    showNext = () => {
        let html = '';
        const {settings, browsers} = this.props.parentState;
        const {gflag} = settings;
        if (gflag) {
            html = ((browsers.length > 0 && (browsers[0] !== '')) ?
                <button type="button" className="btn btn-primary ml-3" onClick={() => this.props.submitStep('step4', 'step5')}>Next &gt;&gt;</button>
                : null);
        } else {
            html =
                <button type="button" className="btn btn-primary ml-3" onClick={() => this.props.submitStep('step4', 'step5')}>Next &gt;&gt;</button>
        }
        return html;
    };

// Transforming react components into DOM (Document Object Model)
    render() {
        return this.props.step4 ?
            <Animated animationIn="bounceInRight" animationOut="bounceOutLeft" isVisible={true}>
                <div className="row">
                    <div className="col-sm-3">
                        <Form.Check custom type="checkbox" id="postmortem_debugging" checked={this.props.parentState.settings.postmortem_debugging} onChange={this.handleSettings} value="true" label="Postmortem Debugging"/>
                        <Form.Check custom type="checkbox" id="gflag" checked={this.props.parentState.settings.gflag} onChange={this.handleSettings} value="true" label="GFlag"/>
                    </div>
                    <div className="col-sm-6">
                        <BrowserList gflag={this.props.parentState.settings.gflag} browsers={this.props.parentState.browsers} handleChange={this.props.handleParent}/>
                    </div>
                </div>
                <div className="mt-3 d-flex">
                    {
                        this.props.parentState.gotoReview ? (
                            <button type="button" className="btn btn-success ml-auto" onClick={() => this.props.submitStep('step4', 'review')}>Goto
                                Review</button>
                        ) : (
                            <>
                                <button type="button" onClick={() => this.props.submitStep('step4', 'step3')} className="btn btn-primary ml-auto">&lt;&lt; Back</button>
                                {this.showNext()}
                            </>
                        )
                    }
                </div>
            </Animated>
            : '';
    }
}

// Component to select estimated time of test completion. ETA should be atleast 1 hour from current system time.
class Step5 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eta: '',
            checkTime: true
        }
    }

// To save the date picker value to state and sending to parent component
    handleDayChange = selectedDay => {
        this.setState({eta: selectedDay});
        this.props.handleParent('eta', selectedDay);
        let d = moment(selectedDay);
        if (d.isValid()) {
            let minTime = moment().add(1, 'h').unix(), reqTime = (d.unix() >= minTime);
            this.setState({checkTime: reqTime});
        }
    };

// Transforming react components into DOM (Document Object Model)
    render() {
        const {eta, gotoReview} = this.props.parentState;
        return this.props.step5 ?
            <Animated animationIn="bounceInRight" animationOut="bounceOutLeft" isVisible={true}>
                <div className="row">
                    <div className="col-sm-4">
                        <label htmlFor="eta" className="mb-2">ETA</label>
                        {/*Datepicker widget*/}
                        <DatePicker onChange={this.handleDayChange} className={`form-control ${this.state.checkTime ? '' : 'is-invalid'}`}
                                    selected={eta}
                                    showTimeSelect
                                    minDate={new Date()}
                                    timeIntervals={15}
                                    dateFormat="MMMM d, yyyy h:mm aa"
                        />
                        {
                            this.state.checkTime ? '' : (
                                <div className="invalid-feedback d-block">ETA should be at least 1 hour from the current
                                    system time.</div>)
                        }
                    </div>
                </div>
                <div className="mt-3 d-flex">
                    {
                        gotoReview ? (
                            <button type="button" className="btn btn-success ml-auto" onClick={() => this.props.submitStep('step5', 'review')}>Goto
                                Review</button>
                        ) : (
                            <>
                                <button type="button" onClick={() => this.props.submitStep('step5', 'step4')} className="btn btn-primary ml-auto">&lt;&lt; Back</button>
                                {((eta !== undefined) && (this.state.checkTime)) ?
                                    <button type="button" onClick={() => this.props.submitStep('step5', 'review')} className="btn btn-success ml-3">Review</button> : ''}
                            </>
                        )
                    }
                </div>
            </Animated>
            : ''
    }
}

// Component to add browser name or application name when gflags option is selected.
class BrowserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            browsers: ['']
        }
    }

// Method to add additional browser or application.
    handleAdd = () => {
        let browsers = this.state.browsers.concat(['']);
        this.setState({browsers});
        this.props.handleChange('browsers', browsers);
    };
// Method to delete the selected browser or application.
    handleDelete = i => e => {
        let browsers = [
            ...this.state.browsers.slice(0, i),
            ...this.state.browsers.slice(i + 1)
        ];
        this.setState({browsers});
        this.props.handleChange('browsers', browsers);
    };
// To save the browser list
    handleChange = i => e => {
        let browsers = [...this.state.browsers];
        browsers[i] = e.target.value;
        this.setState({browsers});
        this.props.handleChange('browsers', browsers);
    };

// Transforming react components into DOM (Document Object Model)
    render() {
        return this.props.gflag ?
            <>
                {
                    // showing adding the browser input boxes
                    this.props.browsers.map((input, i) =>
                        (<Form.Row key={i}>
                            <Form.Group as={Col} md="9">
                                <Form.Control type="text" required placeholder="Enter browser/application name Ex:- iexplore.exe" id={`browser-${i}`} value={input} onChange={this.handleChange(i)}/>
                            </Form.Group>
                            {
                                i < 1 ?
                                    <Form.Group as={Col} md="3">
                                        <Button onClick={this.handleAdd} variant="primary">+ Add</Button>
                                    </Form.Group>
                                    :
                                    <Form.Group as={Col} md="3">
                                        <Button onClick={this.handleDelete(i)} variant="danger">&times; Delete</Button>
                                    </Form.Group>
                            }
                        </Form.Row>))
                }
            </>
            : '';
    }
}

// Component to review and edit the options in all the steps.
class Review extends Component {
// Parsing the os selected and showing in text format
    getOperatingSystem = id => {
        let operatingSystems = this.props.parentState.operatingSystems;
        let object = operatingSystems.find(obj => obj.id === id);
        return `${object.name} - ${object.arch}`;
    };
// Saving the review button action in local state and parent state
    handleReview = step => {
        this.props.handleParent('gotoReview', true);
        this.props.submitStep('review', step);
    };
// Calling the parent component method to save the test request
    submitReview = () => {
        this.props.saveRequest();
    };

// Transforming react components into DOM (Document Object Model)
    render() {
        let parent = this.props.parentState;
        return parent.review ?
            <Animated animationIn="bounceInRight" animationOut="bounceOutLeft" isVisible={true}>
                <Row>
                    {/*Showing all the consolidated data from all steps*/}
                    <Col sm={4}>
                        <Card bg="dark" text="white" className="mb-3">
                            <Card.Body>
                                <Card.Title className="d-flex">Step 1
                                    <span className="ml-auto"><button type="button" onClick={() => this.handleReview('step1')} className="btn btn-sm btn-link">Edit</button></span>
                                </Card.Title>
                                <ul>
                                    <li>Selected Option: {parent.selectedOption}</li>
                                    {/* <li>Wsh: {parent.wsh.join(',')}</li> */}
                                    <li>WebCrawler: {parent.webcrawler !== '' ? parent.webcrawler : 'Not Selected'}</li>
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={4}>
                        <Card bg="dark" text="white" className="mb-3">
                            <Card.Body>
                                <Card.Title className="d-flex">Step 2
                                    <span className="ml-auto"><button type="button" onClick={() => this.handleReview('step2')} className="btn btn-sm btn-link">Edit</button></span>
                                </Card.Title>
                                <p>Operating Systems Selected</p>
                                <ul>
                                    {
                                        parent.selectedOS.map((os, i) => <li key={i}>{this.getOperatingSystem(os)}</li>)
                                    }
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={4}>
                        <Card bg="dark" text="white" className="mb-3">
                            <Card.Body>
                                <Card.Title className="d-flex">Step 3
                                    <span className="ml-auto"><button type="button" onClick={() => this.handleReview('step3')} className="btn btn-sm btn-link">Edit</button></span>
                                </Card.Title>
                                <p>Operating System Paths</p>
                                <ul>
                                    {
                                        parent.selectedOS.map((os, i) =>
                                            <li key={i}>{this.getOperatingSystem(os)} : {parent.paths[i]}</li>)
                                    }
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={4}>
                        <Card bg="dark" text="white" className="mb-3">
                            <Card.Body>
                                <Card.Title className="d-flex">Step 4
                                    <span className="ml-auto"><button type="button" onClick={() => this.handleReview('step4')} className="btn btn-sm btn-link">Edit</button></span>
                                </Card.Title>
                                <p>Test Parameters</p>
                                <ul>
                                    <li>Postmortem Debugging
                                        : {parent.settings.postmortem_debugging ? 'Selected' : 'Not Selected'}</li>
                                    <li>Gflag : {parent.settings.gflag ? 'selected' : 'Not selected'}</li>
                                    {parent.settings.gflag ? (<li>Browsers : {parent.browsers.join(',')}</li>) : null}
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={4}>
                        <Card bg="dark" text="white" className="mb-3">
                            <Card.Body>
                                <Card.Title className="d-flex">Step 5
                                    <span className="ml-auto"><button type="button" onClick={() => this.handleReview('step5')} className="btn btn-sm btn-link">Edit</button></span>
                                </Card.Title>
                                <p>Estimated Execution time : {moment(parent.eta).format('lll')}</p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <button type="button" onClick={this.submitReview} className="btn btn-success mt-3">Submit</button>
            </Animated>
            : ''
    }
}

// Parent class of all steps to save all the data and save the test request.
export default class TestRequest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedOption: '',
            wsh: [],
            webcrawler: '',
            step1: true,
            step2: false,
            step3: false,
            step4: false,
            step5: false,
            review: false,
            gotoReview: false,
            selectedOS: [],
            paths: [],
            accordionKey: '',
            settings: {
                postmortem_debugging: false,
                gflag: false
            },
            browsers: [''],
            eta: undefined,
            operatingSystems: []
        };
    }

// To fetch OS data from DB we put the API call in componentDidMount.
    componentDidMount() {
        this.getTestOS();
    }

// Method to submit all the selected values to the controller.
    finishRequest = () => {

        let {operatingSystems} = this.state;
        let filteredOS = operatingSystems.filter(os => this.state.selectedOS.includes(os.id));
        let testName = [];
        if (this.state.webcrawler !== '') {
            testName.push('webcrawler');
        }
        if (this.state.wsh.length > 0) {
            testName.push('wsh');
        }
 // API call to post the selected options to controller.
        axios.post('http://10.192.226.137:8181/api/testrequest/createNewTestRequest', {
            selectedOption: this.state.selectedOption,
            wsh: this.state.wsh,
            webcrawler: this.state.webcrawler,
            os: filteredOS,
            testName: testName,
            paths: this.state.path,
            settings: this.state.settings,
            browsers: this.state.browsers,
            completeBy: moment(this.state.eta).format("YYYY-MM-DD HH:mm:ss")
        }, {headers: {"Content-Type": "application/json"}}).then(() => {
            alert('Test Request created successfully...!');
            window.location.reload();
        });
    };

// Handling the test types of step1
    handleTestTypeChange = (testType, val) => {
        this.setState({[testType]: val});
    };
// Method to hide the previous slide and move to the next slide
    submitStep = (firstStep, lastStep) => {
        this.setState({[firstStep]: false, [lastStep]: true});
    };

// API call to get the OS list from controller
    getTestOS = async () => {
        await axios.get('http://10.192.226.137:8181/api/testrequest/getTestOS').then(res => this.setState({operatingSystems: res.data}));
    };

// Transforming react components into DOM (Document Object Model)
    render() {
        return (
            <div className="mt-3 container">
                <Card bg="dark" text="white">
                    <Card.Header>Test Request</Card.Header>
                    <Card.Body>
                        {/*Rendering all the steps */}
                        <Step1 step1={this.state.step1} handleChange={this.handleTestTypeChange} accordionKey={this.state.accordionKey} submitTest={this.submitStep} parentState={this.state}/>
                        <Step2 step2={this.state.step2} selectedOS={this.state.selectedOS} operatingSystems={this.state.operatingSystems} handleParent={this.handleTestTypeChange} next={this.state.step3} submitOS={this.submitStep}/>
                        <Step3 step3={this.state.step3} selectedOS={this.state.selectedOS} paths={this.state.paths} operatingSystems={this.state.operatingSystems} gotoReview={this.state.gotoReview} handleParent={this.handleTestTypeChange} submitStep={this.submitStep}/>
                        <Step4 step4={this.state.step4} parentState={this.state} handleParent={this.handleTestTypeChange} submitStep={this.submitStep}/>
                        <Step5 step5={this.state.step5} parentState={this.state} handleParent={this.handleTestTypeChange} submitStep={this.submitStep}/>
                        <Review parentState={this.state} submitStep={this.submitStep} saveRequest={this.finishRequest} handleParent={this.handleTestTypeChange}/>
                    </Card.Body>
                </Card>
            </div>
        );
    }
};
