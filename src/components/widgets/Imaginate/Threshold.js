import React from "react";
import { inject, observer } from "mobx-react";

@inject("imaginateStore")
@observer
export default class Threshold extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(thresholdValue) {
    const store = this.props.imaginateStore;
    store.setThreshold(thresholdValue);
    this.props.loadImage();
  }

  render() {
    const store = this.props.imaginateStore;

    if (store.selectedImage === null || !store.settings.threshold.controls) {
      return null;
    }

    let thresholds = [
      {
        name: "Salient",
        value: store.settings.threshold.controlSteps[0],
        classNames: "btn btn-secondary"
      },
      {
        name: "Medium",
        value: store.settings.threshold.controlSteps[1],
        classNames: "btn btn-secondary"
      },
      {
        name: "Detailed",
        value: store.settings.threshold.controlSteps[2],
        classNames: "btn btn-secondary"
      }
    ];

    thresholds.forEach(config => {
      if (config.value === store.confidence) {
        config.classNames = "btn btn-primary";
      }
    });

    return (
      <div className="btn-group" role="group" aria-label="Threshold controls">
        {thresholds.map((config, index) => {
          return (
            <button
              key={index}
              type="button"
              className={config.classNames}
              onClick={this.handleClick.bind(this, config.value)}
            >
              {config.name}
            </button>
          );
        })}
      </div>
    );
  }
}
