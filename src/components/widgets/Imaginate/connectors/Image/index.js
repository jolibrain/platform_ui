import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import ImageList from "./ImageList";
import BoundingBoxDisplay from "./BoundingBoxDisplay";
import Threshold from "./Threshold";
import InputForm from "./InputForm";

import Description from "../commons/Description";
import CardCommands from "../commons/CardCommands";

@inject("imaginateStore")
@withRouter
@observer
export default class ImageConnector extends React.Component {
  constructor(props) {
    super(props);

    this.state = { selectedBoxIndex: -1 };

    this.onOver = this.onOver.bind(this);
    this.onLeave = this.onLeave.bind(this);
  }

  onOver(index) {
    this.setState({ selectedBoxIndex: index });
  }

  onLeave() {
    this.setState({ selectedBoxIndex: -1 });
  }

  render() {
    const { server, service } = this.props.imaginateStore;

    if (!service) return null;

    return (
      <div className="imaginate">
        <div className="row">
          <div className="col-md-7">
            <div className="row">
              <div className="img-list col-sm-12">
                <ImageList />
              </div>
            </div>

            <div className="row">
              <BoundingBoxDisplay
                selectedBoxIndex={this.state.selectedBoxIndex}
                onOver={this.onOver}
              />
            </div>
          </div>
          <div className="col-md-5">
            <InputForm />
            {(service.selectedInput &&
              service.selectedInput.json &&
              service.selectedInput.json.body &&
              service.selectedInput.json.body.predictions &&
              service.selectedInput.json.body.predictions[0] &&
              typeof service.selectedInput.json.body.predictions[0].vals !==
                "undefined") ||
            (service.selectedInput &&
              service.selectedInput.postData &&
              service.selectedInput.postData.parameters &&
              service.selectedInput.postData.parameters.output &&
              service.selectedInput.postData.parameters.output.ctc) ? (
              ""
            ) : (
              <Threshold />
            )}
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
