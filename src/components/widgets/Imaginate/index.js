import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import ImageList from "./ImageList";
import BoundingBoxDisplay from "./BoundingBoxDisplay";
import CurlCommand from "./CurlCommand";
import JsonResponse from "./JsonResponse";
import Description from "./Description";
import Threshold from "./Threshold";

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

  componentWillMount() {
    this.selectImage(0);
  }

  componentDidMount() {
    this.selectImage(0);
  }

  componentWillReceiveProps() {
    this.selectImage(0);
  }

  selectImage(index) {
    const store = this.props.imaginateStore;
    store.setSelectedImage(index);
    this.loadImage();
  }

  loadImage() {
    const store = this.props.imaginateStore;
    const ddStore = this.props.deepdetectStore;

    if (ddStore.currentServiceIndex === -1) return null;

    const service = ddStore.services[ddStore.currentServiceIndex];

    // if (typeof servive === "undefined") return null;

    store.initPredict(service.name);
    store.predict(service.name);
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
          <div className="col-md-8">
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
          <div className="col-md-4">
            <div className="row threshold">
              <Threshold loadImage={this.loadImage} />
            </div>
            <div className="row description">
              <Description
                selectedBoxIndex={this.state.selectedBoxIndex}
                onOver={this.onOver}
                onLeave={this.onLeave}
              />
            </div>
            <div className="row commands">
              <CurlCommand />
            </div>
            <div className="row json">
              <JsonResponse />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
