import React, {Component} from 'react';
import {Button, Card, Col, Form} from "react-bootstrap";
import TestTypes from "./TestTypes";
import './animate.css';
import {Animated} from "react-animated-css";
import {operatingSystems} from "./os.json";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import {DateUtils} from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';

class Step1 extends Component{
    constructor(props){
        super(props);
        this.state = {
            selectedOption: '',
        }
    }
    render() {
        return this.props.step1 ? <Animated animationIn="bounceInRight" animationOut="bounceOutLeft" isVisible={true}>
            <Button type="button" onClick={()=>{this.setState({selectedOption:'Official'});this.props.handleChange('selectedOption','Official')}} className="mr-3">Official</Button>
            <Button type="button" onClick={()=>{this.setState({selectedOption:'Private'});this.props.handleChange('selectedOption','Private')}} className="mr-3">Private</Button>
            <Button type="button" onClick={()=>{this.setState({selectedOption:'Public'});this.props.handleChange('selectedOption','Public')}}>Public</Button>
            <div className="mt-3">
                <TestTypes selectedOption={this.state.selectedOption} wsh={this.props.wsh} webcrawler={this.props.webcrawler} accordionKey={this.props.accordionKey} handleChange={this.props.handleChange}/>
                <div className="mt-3 d-flex">
                    {(this.props.wsh.length>0 || this.props.webcrawler !== '') ? <button type="button" onClick={()=>this.props.submitTest('step1','step2')} className="btn btn-primary ml-auto">Next &gt;&gt;</button> : null}
                </div>
            </div>
        </Animated> : '';
    }
}
class Step2 extends Component{
    constructor(props){
        super(props);
        this.state = {
            operatingSystems,
            selectedOS:[]
        }
    }
    filterOperatingSystems = (type) =>{
        return this.state.operatingSystems.filter(os => os.type === type);
    };
    handleSelectAll = (e) => {
        let isChecked = e.target.checked,type = e.target.value,val = this.filterOperatingSystems(type).map(a=>a.id);
        if(isChecked){
            this.setState({selectedOS: [...this.state.selectedOS,...val]});
            this.props.handleParent('selectedOS',[...this.state.selectedOS,...val]);
        } else {
            this.setState({selectedOS: this.state.selectedOS.filter((item) => val.indexOf(item) === -1)});
            this.props.handleParent('selectedOS',this.state.selectedOS.filter(item => val.indexOf(item) === -1));
        }
    };
    handleSelectOS = (e) => {
        let verifyCheck = e.target.checked,selected = parseInt(e.target.value);
        if(verifyCheck){
            if(!this.state.selectedOS.includes(selected)) {
                this.setState({selectedOS: [...this.state.selectedOS, selected]});
                this.props.handleParent('selectedOS', [...this.state.selectedOS, selected]);
            }
        }else{
            if(this.state.selectedOS.includes(selected)) {
                this.setState({selectedOS: this.state.selectedOS.filter(item => item !== selected)});
                this.props.handleParent('selectedOS',this.state.selectedOS.filter(item => item !== selected));
            }
        }
    };
    render() {
        let OS32 = this.filterOperatingSystems('x86'),OS64 = this.filterOperatingSystems('x64'),OS32ids = OS32.map(a=>a.id),OS64ids = OS64.map(a=>a.id);
        return this.props.step2 ?
            <Animated animationIn="bounceInRight" animationOut="bounceOutLeft" isVisible={true}>
                <h3>Operating System to Run</h3>
                <div className="row">
                    <div className="col-sm-4">
                        <Form.Check custom type="checkbox" id="selectOS32" checked={this.state.selectedOS.length > 0 && OS32ids.every(item => this.state.selectedOS.includes(item))} onChange={this.handleSelectAll} value="x86" label="x86 (Select all)"/>
                        {
                            OS32.map((os, i) =>
                                <Form.Check key={`OS32-${i}`} custom type="checkbox" id={`os32-${os.id}`} onChange={this.handleSelectOS} checked={this.state.selectedOS.includes(os.id)} value={os.id} label={os.name}/>)
                        }
                    </div>
                    <div className="col-sm-4">
                        <Form.Check custom type="checkbox" id="selectOS64" checked={this.state.selectedOS.length > 0 && OS64ids.every(item => this.state.selectedOS.includes(item))} onChange={this.handleSelectAll} value="x64" label="x64 (Select all)"/>
                        {
                            OS64.map((os, i) =>
                                <Form.Check key={`OS64-${i}`} custom type="checkbox" id={`os64-${os.id}`} onChange={this.handleSelectOS} checked={this.state.selectedOS.includes(os.id)} value={os.id} label={os.name}/>)
                        }
                    </div>
                </div>
                <div className="mt-3 d-flex">
                    <button type="button" onClick={() => this.props.submitOS('step2', 'step1')} className="btn btn-primary ml-auto">&lt;&lt; Back</button>
                    {(this.props.selectedOS.length > 0) ?
                        <button type="button" className="btn btn-primary ml-3" onClick={() => this.props.submitOS('step2', 'step3')}>Next &gt;&gt;</button> : null}
                </div>
            </Animated> : '';
    }
}
class Step3 extends Component{
    constructor(props){
        super(props);
        this.state = {
            paths:[],
            operatingSystems
        }
    }
    handlePath = (e) => {
        let paths = [...this.state.paths],name = e.target.name,value = e.target.value;
        const [i, prop] = name.split(/\[(.*?)\]/g).slice(1).filter(Boolean);
        paths[i] = { ...paths[i],value};
        this.setState({ paths });
        this.props.handleParent('paths',paths);
    };
    render() {
        const operatingSystems = this.state.operatingSystems;
        return this.props.step3 ?
            <Animated animationIn="bounceInRight" animationOut="bounceOutLeft" isVisible={true}>
                {
                    this.props.selectedOS.map((os, i) =>
                        (
                            <Form.Group key={`OS-${i}`}>
                                <Form.Label>{operatingSystems.find(i => i.id === os).name} {operatingSystems.find(i => i.id === os).type} Path</Form.Label>
                                <Form.Control id={`OS-${i}`} type="text" name={`OS[${i}]`} value={this.state.paths[i] ? Object.values(this.state.paths[i]) : ''} onChange={this.handlePath}/>
                            </Form.Group>
                        ))
                }
                <div className="mt-3 d-flex">
                    <button type="button" onClick={()=>this.props.submitStep('step3', 'step2')} className="btn btn-primary ml-auto">&lt;&lt; Back</button>
                    {(this.props.paths.length > 0) ?
                    <button type="button" className="btn btn-primary ml-3" onClick={() => this.props.submitStep('step3', 'step4')}>Next &gt;&gt;</button> : null}
                </div>
            </Animated>
            : '';
    }
}
class Step4 extends Component{
    constructor(props){
        super(props);
        this.state = {
            settings:{
                postmortem_debugging:false,
                gflag:false
            }
        }
    }
    handleSettings = (e) => {
        let verifyCheck = e.target.checked,selected = e.target.id;
        let settings = {...this.state.settings};
        if(verifyCheck){
            settings[selected] = true;
            this.setState({settings});
            this.props.handleParent('settings', settings);
        }else{
            settings[selected] = false;
            this.setState({settings});
            this.props.handleParent('settings', settings);
        }
    };
    showNext = () => {
        let html = '';
        const {settings, browsers} = this.props.parentState;
        const {gflag} = settings;
        if (gflag) {
             html = ((browsers.length > 0 && (browsers[0] !== '')) ?
                <button type="button" className="btn btn-primary ml-3" onClick={() => this.props.submitStep('step4', 'step5')}>Next &gt;&gt;</button>
            : null);
        }else{
            html = <button type="button" className="btn btn-primary ml-3" onClick={() => this.props.submitStep('step4', 'step5')}>Next &gt;&gt;</button>
        }
        return html;
    };
    render(){
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
                    <button type="button" onClick={()=>this.props.submitStep('step4', 'step3')} className="btn btn-primary ml-auto">&lt;&lt; Back</button>
                    {this.showNext()}
                </div>
            </Animated>
            : '';
    }
}
class Step5 extends Component{
    constructor(props) {
        super(props);
        this.state = {
            testParameter:'',
            eta:undefined,
            format:'MM/dd/yyyy'
        }
    }
    parseDate = (str, format, locale) => {
        const parsed = dateFnsParse(str, format, new Date(), { locale });
        if (DateUtils.isDate(parsed)) {
            return parsed;
        }
        return undefined;
    };
    formatDate = (date, format, locale) => dateFnsFormat(date, format, {locale});
    handleChange = (e) => {
      this.setState({testParameter:e.target.value});
      this.props.handleParent('testParameter',e.target.value);
    };
    handleDayChange = selectedDay => {
        this.setState({eta:selectedDay});
        this.props.handleParent('eta',selectedDay);
    };
    render() {
        const {testParameter, eta} = this.props.parentState;
        return this.props.step5 ?
            <Animated animationIn="bounceInRight" animationOut="bounceOutLeft" isVisible={true}>
                <div className="row">
                    <div className="col-sm-3">
                        <label className="mb-2">Test Parameter</label>
                        <Form.Check custom type="radio" id="test_default" checked={testParameter === 'default'} onChange={this.handleChange} value="default" label="Default"/>
                        <Form.Check custom type="radio" id="test_vbscript" checked={testParameter === 'vbscript'} onChange={this.handleChange} value="vbscript" label="VBScript"/>
                        <Form.Check custom type="radio" id="test_javascript" checked={testParameter === 'javascript'} onChange={this.handleChange} value="javascript" label="Java Script"/>
                    </div>
                    <div className="col-sm-4">
                        <label htmlFor="eta" className="mb-2">ETA</label>
                        <DayPickerInput
                            formatDate={this.formatDate}
                            format={this.state.format}
                            parseDate={this.parseDate}
                            placeholder={`${dateFnsFormat(new Date(), this.state.format)}`}
                            id="eta"
                            value={eta}
                            className="form-control"
                            onDayChange={this.handleDayChange}
                        />
                    </div>
                </div>
                <div className="mt-3 d-flex">
                    <button type="button" onClick={()=>this.props.submitStep('step5', 'step4')} className="btn btn-primary ml-auto">&lt;&lt; Back</button>
                </div>
            </Animated>
        : ''
    }
}
class BrowserList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            browsers:['']
        }
    }
    handleAdd = () => {
        let browsers = this.state.browsers.concat(['']);
        this.setState({browsers});
        this.props.handleChange('browsers',browsers);
    };
    handleDelete = i => e => {
        let browsers = [
            ...this.state.browsers.slice(0, i),
            ...this.state.browsers.slice(i + 1)
        ];
        this.setState({browsers});
        this.props.handleChange('browsers',browsers);
    };
    handleChange = i => e =>{
        let browsers = [...this.state.browsers];
        browsers[i] = e.target.value;
        this.setState({browsers});
        this.props.handleChange('browsers',browsers);
    };
    render() {
        return this.props.gflag ?
            <>
                {
                    this.props.browsers.map((input, i) =>
                        (<Form.Row key={i}>
                            <Form.Group as={Col} md="9">
                                <Form.Control type="text" required placeholder="Enter Browser name" id={`browser-${i}`} value={input} onChange={this.handleChange(i)}/>
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
export default class TestRequest extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedOption:'',
            wsh:[],
            webcrawler:'',
            step1:true,
            step2:false,
            step3:false,
            step4:false,
            step5:false,
            selectedOS:[],
            paths:[],
            accordionKey:'',
            settings:{
                postmortem_debugging:false,
                gflag:false
            },
            browsers:[''],
            testParameter:'',
            eta:undefined
        };
    }
    handleTestTypeChange = (testType,val) => {
        this.setState({[testType]:val});
        if(testType === "wsh" || testType === "webcrawler"){
            this.setAccordionKey(testType);
        }
    };
    setAccordionKey = testType => {
        let accordionKey = this.state.accordionKey;
        switch (testType) {
            case 'wsh':
                accordionKey = '0';
                break;
            case "webcrawler":
                accordionKey = '1';
                break;
            default:
                accordionKey = '';
        }
        this.setState({accordionKey});
    };
    submitStep = (firstStep,lastStep) => {
        this.setState({[firstStep]:false,[lastStep]:true});
    };
    render() {
        return (
            <div className="mt-3 container">
                <Card bg="dark" text="white">
                    <Card.Header>Test Request</Card.Header>
                    <Card.Body>
                        <Step1 step1={this.state.step1} handleChange={this.handleTestTypeChange} accordionKey={this.state.accordionKey} wsh={this.state.wsh} submitTest={this.submitStep} webcrawler={this.state.webcrawler}/>
                        <Step2 step2={this.state.step2} selectedOS={this.state.selectedOS} handleParent={this.handleTestTypeChange} submitOS={this.submitStep}/>
                        <Step3 step3={this.state.step3} selectedOS={this.state.selectedOS} paths={this.state.paths} handleParent={this.handleTestTypeChange} submitStep={this.submitStep}/>
                        <Step4 step4={this.state.step4} parentState={this.state} handleParent={this.handleTestTypeChange} submitStep={this.submitStep}/>
                        <Step5 step5={this.state.step5} parentState={this.state} handleParent={this.handleTestTypeChange} submitStep={this.submitStep}/>
                    </Card.Body>
                </Card>
            </div>
        );
    }
};