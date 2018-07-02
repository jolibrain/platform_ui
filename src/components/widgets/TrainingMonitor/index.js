import React from "react";
import { observer, inject } from "mobx-react";
import { withRouter } from "react-router-dom";

@inject("deepdetectStore")
@withRouter
@observer
export default class TrainingMonitor extends React.Component {
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
    const { service } = this.props.deepdetectStore;
    service.fetchTrainMetrics();
  }

  render() {
    const { service } = this.props.deepdetectStore;

    if (!service || !service.trainMetrics.hasOwnProperty("body")) return null;

    const measures = service.trainMetrics.body.measure;

    const claccKeys = Object.keys(measures).filter(
      key => key.indexOf("clacc_") > -1
    );

    return (
      <div className="trainingmonitor">
        <table className="table">
          <tbody>
            <tr>
              <th scope="row">Train Loss</th>
              <td>{measures.train_loss}</td>
            </tr>
            <tr>
              <th scope="row"># Iteration</th>
              <td>{measures.iteration}</td>
            </tr>
            <tr>
              <th scope="row">Iteration Time</th>
              <td>{measures.iter_time}</td>
            </tr>
            <tr>
              <th scope="row">Remaining time</th>
              <td>{measures.remain_time_str}</td>
            </tr>
          </tbody>
        </table>
        <div className="row">
          {claccKeys.map((key, index) => {
            let className = "col-md-1";

            if (measures[key] > 0) className = "col-md-1 clacc-level-0";

            if (measures[key] > 0.55)
              className = "col-md-1 clacc-level-warning";

            if (measures[key] > 0.9) className = "col-md-1 clacc-level-success";

            return (
              <div key={`clacc-${key}`} className={className}>
                {measures[key] > 0 ? <b>#{index}</b> : <span>#{index}</span>}
                <br />
                {measures[key] > 0 ? measures[key].toFixed(3) : "--"}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
