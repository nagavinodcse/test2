import React, {Component} from "react";
import {Form} from "react-bootstrap"; // To use form components from react bootstrap
import axios from "axios"; // Library used to make api calls

// Test Packages list of checkboxes in Step 1
export default class TestTypes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            wsh: [],
            webcrawler: '',
            testPackages: []
        };
    }
// To fetch Test Packages from API we place the API call in componentDidMount
    componentDidMount() {
        this.getTestPackages();
    }
// To add the test types to state
    handleTestType = (key, value) => {
        this.setState({[key]: value});
        this.props.handleChange(key, value);
    };
// To add the WSH test packages to state
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
// To handle the WSH check and uncheck status in the state
    handleWshCheckbox = e => {
        let vals = (e.target.checked) ? ['WSH-JSCRIPT', 'WSH-VBSCRIPT'] : [];
        this.setState({wsh: vals});
        this.props.handleChange('wsh', vals);
    };
//  To handle the Web Crawler properties
    handleWCCheckbox = e => {
        let val = e.target.checked ? e.target.value : '';
        this.setState({webcrawler: val});
        this.props.handleChange('webcrawler', val);
    };
// API call to get the test packages from controller
    getTestPackages = () => {
        axios.get('http://10.192.226.137:8181/api/testrequest/getTestPackages').then(res=> this.setState({testPackages:res.data}));
    };
// Verify and select the check boxes of webcrawler or wsh on component update
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.selectedOption !== this.props.selectedOption) {
            this.setState({wsh: [], webcrawler: ''});
            this.props.handleChange('wsh', []);
            this.props.handleChange('webcrawler', '');
        }
    }
// Transforming react components into DOM (Document Object Model)
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
               
            </div> : '';
    }
}