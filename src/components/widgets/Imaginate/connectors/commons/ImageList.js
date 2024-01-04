/* eslint jsx-a11y/anchor-is-valid: "off" */
import React from "react";
import { observer } from "mobx-react";

import stores from "../../../../../stores/rootStore";

const ImageList = observer(class ImageList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputs: []
    };

    this.selectInput = this.selectInput.bind(this);
    this.handleClearAll = this.handleClearAll.bind(this);
    this.handleClearInput = this.handleClearInput.bind(this);
    this.handleClickRandomize = this.handleClickRandomize.bind(this);
  }

  handleListKeydown(e) {
    const { imaginateStore } = stores;
    const store = imaginateStore;

    if (e.keyCode === 37) {
      store.service.selectPreviousInput();
    } else if (e.keyCode === 39) {
      store.service.selectNextInput();
    }
  }

  componentDidMount() {
    document.body.addEventListener("keydown", this.handleListKeydown.bind(this));
  }

  componentWillUnmount() {
    document.body.removeEventListener("keydown", this.handleListKeydown.bind(this));
  }

  componentWillMount() {
    const { imaginateStore } = stores;
    const { service } = imaginateStore;
    this.setState({ inputs: service.inputs });
  }

  componentWillReceiveProps(nextProps) {
    const { imaginateStore } = stores;
    const { service } = imaginateStore;
    this.setState({ inputs: service.inputs });
  }

  selectInput(index) {

    if ( index < 0 || index >= this.state.inputs.length ) {
      return;
    }

    const { imaginateStore } = stores;
    const store = imaginateStore;
    store.service.selectInput(index);
    store.predict();
  }

  handleClearAll() {
    const { imaginateStore } = stores;
    const { service } = imaginateStore;
    service.clearAllInputs();
  }

  handleClearInput(index) {
    const { imaginateStore } = stores;
    const { service } = imaginateStore;
    service.clearInput(index);
  }

  handleClickRandomize() {
    const { imaginateStore } = stores;
    const { service } = imaginateStore;
    service.shuffleInputs();
    this.setState({ inputs: service.inputs });
  }

  render() {
    const { imaginateStore } = stores;
    const { service } = imaginateStore;

    if (!service) return null;

    // Only keep base64 inputs and image files
    let inputs = this.state.inputs.filter(i => {
      return i.isBase64 ||
        /\.(jpe?g|png|gif|bmp)$/i.test(i.content.toLowerCase());
    });

    if (inputs.length === 0) {
      return (
        <div className="alert alert-warning" role="alert">
          Select an image to start <i className="fas fa-arrow-right" />
        </div>
      );
    } else {
      inputs = inputs.map((input, index) => {

        const content = input.isBase64 ?
              `data:image/jpeg;base64,${input.content}`
              : input.content

        return (
          <div key={`img-${index}`} className="slide">
            <img
              src={content}
              key={`img-${index}`}
              className={input.isActive ? "img-block active" : "img-block"}
              alt=""
              onClick={this.selectInput.bind(this, index)}
            />
            <i
              onClick={this.handleClearInput.bind(this, index)}
              className="deleteImg fas fa-times-circle"
            />
          </div>
        );
      });

      if (inputs.length > 100) {
        inputs = inputs.slice(0, 100);
      }

      return (
        <div id="carousel">
          <div className="slide">
            <a
              className="btn btn-outline-primary"
              role="button"
              onClick={this.handleClickRandomize}
            >
              <i className="fas fa-random" />
            </a>
          </div>
          {inputs}
        </div>
      );
    }
  }
});
export default ImageList;
