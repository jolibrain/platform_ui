import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

@inject("deepdetectStore")
@withRouter
@observer
export default class TrainingCard extends React.Component {
  render() {
    const { service } = this.props;
    const measures = service.trainMeasure;

    if (!service) return null;

    let badges = [];

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
        classNames: "badge badge-info",
        status: "",
        loading: true
      });
    }

    const serviceUrl = `/training/${service.serverName}/${service.name}`;

    let info = [
      {
        text: "Train Loss",
        val: measures && measures.train_loss ? measures.train_loss : "--"
      },
      {
        text: "Iterations",
        val: measures && measures.iteration ? measures.iteration : "--"
      }
    ];

    switch (service.settings.mltype) {
      case "segmentation":
        info.push({
          text: "Mean IOU",
          val: measures && measures.meaniou ? measures.meaniou : "--"
        });
        break;
      case "detection":
        info.push({
          text: "MAP",
          val: measures && measures.map ? measures.map : "--"
        });
        break;
      case "ctc":
        info.push({
          text: "Accuracy",
          val: measures && measures.acc ? measures.acc : "--"
        });
        break;
      case "classification":
        info.push({
          text: "Accuracy",
          val: measures && measures.acc ? measures.acc : "--"
        });
        info.push({
          text: "F1",
          val: measures && measures.f1 ? measures.f1 : "--"
        });

        info.push({
          text: "mcll",
          val: measures && measures.mcll ? measures.mcll : "--"
        });
        break;
      case "regression":
        info.push({
          text: "Eucll",
          val: measures && measures.eucll ? measures.eucll : "--"
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
            {badges.map((badge, key) => {
              return (
                <span key={key} className={badge.classNames}>
                  {badge.loading ? (
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
