import React from "react";
import { observer } from "mobx-react";
import { Link, withRouter } from "react-router-dom";

@withRouter
@observer
export default class Chain extends React.Component {
  render() {
    const { chain, match } = this.props;

    if (match && match.path) {
      const trainingPatt = /^\/training/g;

      // hide chains in training section
      if (trainingPatt.test(match.path)) {
        return null;
      }
    }

    return (
      <li>
        <Link
          id={`serviceList-chain-${chain.name}`}
          to={`/chains/${chain.name}`}
        >
          <span className="nav-item-name">
            <i className="fas fa-link" />
            &nbsp;{decodeURIComponent(chain.name)}
          </span>
        </Link>
      </li>
    );
  }
}