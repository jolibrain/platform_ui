import React from "react";
import { inject, observer } from "mobx-react";

@inject("imaginateStore")
@observer
export default class ImageListRandom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputs: [],
      maxFiles: 100,
      randomize: false
    };

    this.randomizeInputs = this.randomizeInputs.bind(this);
    this.selectInput = this.selectInput.bind(this);
    this.handleClearAll = this.handleClearAll.bind(this);
    this.handleClearInput = this.handleClearInput.bind(this);
    this.handleClickRandomize = this.handleClickRandomize.bind(this);
  }

  componentWillMount() {
    const { service } = this.props.imaginateStore;

    if (service && service.inputs && service.inputs.length > 0) {
      const mappedInputs = service.inputs.map((p, i) => {
        return {
          index: i,
          input: p
        };
      });
      this.setState({ inputs: mappedInputs });
    }
  }

  randomizeInputs() {
    const array = this.state.inputs;
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
    }
    return array;
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
    this.setState({ inputs: this.randomizeInputs() });
  }

  render() {
    const displayRandomizeButton = this.state.inputs.length > 0;

    return (
      <div id="carousel">
        {displayRandomizeButton ? (
          <div className="slide">
            <a
              className="btn btn-outline-primary"
              role="button"
              onClick={this.handleClickRandomize}
            >
              <i className="fas fa-random" />
            </a>
          </div>
        ) : (
          ""
        )}
        {this.state.inputs
          .slice(0, this.state.maxFiles)
          .reverse()
          .map(cell => {
            const { input, index } = cell;
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
          })}
      </div>
    );
  }
}
