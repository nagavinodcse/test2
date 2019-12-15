import React, {Component} from "react";
import _filter from "lodash/filter";
import _groupBy from "lodash/groupBy";
import {Form} from "react-bootstrap";

export default class OSTypes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            operatingSystems: [
                {id: 1, pid: 0, name: 'RS1'},
                {id: 2, pid: 0, name: 'RS2'},
                {id: 3, pid: 1, name: 'x86'},
                {id: 4, pid: 1, name: 'x64'},
                {id: 5, pid: 2, name: 'x86'},
                {id: 6, pid: 2, name: 'x64'},
            ],
            filteredOS: [],
            childOS: [],
            selectedOS: []
        };
    }

    componentDidMount() {
        this.filterOperatingSystems();
    }

    updateSelectedOS = (e) => {
        const operatingSystem = e.target.value;
        const isChecked = e.target.checked;
        if (isChecked) {
            this.setState({selectedOS: [...this.state.selectedOS, operatingSystem]});
            this.props.handleChange([...this.state.selectedOS, operatingSystem]);
        } else {
            this.setState({selectedOS: this.state.selectedOS.filter(item => item !== operatingSystem)});
            this.props.handleChange(this.state.selectedOS.filter(item => item !== operatingSystem));
        }
    };
    filterOperatingSystems = () => {
        let filtered = _filter(this.state.operatingSystems, (os => os.pid < 1));
        let child = _groupBy(_filter(this.state.operatingSystems, (os => os.pid > 0)), 'pid');
        this.setState({filteredOS: filtered, childOS: child});
    };

    render() {
        const {showOSDiv} = this.props;
        return showOSDiv !== '' ?
            <div className="mt-3 row">
                {this.state.filteredOS.map((os, k) =>
                    <div className="col-sm-4" key={k}>
                        <h3>{os.name}</h3>{
                        this.state.childOS[os.id].map(version =>
                            <Form.Check custom type="checkbox" key={version.id} value={`${this.props.testType}-${showOSDiv}-${os.name}-${version.name}`} onChange={this.updateSelectedOS} id={`custom-${version.name}-${version.id}`} label={`${version.name}`}/>
                        )
                    }
                    </div>
                )}
            </div>
            : '';
    }
}