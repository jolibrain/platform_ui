import React from "react";
import { observer } from "mobx-react";

const Expectation = observer(class Expectation extends React.Component {
  render() {
    const { input } = this.props;
    const { classes } = input.json.body.predictions[0];

    if (!classes) return null;

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
});
export default Expectation;
