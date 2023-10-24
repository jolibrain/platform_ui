import React from "react";
import { observer } from "mobx-react";

import stores from "../../../../../stores/rootStore";

const Threshold = observer(class Threshold extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(thresholdValue) {
    const { imaginateStore } = stores;
    imaginateStore.serviceSettings.threshold.confidence = thresholdValue;
    imaginateStore.predict();
  }

  render() {
    const { imaginateStore } = stores;

    if (
      !imaginateStore.service.selectedInput ||
      !imaginateStore.serviceSettings.threshold.controls ||
      (imaginateStore.service.selectedInput.postData &&
        imaginateStore.service.selectedInput.postData.parameters &&
        imaginateStore.service.selectedInput.postData.parameters.input &&
        imaginateStore.service.selectedInput.postData.parameters.input.segmentation)
    ) {
      return null;
    }

    let thresholds = [
      {
        name: "Salient",
        value: imaginateStore.serviceSettings.threshold.controlSteps[0],
        classNames: "btn btn-secondary"
      },
      {
        name: "Medium",
        value: imaginateStore.serviceSettings.threshold.controlSteps[1],
        classNames: "btn btn-secondary"
      },
      {
        name: "Detailed",
        value: imaginateStore.serviceSettings.threshold.controlSteps[2],
        classNames: "btn btn-secondary"
      }
    ];

    thresholds.forEach(config => {
      if (config.value === imaginateStore.serviceSettings.threshold.confidence) {
        config.classNames = "btn btn-primary";
      }
    });

    return (
      <div className="card threshold">
        <div className="card-body">
          <div
            className="btn-group"
            role="group"
            aria-label="Threshold controls"
          >
            {thresholds
              .map((config, index) => {
                return (
                  <button
                    key={index}
                    type="button"
                    className={`button ${config.classNames}`}
                    onClick={this.handleClick.bind(this, config.value)}
                  >
                    {config.name}
                  </button>
                );
              })
              .reduce((accu, elem, index) => {
                return accu === null
                  ? [elem]
                  : [...accu, <div key={`or-${index}`} className="or" />, elem];
              }, null)}
          </div>
        </div>
      </div>
    );
  }
});
export default Threshold;
