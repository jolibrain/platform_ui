import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";
import moment from "moment";

/*
 * # Workflow: publishing after training"
 *
 * Documentation of the process triggered by this modal:
 * it fetches the selected service `config.json` and modifies it:
 * `model.repository` to `privateStore.systemPath + privateStore.nginxPath + service.name`
 * `model.create_repository`` to `true`
 * `parameters.output.store_config` to `true`
 * `parameters.mllib.from_repository` to `service.location`
 * it deletes value at `parameters.mllib.template`
 * it creates a new service on the hostable server
 * it deletes the existing service from the training server
 */

@withRouter
@inject("deepdetectStore")
@inject("modelRepositoriesStore")
@inject("modalStore")
@observer
class ModelRepositoryCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPublishing: false,
      publishError: null,
      compareSelected: false
    };

    this.getValue = this.getValue.bind(this);
    this.openPublishTrainingModal = this.openPublishTrainingModal.bind(this);
    this.toggleCompareState = this.toggleCompareState.bind(this);
  }

  toggleCompareState() {
    const repository = this.props.service;
    this.setState({ compareSelected: !this.state.compareSelected });
    this.props.handleCompareStateChange(repository.path);
  }

  openPublishTrainingModal() {
    const { modalStore } = this.props;
    modalStore.setVisible("publishTraining", true, {
      service: this.props.service
    });
  }

  getValue(attr) {
    const { service } = this.props;

    if (!service.jsonMetrics) return null;

    const { measure, measure_hist } = service.jsonMetrics.body;

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

    if (attr !== "remain_time_str" && value) {
      if (attr === "train_loss") {
        value = value.toFixed(10);
      } else {
        value = value.toFixed(5);
      }
    }

    return value;
  }

  render() {
    const repository = this.props.service;

    if (!repository) return null;

    const mltype = repository.jsonMetrics
      ? repository.jsonMetrics.body.mltype
      : null;

    const archiveUrl = `/charts/archive${repository.path}`;

    let info = [];

    const train_loss = this.getValue("train_loss");
    if (train_loss)
      info.push({
        text: "Train Loss",
        val: train_loss
      });

    switch (mltype) {
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
        const ctc_accp = this.getValue("accp");
        if (ctc_acc || ctc_accp)
          info.push({
            text: "Accuracy",
            val: ctc_acc || ctc_accp
          });
        break;
      case "classification":
        const classif_acc = this.getValue("acc");
        const classif_accp = this.getValue("accp");
        if (classif_acc || classif_accp)
          info.push({
            text: "Accuracy",
            val: classif_acc || classif_accp
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

    let modelValues = null;
    if (repository.bestModel) {
      modelValues = (
        <div className="content row py-2 pl-2">
          {Object.keys(repository.bestModel).map((k, i) => {
            let attrTitle =
              i === 0
                ? k.replace(/\b\w/g, l => l.toUpperCase())
                : k.toUpperCase();

            if (attrTitle === "MEANIOU") attrTitle = "Mean IOU";

            return (
              <div key={i} className="col-6">
                <h3>{repository.bestModel[k]}</h3>
                <h4>{attrTitle}</h4>
              </div>
            );
          })}
        </div>
      );
    } else {
      modelValues = (
        <div className="content row py-2 pl-2 values">
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
    }

    let compareButton = (
      <a
        onClick={this.toggleCompareState}
        className={
          this.state.compareSelected
            ? "btn btn-compare-selected mx-2"
            : "btn btn-compare mx-2"
        }
      >
        {this.state.compareSelected ? (
          <span>
            <i className="far fa-check-square" /> Selected
          </span>
        ) : (
          <span>
            <i className="far fa-square" /> Compare
          </span>
        )}
      </a>
    );

    let publishButton = repository.jsonConfig ? (
      <a
        onClick={this.openPublishTrainingModal}
        className="btn btn-outline-primary mx-2"
      >
        <i className="fas fa-plus" /> Publish
      </a>
    ) : null;

    if (this.state.isPublishing) {
      publishButton = (
        <a className="btn btn-outline-primary mx-2">
          <i className="fas fa-spinner fa-spin" /> Publishing...
        </a>
      );
    }

    return (
      <div className="col-lg-4 col-md-12 my-2">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">
              <span className="title">
                <i className="fas fa-archive" /> {repository.name}
              </span>
            </h5>

            <div className="row process-icons">
              {typeof mltype !== "undefined" && mltype && mltype.length > 0 ? (
                <div className="col-12">
                  <i className="fas fa-bullseye" /> {mltype}
                </div>
              ) : (
                <div className="col-12">
                  <i className="fas fa-bullseye" /> --
                </div>
              )}
              {typeof repository.metricsDate !== "undefined" ? (
                <div className="col-12">
                  <i className="far fa-clock" />{" "}
                  {moment(repository.metricsDate).format("L LT")}
                </div>
              ) : (
                ""
              )}
              <div className="col-12">
                <i className="fas fa-folder" />{" "}
                {repository.path
                  ? repository.path.replace("/models/training/", "")
                  : "--"}
              </div>
              {repository.fetchError ? (
                <div className="col-12 fetchError">
                  <i className="fas fa-exclamation-circle" /> Error while
                  reading repository
                </div>
              ) : (
                ""
              )}
            </div>
            {modelValues}
            {this.state.publishError ? (
              <div className="alert alert-danger" role="alert">
                <i className="fas fa-exclamation-triangle" />{" "}
                {this.state.publishError}
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="card-footer text-right">
            {compareButton}
            {publishButton}
            <Link to={archiveUrl} className="btn btn-primary">
              View <i className="fas fa-chevron-right" />
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

ModelRepositoryCard.propTypes = {
  repository: PropTypes.object,
  handleCompareStateChange: PropTypes.func
};
export default ModelRepositoryCard;
