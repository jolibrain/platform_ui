import React from "react";
import { toJS } from "mobx";
import { inject, observer } from "mobx-react";

import { Typeahead, Menu, MenuItem } from "react-bootstrap-typeahead";

import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead-bs4.css";

@inject("imaginateStore")
@inject("dataRepositoriesStore")
@observer
class InputForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdown: false,
      method: { id: 0, label: "Image URL" },
      availableMethods: [
        { id: 0, label: "Image URL" },
        { id: 1, label: "Path" }
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
    const { dataRepositoriesStore } = this.props;

    if (dataRepositoriesStore.loaded == false) {
      dataRepositoriesStore.refresh();
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
    this.setState({
      dropdown: false,
      method: this.state.availableMethods[index],
      focusInput: true
    });
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
    store.service.addInput(url);
    store.predict();
  }

  render() {
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
            <Typeahead
              className={this.state.method.label === "Path" ? "" : "hidden"}
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
