import React from "react";
import { observer, inject } from "mobx-react";

@inject("deepdetectStore")
@observer
export default class TrainingAlerts extends React.Component {
  render() {
    const { service } = this.props.deepdetectStore;

    let trainingAlert = null;

    switch (service.requestType) {
      case "serviceInfo":
        trainingAlert = (
          <div className="loading alert alert-primary" role="alert">
            <i className="fas fa-spinner fa-spin" />&nbsp; Loading service
            information...
          </div>
        );
        break;
      case "training":
        if (!service.trainMeasure) {
          trainingAlert = (
            <div className="loading alert alert-primary" role="alert">
              <i className="fas fa-spinner fa-spin" />&nbsp; Loading training
              data...
            </div>
          );
        }
        break;
      default:
        if (!service.isTraining) {
          trainingAlert = (
            <div className="loading alert alert-primary" role="alert">
              This job is not currently training.
            </div>
          );
        }
        break;
    }

    return trainingAlert;
  }
}
