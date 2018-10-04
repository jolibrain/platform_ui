import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

@observer
export default class Expectation extends React.Component {
  render() {
    const { input } = this.props;
    const { classes } = input.json.body.predictions[0];

    return (
      <span className="description-expectation">
        {Math.ceil(
          classes.reduce((acc, current) => {
            return acc + parseInt(current.cat, 10) * current.prob;
          }, 0)
        )}
      </span>
    );
  }
}

Expectation.propTypes = {
  input: PropTypes.object.isRequired
};
