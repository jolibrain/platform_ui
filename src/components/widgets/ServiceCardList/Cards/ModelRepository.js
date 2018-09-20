import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

@withRouter
@observer
export default class ModelRepositoryCard extends React.Component {
  constructor(props) {
    super(props);

    this.getValue = this.getValue.bind(this);
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

    const archiveUrl = `/trainingArchive/${repository.name}`;

    let badges = [];

    if (mltype) {
      badges.push({
        classNames: "badge badge-secondary",
        status: mltype
      });
    }

    let tags = repository.trainingTags;
    if (tags && tags.length > 0) {
      tags.forEach(t => {
        badges.push({
          classNames: "badge badge-info",
          status: t
        });
      });
    }

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

    let bestModelInfo = null;
    if (repository.bestModel) {
      bestModelInfo = (
        <div>
          <hr />
          <p>Best Model</p>
          <ul>
            {Object.keys(repository.bestModel).map((k, i) => {
              let attrTitle =
                i === 0
                  ? k.replace(/\b\w/g, l => l.toUpperCase())
                  : k.toUpperCase();

              if (attrTitle === "MEANIOU") attrTitle = "Mean IOU";

              return (
                <li key={i}>
                  {attrTitle}: <b>{repository.bestModel[k]}</b>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }

    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">
            {repository.name}
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
          {bestModelInfo}
          <Link to={archiveUrl} className="btn btn-outline-primary">
            View
          </Link>
        </div>
      </div>
    );
  }
}

ModelRepositoryCard.propTypes = {
  repository: PropTypes.object
};
