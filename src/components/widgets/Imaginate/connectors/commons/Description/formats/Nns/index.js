import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

@observer
class Nns extends React.Component {
  constructor(props) {
    super(props);
    this.nnsItem = this.nnsItem.bind(this);
  }

  nnsItem(nns, index) {
    const percent = parseInt(nns.dist * 100, 10);
    const progressStyle = { width: `${percent}%` };

    let progressBg = "bg-danger";

    if (percent < 60) {
      progressBg = "bg-warning";
    }

    if (percent < 30) {
      progressBg = "bg-success";
    }

    return (
      <div key={index} className="col progress-nns">
        <img src={nns.uri} className="img-fluid" alt="" />
        <div
          className={`progress-bar ${progressBg}`}
          role="progressbar"
          style={progressStyle}
          aria-valuenow={percent}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {percent}
        </div>
      </div>
    );
  }

  render() {
    const { input } = this.props;

    if (!input.json || !input.json.body) return null;

    const prediction = input.json.body.predictions[0];

    if (!prediction || !prediction.nns || prediction.nns.length === 0)
      return null;

    let cells = prediction.nns
      .map(this.nnsItem)
      .reduce((result, element, index, array) => {
        // Add 2-columns separators
        result.push(element);
        if ((index + 1) % 2 === 0) {
          result.push(<div key={`sep-${index}`} className="w-100" />);
        }
        return result;
      }, []);

    // Add empty column to fill row
    if (cells.length % 2 === 1) cells.push(<div className="col" />);

    return <div className="description-nns row">{cells}</div>;
  }
}

Nns.propTypes = {
  input: PropTypes.object.isRequired
};
export default Nns;
