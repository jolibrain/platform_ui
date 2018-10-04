import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

@observer
export default class ListUrl extends React.Component {
  render() {
    const { input } = this.props;
    const { classes } = input.json.body.predictions[0];

    return (
      <div className="description-list-url">
        {classes.map((category, index) => {
          return (
            <div className="predictDisplay" key={index}>
              <img src={category.uri} alt="category" />
              {category.dist}
            </div>
          );
        })}
      </div>
    );
  }
}

ListUrl.propTypes = {
  input: PropTypes.object.isRequired
};
