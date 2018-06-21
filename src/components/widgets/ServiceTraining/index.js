import React from "react";
import { inject, observer } from "mobx-react";

@inject("deepdetectStore")
@observer
export default class ServiceTraining extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      intervalId: null
    };

    this.timer();
  }

  componentDidMount() {
    const refreshRate = 10000;
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

    if (service == null || !service.training) return null;

    const trainMetrics = service.trainMetrics;

    return (
      <div className="servicetraining">
        <h5>
          <i className="fas fa-caret-right" /> Service Training
        </h5>
        <div className="block">
          <ul>
            <li>Status: {trainMetrics.head.status}</li>
            <li>Time: {trainMetrics.head.time}</li>
          </ul>
        </div>
        <div className="block">
          <table className="table table-sm">
            <tbody>
              {Object.keys(trainMetrics.body.measure).map((key, index) => {
                let value = trainMetrics.body.measure[key];

                if (typeof value === "boolean") {
                  value = value ? "True" : "False";
                }

                return (
                  <tr key={index}>
                    <th scope="row">{key}</th>
                    <td>{value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
