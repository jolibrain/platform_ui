import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";
import moment from "moment";

@withRouter
@observer
export default class ModelRepositoryContent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPublishing: false,
      publishError: null
    };

    this.getValue = this.getValue.bind(this);
    this.handlePublishClick = this.handlePublishClick.bind(this);
  }

  handlePublishClick() {
    this.setState({ isPublishing: true });

    const { deepdetectStore, modelRepositoriesStore, service } = this.props;

    const { repositoryStores } = modelRepositoriesStore;
    const privateStore = repositoryStores.find(r => r.name === "private");
    const targetRepository =
      privateStore.systemPath + privateStore.nginxPath + service.name;

    let serviceConfig = service.jsonConfig;

    serviceConfig.model.repository = targetRepository;
    serviceConfig.model.create_repository = true;

    serviceConfig.parameters.output.store_config = true;
    serviceConfig.parameters.mllib.from_repository = service.location;
    delete serviceConfig.parameters.mllib.template;

    const ddServer = deepdetectStore.hostableServer;
    const existingServices = ddServer.services.map(s => s.name.toLowerCase());
    if (existingServices.includes(service.name.toLowerCase())) {
      this.setState({
        isPublishing: false,
        publishError: "Service name already exists"
      });
    } else {
      ddServer.newService(
        service.name,
        serviceConfig,
        async (response, err) => {
          if (err) {
            this.setState({
              isPublishing: false,
              publishError: `${err.status.msg}: ${err.status.dd_msg}`
            });
          } else {
            // TODO add serviceName in ddServer.deleteService method
            // to avoid using private request method
            await ddServer.$reqDeleteService(service.name);
            this.props.history.push(`/predict`);
          }
        }
      );
    }
  }

  getValue(attr) {
    const { service } = this.props;

    if (!service.jsonMetrics) return null;

    const { measure, measure_hist } = service.jsonMetrics.body;

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

    if (attr !== "remain_time_str" && value && value !== "--") {
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

    let badges = [];

    badges.push({
      classNames: "badge badge-secondary",
      status: mltype
    });

    let tags = repository.trainingTags;
    if (tags && tags.length > 0) {
      tags.forEach(t => {
        badges.push({
          classNames: "badge badge-info",
          status: t
        });
      });
    }

    if (repository.metricsDate) {
      badges.push({
        classNames: "badge badge-light",
        status: moment(repository.metricsDate).format("L LT")
      });
    }

    let info = [
      {
        text: "Train Loss",
        val: this.getValue("train_loss")
      }
    ];

    let val_acc, val_accp;

    switch (mltype) {
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
        val_acc = this.getValue("acc");
        val_accp = this.getValue("accp");
        info.push({
          text: "Accuracy",
          val: val_acc || val_accp
        });
        break;
      case "classification":
        val_acc = this.getValue("acc");
        val_accp = this.getValue("accp");
        info.push({
          text: "Accuracy",
          val: val_acc || val_accp
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

    let bestModelInfo = null;
    if (repository.bestModel) {
      bestModelInfo = (
        <div>
          <ul>
            {Object.keys(repository.bestModel).map((k, i) => {
              let attrTitle =
                i === 0
                  ? k.replace(/\b\w/g, l => l.toUpperCase())
                  : k.toUpperCase();

              if (attrTitle === "MEANIOU") attrTitle = "Mean IOU";

              return (
                <li key={i}>
                  {attrTitle} [best]: <b>{repository.bestModel[k]}</b>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }

    let publishButton = repository.jsonConfig ? (
      <a
        onClick={this.handlePublishClick}
        className="btn btn-outline-secondary"
      >
        Publish
      </a>
    ) : null;

    if (this.state.isPublishing) {
      publishButton = (
        <a className="btn btn-outline-secondary">
          <i className="fas fa-spinner fa-spin" /> Publishing...
        </a>
      );
    }

    return (
      <div
        className="row"
        style={{ borderTop: "1px solid #ccc", padding: "5px 0" }}
      >
        <div className="col-md-4 main-info">
          <h5>{repository.name}</h5>
          <span className="badges">
            {badges.map((badge, key) => {
              return (
                <span key={key}>
                  <span className={badge.classNames}>
                    {badge.loading ? (
                      <i className="fas fa-spinner fa-spin" />
                    ) : (
                      ""
                    )}
                    {badge.status}
                  </span>
                  &nbsp;
                </span>
              );
            })}
          </span>
        </div>
        <div className="col-md-3 main-values">
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
        </div>
        <div className="col-md-3 main-best">{bestModelInfo}</div>
        <div className="col-md-2 main-meta">
          <Link to={archiveUrl} className="btn btn-outline-primary view">
            <i className="fas fa-search" /> View
          </Link>
          &nbsp;
          {publishButton}
          {this.state.publishError ? (
            <div className="alert alert-danger" role="alert">
              <i className="fas fa-exclamation-triangle" />{" "}
              {this.state.publishError}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

ModelRepositoryContent.propTypes = {
  repository: PropTypes.object
};
