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

    let value = null;

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

    if (value && !["remain_time_str", "iteration"].includes(attr)) {
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
      status: service.serverName
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

    let info = [];

    const train_loss = this.getValue("train_loss");
    if (train_loss)
      info.push({
        text: "Train Loss",
        val: train_loss
      });

    const iteration = this.getValue("iteration");
    if (iteration)
      info.push({
        text: "Iterations",
        val: iteration
      });

    switch (service.settings.mltype) {
      case "segmentation":
        const meaniou = this.getValue("meaniou");
        if (meaniou)
          info.push({
            text: "Mean IOU",
            val: meaniou
          });
        break;
      case "detection":
        const map = this.getValue("map");
        if (map)
          info.push({
            text: "MAP",
            val: map
          });
        break;
      case "ctc":
        const ctc_acc = this.getValue("acc");
        if (ctc_acc)
          info.push({
            text: "Accuracy",
            val: ctc_acc
          });
        break;
      case "classification":
        const classif_acc = this.getValue("acc");
        if (classif_acc)
          info.push({
            text: "Accuracy",
            val: classif_acc
          });
        const f1 = this.getValue("f1");
        if (f1)
          info.push({
            text: "F1",
            val: f1
          });
        const mcll = this.getValue("mcll");
        if (mcll)
          info.push({
            text: "mcll",
            val: mcll
          });
        break;
      case "regression":
        const eucll = this.getValue("eucll");
        if (eucll)
          info.push({
            text: "Eucll",
            val: eucll
          });
        break;
      default:
        break;
    }

    const remain_time_str = this.getValue("remain_time_str");
    info.push({
      text: "Time remaining",
      val: remain_time_str,
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
          {info.length > 0 ? (
            <div>
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
          ) : (
            <a className="btn btn-outline-primary disabled">
              <i className="fas fa-spinner fa-spin" /> Waiting for data...
            </a>
          )}
        </div>
      </div>
    );
  }
}

TrainingCard.propTypes = {
  service: PropTypes.object.isRequired
};
