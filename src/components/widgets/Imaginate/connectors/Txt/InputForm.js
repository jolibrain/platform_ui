import React from "react";
import { inject, observer } from "mobx-react";

@inject("imaginateStore")
@observer
export default class InputForm extends React.Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();

    this.handleButtonSubmit = this.handleButtonSubmit.bind(this);

    this.submitInput = this.submitInput.bind(this);
  }

  handleButtonSubmit() {
    const input = this.inputRef.current;
    this.submitInput(input.value);
    input.value = "";
  }

  submitInput(content) {
    const store = this.props.imaginateStore;
    store.service.addInput(content);
    store.predict();
  }

  render() {
    return (
      <div className="card inputForm">
        <div className="card-body">
          <textarea
            ref={this.inputRef}
            className="form-control"
            placeholder="Type here..."
            aria-label="Type here..."
            rows="3"
          />

          <button
            className="btn btn-primary float-right"
            type="button"
            onClick={this.handleButtonSubmit}
          >
            Submit <i className="fas fa-check" />
          </button>
        </div>
      </div>
    );
  }
}
