import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

@inject("deepdetectStore")
@withRouter
@observer
export default class TrainingCard extends React.Component {
  constructor(props) {
    super(props);

    this.getValue = this.getValue.bind(this);
  }

  getValue(attr) {
    const { service } = this.props;
    const { measure, measure_hist } = service;

    let value = "--";

    if (measure) {
      value = measure[attr];
    } else if (
      measure_hist &&
      measure_hist[`${attr}_hist`] &&
      measure_hist[`${attr}_hist`].length > 0
    ) {
      value =
        measure_hist[`${attr}_hist`][measure_hist[`${attr}_hist`].length - 1];
    }

    if (
      !["remain_time_str", "iteration"].includes(attr) &&
      value &&
      value !== "--"
    ) {
      if (attr === "train_loss") {
        value = value.toFixed(10);
      } else {
        value = value.toFixed(5);
      }
    }

    return value;
  }

  render() {
    const { service } = this.props;
    let badges = [];

    badges.push({
      classNames: "badge badge-info",
      status: `Server: ${service.serverName}`
    });

    if (service.gpuid) {
      badges.push({
        classNames: "badge badge-info",
        status: `GPU: ${service.gpuid}`
      });
    }

    badges.push({
      classNames: "badge badge-secondary",
      status: service.settings.mltype
    });

    if (service.isTraining) {
      badges.push({
        classNames: "badge badge-success",
        status: "training"
      });
    } else if (service.respInfo && !service.trainJob) {
      badges.push({
        classNames: "badge badge-warning",
        status: "not training"
      });
    }

    if (service.isRequesting) {
      badges.push({
        classNames: "badge badge-warning",
        status: "",
        spinner: true
      });
    }

    const serviceUrl = `/training/${service.serverName}/${service.name}`;

    let info = [
      {
        text: "Train Loss",
        val: this.getValue("train_loss")
      },
      {
        text: "Iterations",
        val: this.getValue("iteration")
      }
    ];

    switch (service.settings.mltype) {
      case "segmentation":
        info.push({
          text: "Mean IOU",
          val: this.getValue("meaniou")
        });
        break;
      case "detection":
        info.push({
          text: "MAP",
          val: this.getValue("map")
        });
        break;
      case "ctc":
        info.push({
          text: "Accuracy",
          val: this.getValue("acc")
        });
        break;
      case "classification":
        info.push({
          text: "Accuracy",
          val: this.getValue("acc")
        });
        info.push({
          text: "F1",
          val: this.getValue("f1")
        });

        info.push({
          text: "mcll",
          val: this.getValue("mcll")
        });
        break;
      case "regression":
        info.push({
          text: "Eucll",
          val: this.getValue("eucll")
        });
        break;
      default:
        break;
    }

    info.push({
      text: "Time remaining",
      val: this.getValue("remain_time_str"),
      breakline: true
    });

    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">
            <span className="title">{service.name}</span>
            <br />
            {badges.map((badge, key) => {
              return (
                <span key={key} className={badge.classNames}>
                  {badge.spinner ? (
                    <i className="fas fa-spinner fa-spin" />
                  ) : (
                    ""
                  )}
                  {badge.status}
                </span>
              );
            })}
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

TrainingCard.propTypes = {
  service: PropTypes.object.isRequired
};
