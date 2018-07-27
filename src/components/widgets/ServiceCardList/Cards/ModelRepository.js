import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

@withRouter
@observer
export default class ModelRepositoryCard extends React.Component {
  render() {
    const { repository } = this.props;

    if (!repository) return null;

    const { measure, mltype } = repository.jsonMetrics.body;

    const archiveUrl = `/trainingArchive/${repository.modelName}`;

    let badges = [];

    badges.push({
      classNames: "badge badge-secondary",
      status: mltype
    });

    let info = [
      {
        text: "Train Loss",
        val:
          measure && measure.train_loss ? measure.train_loss.toFixed(2) : "--"
      }
    ];

    let val = "--";

    switch (mltype) {
      case "segmentation":
        info.push({
          text: "Mean IOU",
          val: measure && measure.meaniou ? measure.meaniou.toFixed(2) : "--"
        });
        break;
      case "detection":
        info.push({
          text: "MAP",
          val: measure && measure.map ? measure.map.toFixed(2) : "--"
        });
        break;
      case "ctc":
        if (measure && measure.acc) {
          val = measure.acc.toFixed(2);
        } else if (measure && measure.accp) {
          val = measure.accp.toFixed(2);
        }
        info.push({
          text: "Accuracy",
          val: val
        });
        break;
      case "classification":
        if (measure && measure.acc) {
          val = measure.acc.toFixed(2);
        } else if (measure && measure.accp) {
          val = measure.accp.toFixed(2);
        }
        info.push({
          text: "Accuracy",
          val: val
        });
        info.push({
          text: "F1",
          val: measure && measure.f1 ? measure.f1.toFixed(2) : "--"
        });

        info.push({
          text: "mcll",
          val: measure && measure.mcll ? measure.mcll.toFixed(2) : "--"
        });
        break;
      case "regression":
        info.push({
          text: "Eucll",
          val: measure && measure.eucll ? measure.eucll.toFixed(2) : "--"
        });
        break;
      default:
        break;
    }

    return (
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">
            {repository.modelName}
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
          <Link to={archiveUrl} className="btn btn-outline-primary">
            Archives
          </Link>
        </div>
      </div>
    );
  }
}

ModelRepositoryCard.propTypes = {
  repository: PropTypes.object
};
