import React from 'react';// Importing the react library to write react operations
import ReactDOM from 'react-dom';// Renders any component of react on to the dom
import './index.css'; // Some custom styles
import App from './App'; // Content of the Application
import * as serviceWorker from './serviceWorker'; // Used while developing progressive web apps

ReactDOM.render(<App />, document.getElementById('root')); // Renders the content to the web page

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
