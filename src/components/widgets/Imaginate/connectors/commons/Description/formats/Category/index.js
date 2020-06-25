import React from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import { inject, observer } from "mobx-react";

@inject("imaginateStore")
@observer
export default class Category extends React.Component {
  constructor(props) {
    super(props);
    this._nodes = new Map();
    this.categoryDisplay = this.categoryDisplay.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedBoxIndex === -1) {
      this._nodes.forEach(n => ReactTooltip.hide(findDOMNode(n)));
    } else {
      const node = findDOMNode(this._nodes.get(nextProps.selectedBoxIndex));
      ReactTooltip.show(node);
    }
  }

  categoryDisplay(category, index) {
    const { serviceSettings } = this.props.imaginateStore;
    const { onOver, onLeave } = this.props;
    let styles = {
      color: ""
    };

    // okClass settings
    if (
      serviceSettings.display.okClass &&
      serviceSettings.display.okClass.length > 0
    ) {
      styles.color =
        serviceSettings.display.okClass === category.cat ? "#0C0" : "#C00";
    }

    const value = category.prob
      ? category.prob
      : category.val
      ? category.val
      : 0;

    return (
      <div key={index}>
        <span
          style={styles}
          className="badge badge-success"
          onMouseOver={onOver.bind(this, index)}
          onMouseLeave={onLeave}
          data-tip={`${value.toFixed(2)}`}
          ref={c => this._nodes.set(index, c)}
        >
          {category.cat}
        </span>
        &nbsp;
      </div>
    );
  }

  render() {
    const { input } = this.props;

    if (!input.json || !input.json.body) return null;

    const content = input.json.body.predictions[0].vector
      ? input.json.body.predictions[0].vector
      : input.json.body.predictions[0].classes;

    if (!content) return null;

    return (
      <div className="description-category">
        {content.map(this.categoryDisplay)}
        <ReactTooltip effect="solid" />
      </div>
    );
  }
}

Category.propTypes = {
  input: PropTypes.object.isRequired,
  onOver: PropTypes.func,
  onLeave: PropTypes.func
};
