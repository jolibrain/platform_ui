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
    const store = this.props.imaginateStore;

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
            {(store.service.selectedInput &&
              store.service.selectedInput.json &&
              store.service.selectedInput.json.body &&
              store.service.selectedInput.json.body.predictions &&
              store.service.selectedInput.json.body.predictions[0] &&
              typeof store.service.selectedInput.json.body.predictions[0]
                .vals !== "undefined") ||
            (store.service.selectedInput &&
              store.service.selectedInput.postData &&
              store.service.selectedInput.postData.parameters &&
              store.service.selectedInput.postData.parameters.output &&
              store.service.selectedInput.postData.parameters.output.ctc) ? (
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
