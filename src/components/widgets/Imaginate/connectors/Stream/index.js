import React from "react";
import { toJS } from "mobx";
import { inject, observer } from "mobx-react";

import BoundingBox from "./BoundingBox";

import superagentPromise from "superagent-promise";
import _superagent from "superagent";

import InputForm from "../commons/InputForm";
import ParamSlider from "../commons/ParamSlider";
import Description from "../commons/Description";
import CardCommands from "../commons/CardCommands";

@inject("imaginateStore")
@observer
export default class StreamConnector extends React.Component {
  constructor(props) {
    super(props);

    this.superagent = superagentPromise(_superagent, global.Promise);

    this.state = {
      selectedBoxIndex: -1,
      screenshot: null,
      path: "/api/private/predict"
    };

    this.video = React.createRef();
    this.canvas = React.createRef();
    this.screen = React.createRef();

    this.drawFrame = this.drawFrame.bind(this);

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

  drawFrame(video) {
    const screen = this.screen.current;
    screen.height = 500;
    screen.width = 500;
    let context = screen.getContext("2d");
    context.drawImage(video, 0, 0, screen.width, screen.height);
    context.drawImage(video, 0, 0, screen.width, screen.height);
    requestAnimationFrame(this.drawFrame);
    console.log("Screen", screen);
  }

  componentDidMount() {
    // const _this = this;
    // This code runs a video stream.
    // const video = this.video.current;
    //		navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    //			.then(function(stream) {
    //				video.srcObject = stream
    //				video.play()
    //				video.addEventListener("play", _this.drawFrame(video), false);
    //				console.log("Video is playing from component")
    //			})
  }

  doLoad() {
    this.video = document.getElementById("video");
    this.c1 = document.getElementById("c1");
    this.ctx1 = this.c1.getContext("2d");
    this.c2 = document.getElementById("c2");
    this.ctx2 = this.c2.getContext("2d");
    let self = this;
    this.video.addEventListener(
      "play",
      function() {
        self.width = self.video.videoWidth / 2;
        self.height = self.video.videoHeight / 2;
        self.timerCallback();
      },
      false
    );
  }

  updatePredict() {
    const canvas = this.stream.getCanvas();
    if (!canvas) {
      setTimeout(this.updatePredict, 2000);
      return null;
    }

    const { service } = this.props.imaginateStore;

    var screenshot = canvas
      .toDataURL("image/jpeg", 0.92)
      .replace(/^data:image\/\w+;base64,/, "");
    service.selectedInput.content = screenshot;

    this.props.imaginateStore.predict();
    setTimeout(this.updatePredict, 3000);
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

    uiControls.push(<InputForm key="streamImputform" methodId="stream" />);

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
      <div className="imaginate streamConnector">
        <div className="row">
          <div className="col-md-7">
            <video
              ref={this.video}
              width="500"
              height="500"
              controls
              src="/data/alx/Appllo_11.webm"
            >
              Video stream is not available.
            </video>
            <canvas ref={this.canvas1} width="500" height="500">
              Canvas is not available in this browser.
            </canvas>
            <canvas ref={this.canvas2} width="500" height="500">
              Canvas is not available in this browser.
            </canvas>
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
