import React from "react";
import { inject, observer } from "mobx-react";

@inject("imaginateStore")
@observer
export default class InputForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdown: false,
      method: { id: 0, label: "URL" },
      availableMethods: [{ id: 0, label: "URL" }]
    };

    this.inputRef = React.createRef();

    this.handleButtonClean = this.handleButtonClean.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);

    this.handleOpenDropdown = this.handleOpenDropdown.bind(this);
    this.handleMethodChange = this.handleMethodChange.bind(this);

    this.addUrl = this.addUrl.bind(this);
  }

  handleOpenDropdown() {
    this.setState({
      dropdown: true
    });
  }

  handleMethodChange(index) {
    this.setState({
      dropdown: false,
      method: this.state.availableMethods[index]
    });
    const input = this.inputRef.current;
    input.focus();
  }

  handleButtonClean() {
    const input = this.inputRef.current;
    input.value = "";
    input.focus();
  }

  handleKeyPress(event) {
    if (event.key === "Enter") {
      const input = this.inputRef.current;

      if (this.state.method.label === "URL") {
        this.addUrl(input.value);
      }

      input.value = "";
    }
  }

  addUrl(url) {
    const store = this.props.imaginateStore;
    store.addInput(url);
    store.predict();
  }

  render() {
    return (
      <div className="card inputUrl">
        <div className="card-body">
          <div className="input-group">
            <div className="input-group-prepend">
              <button
                className="btn btn-outline-secondary dropdown-toggle"
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                onClick={this.handleOpenDropdown}
              >
                {this.state.method.label}
              </button>
              <div
                className={
                  this.state.dropdown ? "dropdown-menu show" : "dropdown-menu"
                }
              >
                {this.state.availableMethods.map((method, index) => {
                  return (
                    <a
                      key={index}
                      className="dropdown-item"
                      onClick={this.handleMethodChange.bind(this, index)}
                    >
                      {method.label}
                    </a>
                  );
                })}
              </div>
            </div>
            <input
              style={{ display: this.state.method.id === 0 ? "block" : "none" }}
              ref={this.inputRef}
              type="text"
              className="form-control"
              placeholder={this.state.method.label}
              aria-label={this.state.method.label}
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
