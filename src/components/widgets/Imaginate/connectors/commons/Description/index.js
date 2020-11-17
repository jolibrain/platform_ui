import React from "react";
import { inject, observer } from "mobx-react";

import Category from "./formats/Category";
import Expectation from "./formats/Expectation";
import Icons from "./formats/Icons";
import List from "./formats/List";
import ListUrl from "./formats/ListUrl";
import Nns from "./formats/Nns";
import Rois from "./formats/Rois";
import Simple from "./formats/Simple";

@inject("imaginateStore")
@observer
class Description extends React.Component {

  constructor(props) {
    super(props);
    this._nodes = new Map();
    this.selectDisplayFormat = this.selectDisplayFormat.bind(this);
  }

  selectDisplayFormat() {

    const { service, serviceSettings } = this.props.imaginateStore;
    const input = service.selectedInput;

    let displayFormat = null;

    if(
      serviceSettings &&
      serviceSettings.display &&
      serviceSettings.display.format
    ) {
      displayFormat = serviceSettings.display.format;
    }

    if (
      serviceSettings &&
      serviceSettings.display &&
      serviceSettings.display.boundingBox
    ) {
      displayFormat = "icons";
    }

    if (
      service &&
      service.settings &&
      service.settings.mltype &&
      service.settings.mltype === "rois"
    ) {
      displayFormat = "nns";
    }

    if (
      input.json &&
      input.json.body &&
      input.json.body.predictions &&
      input.json.body.predictions[0] &&
      input.json.body.predictions[0].rois
    ) {
      displayFormat = "rois";
    }

    const chainVectorResult =
      input &&
      input.json &&
      input.json.body &&
      input.json.body.predictions &&
      input.json.body.predictions[0] &&
      input.json.body.predictions[0].classes &&
      input.json.body.predictions[0].classes[0] &&
      Object.keys(input.json.body.predictions[0].classes[0])
            .some(key => {
              return typeof input.json.body.predictions[0].classes[0][key].vector !== "undefined"
            })

    const isRegressionService =
          service &&
          service.respInfo &&
          service.respInfo.body &&
          service.respInfo.body.mltype === "regression";

    const isRegressionResult =
          input &&
          input.json &&
          input.json.body &&
          input.json.body.predictions[0] &&
          input.json.body.predictions[0].hasOwnProperty('vector');

    const isRegression =
          isRegressionService ||
          isRegressionResult ||
          chainVectorResult;

    const isCtcService =
          service &&
          service.settings &&
          service.settings.mltype &&
          service.settings.mltype === "ctc"

    const isClassificationResult =
          service &&
          service.respInfo &&
          service.respInfo.body &&
          service.respInfo.body.mltype === "classification"

    if (
      isCtcService ||
      isClassificationResult ||
      isRegression
    ) {
      displayFormat = "category";
    }

    if (
      service &&
      service.type &&
      service.type === "unsupervised" &&
      service.respInfo &&
      service.respInfo.body &&
      service.respInfo.body.mltype &&
      service.respInfo.body.mltype === "classification"
    ) {
      displayFormat = "nns";
    }

    if (
      this.props.displayFormat
    ) {
      displayFormat = this.props.displayFormat;
    }

    return displayFormat;

  }

  render() {
    const { service } = this.props.imaginateStore;

    if (!service || !service.selectedInput) return null;

    const input = service.selectedInput;
    let output = [];

    const displayFormat = this.selectDisplayFormat();

    switch (displayFormat) {
      default:
      case "simple":
        output.push(
          <Simple key="description-simple" input={input} {...this.props} />
        );
        break;

      case "expectation":
        output.push(
          <Expectation
            key="description-expectation"
            input={input}
            {...this.props}
          />
        );
        break;

      case "list":
        output.push(
          <List key="description-list" input={input} {...this.props} />
        );
        break;

      case "nns":
        output.push(
          <Nns key="description-nns" input={input} {...this.props} />
        );
        break;

      case "rois":
        output.push(
          <Rois key="description-rois" input={input} {...this.props} />
        );
        break;

      case "list-url":
        output.push(
          <ListUrl key="description-list-url" input={input} {...this.props} />
        );
        break;

      case "category":
        output.push(
          <Category key="description-category" input={input} {...this.props} />
        );
        break;

      case "icons":
        output.push(
          <Icons key="description-icons" input={input} {...this.props} />
        );
        break;
    }

    return <div>{output}</div>;
  }
}

export default Description;
