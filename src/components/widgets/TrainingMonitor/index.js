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

    if (!service) return null;

    const measures = service.trainMeasure;

    const claccKeys = Object.keys(measures).filter(
      key => key.indexOf("clacc_") > -1
    );

    return (
      <div className="trainingmonitor">
        <div className="row">
          <div className="col-md-6 col-sm-12">
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
          </div>
          <div className="col-md-6 col-sm-12">
            <table className="table">
              <tbody>
                <tr>
                  <th scope="row">Accuracy</th>
                  <td>{measures.acc ? measures.acc : "--"}</td>
                </tr>
                <tr>
                  <th scope="row">Mean Accuracy</th>
                  <td>{measures.meanacc ? measures.meanacc : "--"}</td>
                </tr>
                <tr>
                  <th scope="row">Mean IOU</th>
                  <td>{measures.meaniou ? measures.meaniou : "--"}</td>
                </tr>
                <tr>
                  <th scope="row" />
                  <td>
                    <a className="btn btn-primary" href={service.urlTraining}>
                      Open JSON
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="row">
          {claccKeys
            .sort((a, b) => {
              return (
                parseInt(a.split("_").pop(), 10) -
                parseInt(b.split("_").pop(), 10)
              );
            })
            .map((key, index) => {
              let className = "col-md-1";

              if (measures[key] > 0) className = "col-md-1 clacc-level-0";

              if (measures[key] > 0.55)
                className = "col-md-1 clacc-level-warning";

              if (measures[key] > 0.9)
                className = "col-md-1 clacc-level-success";

              const title = key.split("_").pop();

              return (
                <div key={`clacc-${key}`} className={className}>
                  {measures[key] > 0 ? <b>#{title}</b> : <span>#{title}</span>}
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
