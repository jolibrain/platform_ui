import React from "react";
import { observer } from "mobx-react";

import InputList from "./InputList";
import InputForm from "./InputForm";

import ParamSlider from "../commons/ParamSlider";
import Description from "../commons/Description";
import CardCommands from "../commons/CardCommands";

import stores from "../../../../../stores/rootStore";

const TxtConnector = observer(class TxtConnector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sliderBest: 1
    };

    this.confidenceTooltipFormatter = this.confidenceTooltipFormatter.bind(
      this
    );
    this.handleConfidenceThreshold = this.handleConfidenceThreshold.bind(this);
    this.handleBestThreshold = this.handleBestThreshold.bind(this);
  }

  confidenceTooltipFormatter(value) {
    return (value / 100).toFixed(2);
  }

  handleConfidenceThreshold(value) {
    const { imaginateStore } = stores;
    const { serviceSettings } = imaginateStore;
    serviceSettings.threshold.confidence = parseFloat((value / 100).toFixed(2));
    if (serviceSettings.threshold.confidence === 0) {
      serviceSettings.threshold.confidence = 0.01;
    }
    imaginateStore.predict();
  }

  handleBestThreshold(value) {
    const { imaginateStore } = stores;
    const { serviceSettings } = imaginateStore;
    serviceSettings.request.best = parseInt(value, 10);
    this.setState({ sliderBest: value });
    imaginateStore.predict();
  }

  render() {
    const { imaginateStore } = stores;
    const { serviceSettings } = imaginateStore;

    let uiControls = [];

    uiControls.push(
      <ParamSlider
        key="paramSliderConfidence"
        title="Confidence threshold"
        defaultValue={parseInt(serviceSettings.threshold.confidence * 100, 10)}
        onAfterChange={this.handleConfidenceThreshold}
        tipFormatter={this.confidenceTooltipFormatter}
      />
    );

    if (serviceSettings.mltype === "classification") {
      uiControls.push(
        <ParamSlider
          key="paramSliderBest"
          title="Best threshold"
          defaultValue={this.state.sliderBest}
          onAfterChange={this.handleBestThreshold}
          min={1}
          max={20}
        />
      );
    }

    return (
      <div className="imaginate txtConnector">
        <div className="row">
          <div className="col-md-7">
            <InputList />
          </div>
          <div className="col-md-5">
            {uiControls}
            <InputForm />
            <div className="description">
              <Description displayFormat="simple" />
            </div>
            <div className="commands">
              <CardCommands />
            </div>
          </div>
        </div>
      </div>
    );
  }
});
export default TxtConnector;
