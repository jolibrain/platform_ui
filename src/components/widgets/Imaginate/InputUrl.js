import React from "react";
import { inject, observer } from "mobx-react";

@inject("imaginateStore")
@observer
export default class InputUrl extends React.Component {
  constructor(props) {
    super(props);

    this.inputRef = React.createRef();

    this.handleButtonClean = this.handleButtonClean.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleButtonClean() {
    const input = this.inputRef.current;
    input.value = "";
    input.focus();
  }

  handleKeyPress(event) {
    if (event.key == "Enter") {
      const input = this.inputRef.current;
      this.props.addUrl(input.value);
      input.value = "";
    }
  }

  render() {
    return (
      <div className="card inputUrl">
        <div className="card-body">
          <div className="input-group">
            <input
              ref={this.inputRef}
              type="text"
              className="form-control"
              placeholder="Image URL"
              aria-label="Image URL"
              onKeyPress={this.handleKeyPress}
            />
            <div className="input-group-append input-group-text">
              <button
                className="btn"
                type="button"
                onClick={this.handleButtonClean}
              >
                <i className="fas fa-times" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
