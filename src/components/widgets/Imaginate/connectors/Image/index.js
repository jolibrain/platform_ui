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
            <div className="row">
              <InputForm />
            </div>
            {store.service.selectedInput &&
            store.service.selectedInput.pixelSegmentation &&
            store.service.selectedInput.pixelSegmentation.length > 0 ? (
              ""
            ) : (
              <div className="row">
                <Threshold />
              </div>
            )}
            <div className="row description">
              <Description
                selectedBoxIndex={this.state.selectedBoxIndex}
                onOver={this.onOver}
                onLeave={this.onLeave}
              />
            </div>
            <div className="row commands">
              <CardCommands />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
