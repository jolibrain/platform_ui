import React from "react";
import { toJS } from "mobx";
import { inject, observer } from "mobx-react";

import Webcam from "react-webcam";
import BoundingBox from "./BoundingBox";

import superagentPromise from "superagent-promise";
import _superagent from "superagent";

import InputForm from "../commons/InputForm";
import ParamSlider from "../commons/ParamSlider";
import Description from "../commons/Description";
import CardCommands from "../commons/CardCommands";

@inject("imaginateStore")
@observer
export default class WebcamConnector extends React.Component {
  constructor(props) {
    super(props);

    this.superagent = superagentPromise(_superagent, global.Promise);

    this.state = {
      selectedBoxIndex: -1,
      screenshot: null,
      path: "/api/private/predict",
      intervalId: null
    };

    this.updatePredict = this.updatePredict.bind(this);

    this.onOver = this.onOver.bind(this);
    this.onLeave = this.onLeave.bind(this);

    this.handleConfidenceThreshold = this.handleConfidenceThreshold.bind(this);
    this.confidenceTooltipFormatter = this.confidenceTooltipFormatter.bind(
      this
    );

    const { service } = this.props.imaginateStore;
    service.addInput("");
  }

  componentDidMount() {
    var intervalId = setInterval(this.updatePredict, 100);
    this.setState({ intervalId: intervalId });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  updatePredict() {
    const canvas = this.webcam.getCanvas();

    if (!canvas) {
      return null;
    }

    const { service } = this.props.imaginateStore;

    var screenshot = canvas
      .toDataURL("image/jpeg", 0.92)
      .replace(/^data:image\/\w+;base64,/, "");
    service.selectedInput.content = screenshot;

    this.props.imaginateStore.predict();
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
    if (serviceSettings.threshold.confidence === 0) {
      serviceSettings.threshold.confidence = 0.01;
    }
    this.props.imaginateStore.predict();
  }

  render() {
    const { service, serviceSettings } = this.props.imaginateStore;
    if (!service) return null;

    let uiControls = [];

    uiControls.push(<InputForm key="webcamInputForm" methodId="webcam" />);

    // Note: the threshold confidence variable in the key attribute
    // is a hack to update the slider when user pushes
    // on other external threshold (salient/medium/detailed for example)
    uiControls.push(
      <ParamSlider
        key={`paramSliderConfidence-${serviceSettings.threshold.confidence}`}
        title="Confidence threshold"
        defaultValue={parseInt(serviceSettings.threshold.confidence * 100, 10)}
        onAfterChange={this.handleConfidenceThreshold}
        tipFormatter={this.confidenceTooltipFormatter}
      />
    );

    // Hide segmentation values on unsupervised classification services
    // let showSegmentation = true;
    // if (
    //   typeof service.type !== "undefined" &&
    //   service.type === "unsupervised"
    // ) {
    //   showSegmentation = false;
    // }

    return (
      <div className="imaginate webcamConnector">
        <div className="row">
          <div className="col-md-7">
            <Webcam audio={false} ref={node => (this.webcam = node)} />
            <BoundingBox
              content="webcam.png"
              selectedBoxIndex={this.state.selectedBoxIndex}
              onOver={this.onOver}
              input={toJS(service.selectedInput)}
              displaySettings={toJS(serviceSettings.display)}
              boxFormat={this.state.boxFormat}
              showLabels={true}
              showSegmentation={false}
            />
          </div>
          <div className="col-md-5">
            {uiControls}
            <div className="commands">
              <CardCommands />
            </div>
            <div className="card description">
              <div className="card-body">
                <Description displayFormat="simple" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
