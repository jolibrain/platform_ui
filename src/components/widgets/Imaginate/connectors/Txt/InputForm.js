import React from "react";
import { observer } from "mobx-react";

import stores from "../../../../../stores/rootStore";

const InputForm = observer(class InputForm extends React.Component {
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
    const { imaginateStore } = stores;
    imaginateStore.service.addInput(content);
    imaginateStore.predict();
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
});
export default InputForm;
