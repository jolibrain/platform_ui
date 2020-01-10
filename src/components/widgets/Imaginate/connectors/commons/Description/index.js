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
export default class Description extends React.Component {
  render() {
    const { service, serviceSettings } = this.props.imaginateStore;

    if (!service || !service.selectedInput) return null;

    const input = service.selectedInput;

    let displayFormat = serviceSettings.display.format;

    if (this.props.displayFormat) {
      displayFormat = this.props.displayFormat;
    } else {
      if (serviceSettings.display.boundingBox) {
        displayFormat = "icons";
      }

      if (service.settings.mltype === "rois") {
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

      if (
        service.settings.mltype === "ctc" ||
        (service.respInfo &&
          service.respInfo.body &&
          service.respInfo.body.mltype === "classification")
      ) {
        displayFormat = "category";
      }

      if (
        service.respInfo.body.mltype === "classification" &&
        service.type === "unsupervised"
      ) {
        displayFormat = "nns";
      }
    }

    let output = [];
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
