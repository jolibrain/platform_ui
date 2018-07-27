import React from "react";
import { toJS } from "mobx";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import ImageList from "./ImageList";
import BoundingBoxDisplay from "./BoundingBoxDisplay";
import Threshold from "./Threshold";
import InputForm from "./InputForm";
import ParamSlider from "./ParamSlider";

import Description from "../commons/Description";
import CardCommands from "../commons/CardCommands";

@inject("imaginateStore")
@withRouter
@observer
export default class ImageConnector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedBoxIndex: -1,
      sliderBest: 1
    };

    this.onOver = this.onOver.bind(this);
    this.onLeave = this.onLeave.bind(this);

    this.confidenceTooltipFormatter = this.confidenceTooltipFormatter.bind(
      this
    );
    this.handleConfidenceThreshold = this.handleConfidenceThreshold.bind(this);
    this.handleBestThreshold = this.handleBestThreshold.bind(this);
  }

  onOver(index) {
    this.setState({ selectedBoxIndex: index });
  }

  onLeave() {
    this.setState({ selectedBoxIndex: -1 });
  }

  confidenceTooltipFormatter(value) {
    return (value / 100).toFixed(2);
  }

  handleConfidenceThreshold(value) {
    const { serviceSettings } = this.props.imaginateStore;
    serviceSettings.threshold.confidence = parseFloat((value / 100).toFixed(2));
    this.props.imaginateStore.predict();
  }

  handleBestThreshold(value) {
    const { serviceSettings } = this.props.imaginateStore;
    serviceSettings.request.best = parseInt(value, 10);
    this.setState({ sliderBest: value });
    this.props.imaginateStore.predict();
  }

  render() {
    const { service, serviceSettings } = this.props.imaginateStore;

    if (!service) return null;

    const input = service.selectedInput;

    let thresholds = [];

    if (
      input &&
      input.prediction &&
      !input.prediction.vals &&
      !input.isCtcOuput &&
      !input.isSegmentationInput
    ) {
      thresholds.push(<Threshold key="threshold" />);
      thresholds.push(
        <ParamSlider
          key="paramSliderConfidence"
          title="Confidence threshold"
          defaultValue={parseInt(
            serviceSettings.threshold.confidence * 100,
            10
          )}
          onAfterChange={this.handleConfidenceThreshold}
          tipFormatter={this.confidenceTooltipFormatter}
        />
      );

      if (service.settings.mltype === "classification") {
        // && service.respInfo.body.parameters.mllib[0].nclasses.length > 0

        thresholds.push(
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
    }

    return (
      <div className="imaginate">
        <div className="row">
          <div className="col-md-7">
            <div className="row">
              <div className="img-list col-sm-12">
                <ImageList />
              </div>
            </div>

            {service.isRequesting ? (
              <div className="alert alert-primary" role="alert">
                <i className="fas fa-spinner fa-spin" />&nbsp; Loading...
              </div>
            ) : (
              ""
            )}

            <div className="row">
              <BoundingBoxDisplay
                selectedBoxIndex={this.state.selectedBoxIndex}
                onOver={this.onOver}
                input={toJS(service.selectedInput)}
                displaySettings={toJS(serviceSettings.display)}
              />
            </div>
          </div>
          <div className="col-md-5">
            <InputForm />
            {thresholds}
            <div className="description">
              <Description
                selectedBoxIndex={this.state.selectedBoxIndex}
                onOver={this.onOver}
                onLeave={this.onLeave}
              />
            </div>
            <div className="commands">
              <CardCommands />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
