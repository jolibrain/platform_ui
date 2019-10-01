import React from "react";
import { inject, observer } from "mobx-react";
import MjpegDecoder from "mjpeg-decoder";

import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead-bs4.css";

@inject("imaginateStore")
@observer
class InputForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      decoder: null
    };

    this.inputRef = React.createRef();

    this.handleButtonClean = this.handleButtonClean.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);

    this.addUrl = this.addUrl.bind(this);
  }

  componentDidUpdate() {
    if (this.state.focusInput) {
      const input = this.inputRef.current;
      input.focus();
    }
  }

  handleButtonClean() {
    const input = this.inputRef.current;
    input.value = "";
    input.focus();
  }

  handleKeyPress(event) {
    if (event.key === "Enter") {
      const input = this.inputRef.current;
      this.addUrl(input.value);
    }
  }

  addUrl(url) {
    const store = this.props.imaginateStore;

    const decoder = new MjpegDecoder(url, { interval: 3000 });
    decoder.start();

    decoder.on("frame", (frame, seq) => {
      const base64Img = btoa(String.fromCharCode.apply(null, frame));
      store.service.addOrReplaceInput(0, base64Img);
      store.predict();
    });

    this.setState({ decoder: decoder });
  }

  render() {
    return (
      <div className="card inputUrl" ref={this.setWrapperRef}>
        <div className="card-body">
          <div className="input-group">
            <input
              ref={this.inputRef}
              type="text"
              className="form-control"
              placeholder="mjpeg URL"
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

export default InputForm;
