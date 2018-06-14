import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import ImageList from "./ImageList";
import BoundingBoxDisplay from "./BoundingBoxDisplay";
import Description from "./Description";
import CardCommands from "./CardCommands";
import Threshold from "./Threshold";
import InputData from "./InputData";

@inject("commonStore")
@inject("imaginateStore")
@inject("deepdetectStore")
@withRouter
@observer
export default class Imaginate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedBoxIndex: -1
    };

    this.selectImage = this.selectImage.bind(this);
    this.loadImage = this.loadImage.bind(this);

    this.onOver = this.onOver.bind(this);
    this.onLeave = this.onLeave.bind(this);
  }

  selectImage(index) {
    const store = this.props.imaginateStore;
    store.setSelectedImage(index);
    this.loadImage();
  }

  loadImage() {
    const store = this.props.imaginateStore;
    const ddStore = this.props.deepdetectStore;

    if (ddStore.server.currentServiceIndex === -1) return null;

    const service = ddStore.service;

    if (typeof service === "undefined") {
      this.props.history.push(`/predict/new`);
    }

    store.initPredict(service);
    store.predict(ddStore.server.settings);
  }

  onOver(index) {
    this.setState({ selectedBoxIndex: index });
  }

  onLeave() {
    this.setState({ selectedBoxIndex: -1 });
  }

  render() {
    const store = this.props.imaginateStore;
    const ddStore = this.props.deepdetectStore;

    if (ddStore.currentServiceIndex === -1 || !store.isLoaded) return null;

    return (
      <div className="imaginate">
        <div className="row">
          <div className="col-md-7">
            <div className="row">
              <div className="img-list col-sm-12">
                <ImageList selectImage={this.selectImage} />
              </div>
            </div>

            <div className="row">
              <BoundingBoxDisplay
                selectedBoxIndex={this.state.selectedBoxIndex}
                onOver={this.onOver}
                onLeave={this.onLeave}
              />
            </div>
          </div>
          <div className="col-md-5">
            <div className="row">
              <InputData loadImage={this.loadImage} />
            </div>
            {store.selectedImage &&
            store.selectedImage.pixelSegmentation.length > 0 ? (
              ""
            ) : (
              <div className="row">
                <Threshold loadImage={this.loadImage} />
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
              <CardCommands
                image={store.selectedImage}
                isRequesting={store.isRequesting}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
