import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

@observer
export default class Simple extends React.Component {
  render() {
    const { input } = this.props;
    const { classes } = input.json.body.predictions[0];

    if (!classes) return null;

    return (
      <div className="description-simple">
        {classes.map((category, index) => {
          return (
            <div className="predictDisplay" key={index}>
              {category.cat} - {category.prob}
            </div>
          );
        })}
      </div>
    );
  }
}

Simple.propTypes = {
  input: PropTypes.object.isRequired
};
