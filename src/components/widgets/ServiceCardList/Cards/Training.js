import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

@inject("deepdetectStore")
@inject("modalStore")
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
        value = parseFloat(value);

        if (typeof value.toFixed === "function") {
          if (value > 1) {
            value = value.toFixed(3);
          } else {
            // Find position of first number after the comma
            const zeroPosition = value
              .toString()
              .split("0")
              .slice(2)
              .findIndex(elem => elem.length > 0);

            value = value.toFixed(zeroPosition + 4);
          }
        }
      } else {
        value = value.toFixed(5);
      }
    }

    return value;
  }

  render() {
    const { service } = this.props;
    let status = "running";

    let info = [];

    const train_loss = this.getValue("train_loss");
    if (train_loss)
      info.push({
        text: "Train Loss",
        val: train_loss
      });

    if (!service.trainJob) {
      status = "not-running";
    } else if (service.isTraining && !train_loss) {
      status = "waiting";
    }

    const serviceUrl = `/training/${service.serverName}/${service.name}`;

    const iteration = this.getValue("iteration");
    if (iteration) {
      info.push({
        text: "Iterations",
        val: iteration
      });
    }

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
        if (typeof ctc_acc !== "undefined")
          info.push({
            text: "Accuracy",
            val: ctc_acc
          });
        break;
      case "classification":
        const classif_acc = this.getValue("acc");
        if (typeof classif_acc !== "undefined")
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
        const eucll_reg = this.getValue("eucll");
        if (eucll_reg)
          info.push({
            text: "Eucll",
            val: eucll_reg
          });
        break;
      case "autoencoder":
        const eucll_autoenc = this.getValue("eucll");
        if (eucll_autoenc)
          info.push({
            text: "Eucll",
            val: eucll_autoenc
          });
        break;
      default:
        break;
    }

    const remain_time_str = this.getValue("remain_time_str");
    if (remain_time_str)
      info.push({
        text: "Time remaining",
        val: remain_time_str,
        breakline: true
      });

    let cardContent = null;
    let cardFooter = null;
    switch (status) {
      case "error":
        //cardContent = (
        //  <a
        //    className="btn btn-outline-danger"
        //    href="/code/lab"
        //    target="_blank"
        //    rel="noreferrer noopener"
        //  >
        //    <i className="fas fa-circle-notch" /> Check error in Jupyter
        //  </a>
        //);
        break;
      case "not-running":
        cardFooter = (
          <div
            className="card-footer text-center"
            onClick={() => window.location.assign("#" + serviceUrl)}
          >
            <Link to={serviceUrl}>
              Monitor <i className="fas fa-chevron-right" />
            </Link>
          </div>
        );
        break;
      case "waiting":
        cardFooter = (
          <div className="card-footer text-center">
            <i className="fas fa-spinner fa-spin" /> Preparing data...
          </div>
        );
        break;
      case "training":
      default:
        cardContent = (
          <div className="content row ml-2 pt-4">
            {info.map((i, index) => {
              return (
                <div key={index} className="col-6">
                  <h3>{i.val}</h3>
                  <h4>{i.text}</h4>
                </div>
              );
            })}
          </div>
        );
        cardFooter = (
          <div
            className="card-footer text-center"
            onClick={() => window.location.assign("#" + serviceUrl)}
          >
            <Link to={serviceUrl}>
              Monitor <i className="fas fa-chevron-right" />
            </Link>
          </div>
        );
        break;
    }

    return (
      <div className="col-lg-4 col-md-12 my-2">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">
              <span className="title">
                <i class="fas fa-braille" /> {service.name}
              </span>
            </h5>
            <h6 className="card-subtitle mb-2 text-muted">
              {service.settings.description}
            </h6>
            <div className="row process-icons">
              <div className="col-6">
                {!["error", "not-running"].includes(status) &&
                service.isRequesting ? (
                  <div>
                    <i className="fas fa-spinner fa-spin" /> {status}
                  </div>
                ) : (
                  <div>
                    <i className={`fas fa-circle ${status}`} /> {status}
                  </div>
                )}
              </div>
              <div className="col-6">
                <i className="fas fa-server" /> {service.serverName}
              </div>
              <div className="col-6">
                <i className="fas fa-bullseye" /> {service.settings.mltype}
              </div>
              <div className="col-6">
                <i className="far fa-hdd" /> GPU: {service.gpuid}
              </div>
              <div className="col-12">
                <i className="fas fa-folder" />{" "}
                {service.respInfo &&
                service.respInfo.body &&
                service.respInfo.body.repository
                  ? service.respInfo.body.repository.replace(
                      "/opt/platform/models/training/",
                      ""
                    )
                  : "--"}
              </div>
            </div>
            {cardContent}
          </div>
          {cardFooter}
        </div>
      </div>
    );
  }
}

TrainingCard.propTypes = {
  service: PropTypes.object.isRequired
};
