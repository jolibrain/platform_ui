import React from "react";
import { inject, observer } from "mobx-react";

@inject("imaginateStore")
@observer
export default class ImageList extends React.Component {
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

  componentWillMount() {
    const { service } = this.props.imaginateStore;
    this.setState({ inputs: service.inputs });
  }

  componentWillReceiveProps(nextProps) {
    const { service } = nextProps.imaginateStore;
    this.setState({ inputs: service.inputs });
  }

  selectInput(index) {
    const store = this.props.imaginateStore;
    store.service.selectInput(index);
    store.predict();
  }

  handleClearAll() {
    const { service } = this.props.imaginateStore;
    service.clearAllInputs();
  }

  handleClearInput(index) {
    const { service } = this.props.imaginateStore;
    service.clearInput(index);
  }

  handleClickRandomize() {
    let inputs = this.state.inputs;
    for (let i = inputs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [inputs[i], inputs[j]] = [inputs[j], inputs[i]];
    }
    this.setState({ inputs: inputs });
  }

  render() {
    const { service } = this.props.imaginateStore;

    if (!service) return null;

    let inputs = this.state.inputs.filter(i => {
      return /\.(jpe?g|png|gif|bmp)/i.test(i.content.toLowerCase());
    });

    if (inputs.length === 0) {
      return (
        <div className="alert alert-warning" role="alert">
          No image found in selected path
        </div>
      );
    } else {
      inputs = inputs.map((input, index) => {
        return (
          <div key={`img-${index}`} className="slide">
            <img
              src={input.content}
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
}
