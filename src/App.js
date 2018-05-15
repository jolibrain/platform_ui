import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import leftPanel from './layout/leftPanel';
import centralPanel from './layout/centralPanel';
import rightPanel from './layout/rightPanel';

class App extends Component {
  render() {
    return (
      <div className="App">
        <leftPanel appState={this.props.appState}/>
        <centralPanel appState={this.props.appState}/>
        <rightPanel appState={this.props.appState}/>
      </div>
    );
  }
}

export default App;
