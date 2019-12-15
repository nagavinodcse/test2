import React, {Component} from 'react';
import {Button, Card} from "react-bootstrap";
import TestTypes from "./TestTypes";

export default class TestRequest extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedOption: '',
            wsh:[],
            webcrawler:''
        };
    }
    handleTestTypeChange = (testType,val) => {
        this.setState({[testType]:val});
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
                            <TestTypes selectedOption={this.state.selectedOption} handleChange={this.handleTestTypeChange}/>
                            <div className="mt-3 d-flex">
                                {(this.state.wsh.length>0 || this.state.webcrawler !== '') ? <button type="button" className="btn btn-primary ml-auto">Next &gt;&gt;</button> : null}
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        );
    }
};