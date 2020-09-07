import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

@observer
class Simple extends React.Component {

// TODO check if necessary, broken after package update
//  shouldComponentUpdate(nextProps) {
//    const { input } = nextProps;
//    return (
//      input &&
//      input.json &&
//      input.json.body &&
//      input.json.body.predictions &&
//      input.json.body.predictions[0]
//    );
//  }

  render() {
    const { input } = this.props;
    let classes = null;
    if (
      input &&
      input.json &&
      input.json.body &&
      input.json.body.predictions &&
      input.json.body.predictions[0]
    ) {
      classes = input.json.body.predictions[0].classes;
    }

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
export default Simple;
