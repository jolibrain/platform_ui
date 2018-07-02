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

    if (!server || !service || !service.trainMetrics.hasOwnProperty("body"))
      return null;

    const measures = service.trainMetrics.body.measure;
    const serviceUrl = `/training/${server.name}/${service.name}`;

    const trainLoss = measures.train_loss.toFixed(2);
    let lossBadgeClasses = "badge badge-danger";
    if (trainLoss > 0.8) {
      lossBadgeClasses = "badge badge-warning";
    }
    if (trainLoss > 0.95) {
      lossBadgeClasses = "badge badge-success";
    }

    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">
            {service.name}&nbsp;
            <span className={lossBadgeClasses}>Train Loss: {trainLoss}</span>
          </h5>
          <p className="card-text">{service.settings.description}</p>
          <p className="card-text">
            Time remaining: <b>{measures.remain_time_str}</b>
          </p>
          <Link to={serviceUrl} className="btn btn-outline-primary">
            Monitor
          </Link>
        </div>
      </div>
    );
  }
}
