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
    var intervalId = setInterval(this.timer.bind(this), refreshRate);
    this.setState({ intervalId: intervalId });
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

    if (!server || !service || !service.trainMeasure) return null;

    let trainStatusBadgeClasses = "badge badge-danger";
    if (service.jobStatus.status === "running") {
      trainStatusBadgeClasses = "badge badge-success";
    }

    const measures = service.trainMeasure;
    const serviceUrl = `/training/${server.name}/${service.name}`;

    let info = [
      {
        text: "Train Loss",
        val: measures.train_loss ? measures.train_loss.toFixed(2) : "--"
      }
    ];

    switch (service.settings.mltype) {
      case "segmentation":
        info.push({
          text: "Mean IOU",
          val: measures.meaniou ? measures.meaniou.toFixed(2) : "--"
        });
        break;
      case "detection":
        info.push({
          text: "MAP",
          val: measures.map ? measures.map.toFixed(2) : "--"
        });
        break;
      case "ctc":
        info.push({
          text: "Accuracy",
          val: measures.acc ? measures.acc.toFixed(2) : "--"
        });
        break;
      case "classification":
        info.push({ text: "Accuracy", val: measures.acc || "--" });
        info.push({
          text: "Accuracy",
          val: measures.acc ? measures.acc.toFixed(2) : "--"
        });
        info.push({
          text: "F1",
          val: measures.f1 ? measures.f1.toFixed(2) : "--"
        });
        break;
      case "regression":
        info.push({
          text: "Eucll",
          val: measures.eucll ? measures.eucll.toFixed(2) : "--"
        });
        break;
      default:
        break;
    }

    info.push({ text: "Time remaining", val: measures.remain_time_str });

    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">
            {service.name}&nbsp;
            <span className="badge badge-secondary">
              {service.settings.mltype}
            </span>&nbsp;
            <span className={trainStatusBadgeClasses}>
              {service.jobStatus.status}
            </span>
          </h5>
          <p className="card-text">{service.settings.description}</p>
          <ul>
            {info.map((i, index) => {
              return (
                <li key={index}>
                  {i.text}: <b>{i.val}</b>
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
