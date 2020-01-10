import React from "react";
import { toJS } from "mobx";
import { inject, observer } from "mobx-react";
// import MjpegDecoder from "mjpeg-decoder";

import { Typeahead, Menu, MenuItem } from "react-bootstrap-typeahead";

import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead-bs4.css";

@inject("imaginateStore")
@inject("dataRepositoriesStore")
@observer
class InputForm extends React.Component {
  constructor(props) {
    super(props);

    const isWebcamAvailable =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.protocol === "https:";

    this.state = {
      dropdown: false,
      method: {
        id: "image",
        label: "Image URL",
        iconClassName: "fas fa-image"
      },
      availableMethods: [
        {
          id: "image",
          label: "Image URL",
          iconClassName: "fas fa-image",
          mediaType: "image",
          isAvailable: true
        },
        {
          id: "imagePath",
          label: "Platform Data",
          iconClassName: "fas fa-folder-open",
          mediaType: "imagePath",
          isAvailable: true
        },
        // {
        //   id: "video",
        //   label: "Platform Video URL",
        //   iconClassName: "fas fa-video",
        //   mediaType: "stream"
        // },
        // {
        //   id: "mjpeg",
        //   label: "Mjpeg Stream",
        //   iconClassName: "fas fa-film",
        //   mediaType: "mjpeg"
        // },
        {
          id: "webcam",
          label: "Webcam",
          iconClassName: "fas fa-camera",
          mediaType: "webcam",
          isAvailable: isWebcamAvailable
        }
      ]
    };

    this.inputRef = React.createRef();

    this.handleButtonClean = this.handleButtonClean.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);

    this.handleOpenDropdown = this.handleOpenDropdown.bind(this);
    this.handleMethodChange = this.handleMethodChange.bind(this);

    this.handleInputChange = this.handleInputChange.bind(this);

    this.addUrl = this.addUrl.bind(this);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);

    if (this.props.methodId) {
      this.setState({
        method: this.state.availableMethods.find(
          m => m.id === this.props.methodId
        )
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  /**
   * Set the wrapper ref
   */
  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (
      this.wrapperRef &&
      !this.wrapperRef.contains(event.target) &&
      this.state.dropdown
    ) {
      this.setState({ dropdown: false });
    }
  }

  handleInputChange() {
    const { dataRepositoriesStore } = this.props;
    const { systemPath } = dataRepositoriesStore.settings;

    const typeahead = this.typeahead.getInstance();
    const selected = typeahead.getInput().value;

    if (typeof selected !== "undefined" && selected.length > 0) {
      const folder = dataRepositoriesStore.repositories.find(
        r => r.label === selected
      );

      if (folder) {
        const store = this.props.imaginateStore;
        store.service.addInputFromPath(folder, systemPath, inputs => {
          // Launch predict request only if folder contains files
          // This avoid recursive folder request on DD server
          // bugfix #353
          if (inputs.length > 0) store.predict();
        });
      }
    }
  }

  handleOpenDropdown() {
    this.setState({
      dropdown: true,
      focusInput: false
    });
  }

  handleMethodChange(index) {
    const selectedMethod = this.state.availableMethods[index];

    if (this.state.availableMethods[index].mediaType) {
      const { imaginateStore } = this.props;
      const { service } = imaginateStore;

      service.uiParams.mediaType = selectedMethod.mediaType;
    } else {
      this.setState({
        dropdown: false,
        method: selectedMethod,
        focusInput: true
      });
    }
  }

  componentDidUpdate() {
    if (this.state.focusInput) {
      if (this.state.method.label === "Path") {
        this.typeahead.getInstance().focus();
      } else {
        const input = this.inputRef.current;
        input.focus();
      }
    }
  }

  handleButtonClean() {
    const input = this.inputRef.current;
    input.value = "";
    input.focus();
    this.typeahead.getInstance().clear();
  }

  handleKeyPress(event) {
    if (event.key === "Enter") {
      const input = this.inputRef.current;

      if (this.state.method.label === "Image URL" && input.value.length > 0) {
        this.addUrl(input.value);
      }

      input.value = "";
    }
  }

  addUrl(url) {
    const store = this.props.imaginateStore;

    if (this.state.method.id === "mjpeg") {
      //      const decoder = new MjpegDecoder(url, { interval: 3000 });
      //      decoder.start();
      //
      //      decoder.on("frame", (frame, seq) => {
      //        const base64Img = btoa(String.fromCharCode.apply(null, frame));
      //        store.service.addOrReplaceInput(0, base64Img);
      //        store.predict();
      //      });
      //
      //      this.setState({ decoder: decoder });
    } else {
      store.service.addInput(url);
      store.predict();
    }
  }

  render() {
    const inputMethods = this.state.availableMethods.filter(m => {
      return m.isAvailable;
    });
    return (
      <div className="card inputUrl" ref={this.setWrapperRef}>
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
                <i className={this.state.method.iconClassName}></i>&nbsp;
                {this.state.method.label}
              </button>
              <div
                className={
                  this.state.dropdown ? "dropdown-menu show" : "dropdown-menu"
                }
              >
                {inputMethods.map((method, index) => {
                  return (
                    <a
                      key={index}
                      className="dropdown-item"
                      onClick={this.handleMethodChange.bind(this, index)}
                    >
                      <i className={method.iconClassName}></i>&nbsp;
                      {method.label}
                    </a>
                  );
                })}
              </div>
            </div>
            <input
              style={{
                display: ["image", "video", "mjpeg"].includes(
                  this.state.method.id
                )
                  ? "block"
                  : "none"
              }}
              ref={this.inputRef}
              type="text"
              className="form-control"
              placeholder={this.state.method.label}
              aria-label={this.state.method.label}
              onKeyPress={this.handleKeyPress}
            />
            <Typeahead
              className={
                ["imagePath"].includes(this.state.method.id) ? "" : "hidden"
              }
              id="inlineFormInputModelLocation"
              ref={typeahead => (this.typeahead = typeahead)}
              options={toJS(this.props.dataRepositoriesStore.repositories)}
              onChange={this.handleInputChange}
              renderMenu={(results, menuProps) => (
                <Menu {...menuProps}>
                  {results
                    .sort((a, b) => {
                      // Sort by name
                      var nameA = a.label.toUpperCase();
                      var nameB = b.label.toUpperCase();
                      if (nameA < nameB) {
                        return -1;
                      }
                      if (nameA > nameB) {
                        return 1;
                      }

                      return 0;
                    })
                    .map((folder, index) => {
                      return (
                        <MenuItem
                          key={index}
                          option={folder}
                          position={index}
                          title={folder.path}
                        >
                          {folder.label}
                        </MenuItem>
                      );
                    })}
                </Menu>
              )}
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
