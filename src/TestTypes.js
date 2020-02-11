import React, {Component} from "react";
import {Form} from "react-bootstrap";
import axios from "axios";

export default class TestTypes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wsh: [],
            webcrawler: '',
            testPackages: []
        };
    }
//To fetch data from API we place the API call in componentDidMount
    componentDidMount() {
        this.getTestPackages();
    }

    handleTestType = (key, value) => {
        this.setState({[key]: value});
        this.props.handleChange(key, value);
    };
    handleWsh = e => {
        const testType = e.target.value;
        const isChecked = e.target.checked;
        if (isChecked) {
            this.setState({wsh: [...this.state.wsh, testType]});
            this.props.handleChange('wsh', [...this.state.wsh, testType]);
        } else {
            this.setState({wsh: this.state.wsh.filter(item => item !== testType)});
            this.props.handleChange('wsh', this.state.wsh.filter(item => item !== testType));
        }
    };
    handleWshCheckbox = e => {
        let vals = (e.target.checked) ? ['WSH-JSCRIPT', 'WSH-VBSCRIPT'] : [];
        this.setState({wsh: vals});
        this.props.handleChange('wsh', vals);
    };
    handleWCCheckbox = e => {
        let val = e.target.checked ? e.target.value : '';
        this.setState({webcrawler: val});
        this.props.handleChange('webcrawler', val);
    };
    //API call to get the test packages from controller
    getTestPackages = () => {
        axios.get('http://10.192.226.137:8181/api/testrequest/getTestPackages').then(res=> this.setState({testPackages:res.data}));
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.selectedOption !== this.props.selectedOption) {
            this.setState({wsh: [], webcrawler: ''});
            this.props.handleChange('wsh', []);
            this.props.handleChange('webcrawler', '');
        }
    }

    render() {
        const {selectedOption} = this.props;
        const {testPackages} = this.state;
        return selectedOption !== '' ?
            <div>
                <h1>{selectedOption}</h1>
                {
                    testPackages.map((testPackage, i) =>(
                        <div key={`testPackage-${i}`}>
                        <Form.Check custom type="checkbox" id={`testPackage-${testPackage.id}`} onChange={this.handleWCCheckbox} checked={this.props.webcrawler === testPackage.name} value={testPackage.name} label={testPackage.name}/>
                        <div className="col-sm-6">
                            {
                                testPackage.testPackage.map((tpk, i) =>
                                    <Form.Check key={`subPackage-${i}`} custom type="radio" disabled={this.props.webcrawler === tpk.name } name={tpk.name} onChange={(e) => this.handleTestType(tpk.name.toLowerCase(), e.target.value)} checked={this.props.webcrawler === tpk.runnableUnit} value={tpk.runnableUnit} id={`subPackage-${tpk.id}`} label={tpk.runnableUnit}/>
                                )
                            }
                        </div>
                        </div>
                    ))
                }
                {/*<Form.Check custom type="checkbox" onChange={this.handleWshCheckbox} checked={this.props.wsh.includes('WSH-JSCRIPT') && this.props.wsh.includes('WSH-VBSCRIPT')} id={`wsh`} label="WSH"/>
                <div className="col-sm-6">
                    <Form.Check custom type="checkbox" onChange={this.handleWsh} name="wsh[]" checked={this.props.wsh.includes('WSH-JSCRIPT')} value="WSH-JSCRIPT" id={`wsh-jscript`} label="JScript"/>
                    <Form.Check custom type="checkbox" onChange={this.handleWsh} name="wsh[]" checked={this.props.wsh.includes('WSH-VBSCRIPT')} value="WSH-VBSCRIPT" id={`wsh-vbscript`} label="VBScript"/>
                </div>
                <Form.Check custom type="checkbox" onChange={this.handleWCCheckbox} checked={this.props.webcrawler === 'WEBCRAWLER'} value="WEBCRAWLER" id={`webcrawler`} label="Web Crawler"/>
                <div className="col-sm-6">
                    <Form.Check custom type="radio" disabled={this.props.webcrawler === 'WEBCRAWLER'} name="webcrawler" onChange={(e) => this.handleTestType('webcrawler', e.target.value)} checked={this.props.webcrawler === 'WEBCRAWLER-100'} value="WEBCRAWLER-100" id={`webcrawler-100`} label="Top 100 Sites"/>
                    <Form.Check custom type="radio" disabled={this.props.webcrawler === 'WEBCRAWLER'} name="webcrawler" onChange={(e) => this.handleTestType('webcrawler', e.target.value)} checked={this.props.webcrawler === 'WEBCRAWLER-50'} value="WEBCRAWLER-50" id={`webcrawler-50`} label="Top 50 Sites"/>
                </div>*/}
            </div> : '';
    }
}