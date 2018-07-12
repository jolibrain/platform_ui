import React from "react";
import { inject, observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

@inject("deepdetectStore")
@withRouter
@observer
export default class TrainingCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      intervalId: null
    };

    this.timer();
  }

  componentDidMount() {
    const refreshRate = this.props.deepdetectStore.settings.infoRefreshRate;
    const { service } = this.props;

    var intervalId = setInterval(this.timer.bind(this), refreshRate);
    this.setState({ intervalId: intervalId });

    service.serviceInfo();
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  timer() {
    const { service } = this.props;
    service.fetchTrainMetrics();
  }

  render() {
    const { server, service } = this.props;

    if (!server || !service) return null;

    let trainStatusBadge = {
      classNames: "badge badge-danger",
      status: "unknown"
    };

    switch (service.requestType) {
      case "serviceInfo":
        trainStatusBadge = {
          classNames: "badge badge-info",
          status: "Loading service info..."
        };
        break;
      case "training":
        if (!service.trainMeasure) {
          trainStatusBadge = {
            classNames: "badge badge-info",
            status: "Loading data..."
          };
        } else if (service.isTraining) {
          trainStatusBadge = {
            classNames: "badge badge-success",
            status: "training"
          };
        }
        break;
      default:
        if (service.isTraining) {
          trainStatusBadge = {
            classNames: "badge badge-success",
            status: "training"
          };
        } else {
          trainStatusBadge = {
            classNames: "badge badge-error",
            status: "not training"
          };
        }
        break;
    }

    const measures = service.trainMeasure;
    const serviceUrl = `/training/${server.name}/${service.name}`;

    let info = [
      {
        text: "Train Loss",
        val:
          measures && measures.train_loss
            ? measures.train_loss.toFixed(2)
            : "--"
      }
    ];

    switch (service.settings.mltype) {
      case "segmentation":
        info.push({
          text: "Mean IOU",
          val: measures && measures.meaniou ? measures.meaniou.toFixed(2) : "--"
        });
        break;
      case "detection":
        info.push({
          text: "MAP",
          val: measures && measures.map ? measures.map.toFixed(2) : "--"
        });
        break;
      case "ctc":
        info.push({
          text: "Accuracy",
          val: measures && measures.acc ? measures.acc.toFixed(2) : "--"
        });
        break;
      case "classification":
        info.push({
          text: "Accuracy",
          val: measures && measures.acc ? measures.acc.toFixed(2) : "--"
        });
        info.push({
          text: "F1",
          val: measures && measures.f1 ? measures.f1.toFixed(2) : "--"
        });
        break;
      case "regression":
        info.push({
          text: "Eucll",
          val: measures && measures.eucll ? measures.eucll.toFixed(2) : "--"
        });
        break;
      default:
        break;
    }

    info.push({
      text: "Time remaining",
      val:
        measures && measures.remain_time_str ? measures.remain_time_str : "--",
      breakline: true
    });

    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">
            {service.name}
            <br />
            <span className="badge badge-secondary">
              {service.settings.mltype}
            </span>&nbsp;
            <span className={trainStatusBadge.classNames}>
              {trainStatusBadge.status}
            </span>
          </h5>
          <p className="card-text">{service.settings.description}</p>
          <ul>
            {info.map((i, index) => {
              return (
                <li key={index}>
                  {i.text}: {i.breakline ? <br /> : ""}
                  <b>{i.val}</b>
                </li>
              );
            })}
          </ul>
          <Link to={serviceUrl} className="btn btn-outline-primary">
            Monitor
          </Link>
        </div>
      </div>
    );
  }
}
