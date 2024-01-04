/* eslint jsx-a11y/anchor-is-valid: "off" */
import React from "react";
import { toJS } from "mobx";
import { observer } from "mobx-react";
// import MjpegDecoder from "mjpeg-decoder";

import { Typeahead, Menu, MenuItem } from "react-bootstrap-typeahead";

import "react-bootstrap-typeahead/css/Typeahead.css";
//import "react-bootstrap-typeahead/css/Typeahead-bs4.css";
//

import stores from "../../../../../stores/rootStore";
import FileUploader from "./FileUploader";

const InputForm = observer(class InputForm extends React.Component {

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
        {
          id: "imageDrop",
          label: "Drop Image file",
          iconClassName: "fas fa-arrow-down",
          mediaType: "image",
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
          id: "folderPath",
          label: "Folder Path",
          iconClassName: "fas fa-folder",
          mediaType: "folders",
          isAvailable: props.isFolderSelectable
        },
        {
          id: "webcam",
          label: "Webcam",
          iconClassName: "fas fa-camera",
          mediaType: "webcam",
          isAvailable: isWebcamAvailable
        }
      ]
    };

    this.typeaheadRef = React.createRef();
    this.inputRef = React.createRef();

    this.handleButtonClean = this.handleButtonClean.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);

    this.handleOpenDropdown = this.handleOpenDropdown.bind(this);
    this.handleMethodChange = this.handleMethodChange.bind(this);

    this.handleInputChange = this.handleInputChange.bind(this);

    this.addUrl = this.addUrl.bind(this);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);

    this.handleFileDrop = this.handleFileDrop.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);

    if (this.props.methodId) {
      this.setState({
        method: this.state.availableMethods.find(
          m => m.id === this.props.methodId
        )
      });

      if(this.props.uniqueMethod) {
        this.setState({availableMethods: []})
      }
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

    const { imaginateStore, dataRepositoriesStore } = stores;
    const { systemPath } = dataRepositoriesStore.settings;

    const { fileExtensionFilter } = this.props;

    const selected = this.typeaheadRef.current.getInput().value;

    if (typeof selected !== "undefined" && selected.length > 0) {
      const folder = dataRepositoriesStore.repositories.find(
        r => r.label === selected
      );

      if (folder) {
        const { inputLoadCallback } = this.props;

        const callback = inputLoadCallback ? inputLoadCallback :
              (inputs) => {
                // Launch predict request only if folder contains files
                // This avoid recursive folder request on DD server
                if (inputs.length > 0) imaginateStore.predict();
              }

        imaginateStore.service.addInputFromPath(
          folder,
          systemPath,
          fileExtensionFilter,
          callback
        );

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
      const { imaginateStore } = stores;
      const { service } = imaginateStore;

      service.uiParams.mediaType = selectedMethod.mediaType;
    }

    this.setState({
      dropdown: false,
      focusInput: true,
      method: selectedMethod
    });
  }

  componentDidUpdate() {
    if (this.state.focusInput) {
      if (this.state.method.label === "Path") {
        this.typeaheadRef.current.focus();
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
    this.typeaheadRef.current.clear();
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

  handleFileDrop(files) {
    const { imaginateStore } = stores;
    files.forEach((file) => {
        const reader = new FileReader()

        reader.onabort = () => console.log('file reading was aborted')
        reader.onerror = () => console.log('file reading has failed')
        reader.onload = () => {
          const binaryStr = reader.result
          const base64String = btoa(
            String.fromCharCode(...new Uint8Array(binaryStr))
          );
          imaginateStore.service.addInputBase64(base64String);
          imaginateStore.predict();
        }
        reader.readAsArrayBuffer(file)
    })
  }

  addUrl(url) {
    const { imaginateStore } = stores;

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
      imaginateStore.service.addInput(url);
      imaginateStore.predict();
    }
  }

  render() {
    const { dropdown, method, availableMethods } = this.state;

    const inputMethods = availableMethods.filter(m => {
      return m.isAvailable;
    });

    const { dataRepositoriesStore } = stores;

    return (
      <div className="card inputUrl" ref={this.setWrapperRef}>
        <div className="card-body">
          <div className="input-group">
            <button
              className="btn btn-outline-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              onClick={this.handleOpenDropdown}
            >
              <i className={method.iconClassName}></i>&nbsp;
              {method.label}
            </button>
            <ul
              className={
                dropdown ? "dropdown-menu show" : "dropdown-menu"
              }
            >
              {inputMethods.map((method, index) => {
                return (
                  <li>
                    <a
                      key={index}
                      className="dropdown-item"
                      onClick={this.handleMethodChange.bind(this, index)}
                    >
                      <i className={method.iconClassName}></i>&nbsp;
                      {method.label}
                    </a>
                  </li>
                );
              })}
            </ul>
            <input
              style={{
                display: ["image", "video", "mjpeg"].includes(
                  method.id
                )
                  ? "block"
                  : "none"
              }}
              ref={this.inputRef}
              type="text"
              className="form-control"
              placeholder={method.label}
              aria-label={method.label}
              onKeyPress={this.handleKeyPress}
            />
            <Typeahead
              className={
                ["imagePath", "folderPath"].includes(method.id) ? "" : "hidden"
              }
              id="inlineFormInputPlatformDataLocation"
              ref={this.typeaheadRef}
              placeholder={
                dataRepositoriesStore.isLoading
                  ? "Fetching data repositories..."
                  : "Click here to select a data repository"
              }
              options={toJS(dataRepositoriesStore.repositories)}
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
            <button
              type="button"
              onClick={this.handleButtonClean}
              className={
                ["image", "imagePath", "folderPath"].includes(method.id) ?
                  "btn btn-outline-secondary" : "hidden"
              }
            >
              <i className="fas fa-times" />
            </button>
          </div>
          <FileUploader
            onChange={this.handleFileDrop}
            selectedMethod={method}
          />
        </div>
      </div>
    );
  }
});
export default InputForm;
