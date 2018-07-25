import React from "react";
import { toJS } from "mobx";
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
    const { server, service, serviceSettings } = this.props.imaginateStore;

    if (!service) return null;

    let thresholds = [];
    //10.10.77.61:18104/o
    http: if (
      !(
        service.selectedInput &&
        service.selectedInput.json &&
        service.selectedInput.json.body &&
        service.selectedInput.json.body.predictions &&
        service.selectedInput.json.body.predictions[0] &&
        typeof service.selectedInput.json.body.predictions[0].vals !==
          "undefined"
      ) ||
      !(
        service.selectedInput &&
        service.selectedInput.postData &&
        service.selectedInput.postData.parameters &&
        service.selectedInput.postData.parameters.output &&
        service.selectedInput.postData.parameters.output.ctc
      )
    ) {
      thresholds.push(<Threshold />);
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
