import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

@observer
class List extends React.Component {
  constructor(props) {
    super(props);
    this.categoryDisplay = this.categoryDisplay.bind(this);
  }

  categoryDisplay(category, index) {
    const { selectedBoxIndex, onOver, onLeave } = this.props;

    const percent = parseInt(category.prob * 100, 10);
    const progressStyle = { width: `${percent}%` };
    let progressBg = "bg-success";

    if (percent < 60) {
      progressBg = "bg-warning";
    }

    if (percent < 30) {
      progressBg = "bg-danger";
    }

    if (selectedBoxIndex === index) {
      progressBg = "bg-info";
    }

    return (
      <div className="progress">
        <div
          className={`progress-bar ${progressBg}`}
          role="progressbar"
          style={progressStyle}
          aria-valuenow={percent}
          aria-valuemin="0"
          aria-valuemax="100"
          onMouseOver={onOver.bind(this, index)}
          onMouseLeave={onLeave}
        >
          {category.cat}
        </div>
      </div>
    );
  }

  render() {
    const { input } = this.props;
    const { classes } = input.json.body.predictions[0];

    if (!classes) return null;

    return (
      <div className="description-list">
        {classes.map(this.categoryDisplay)}
      </div>
    );
  }
}

List.propTypes = {
  input: PropTypes.object.isRequired,
  selectedBoxIndex: PropTypes.number,
  onOver: PropTypes.func,
  onLeave: PropTypes.func
};
export default List;
