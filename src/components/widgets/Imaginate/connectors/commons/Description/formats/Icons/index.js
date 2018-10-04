import React from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import { inject, observer } from "mobx-react";

@inject("imaginateStore")
@observer
export default class Icons extends React.Component {
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
    const { selectedBoxIndex, onOver, onLeave } = this.props;

    let styles = { color: "" };

    // okClass settings
    if (
      serviceSettings.display.okClass &&
      serviceSettings.display.okClass.length > 0
    ) {
      styles.color =
        serviceSettings.display.okClass === category.cat ? "#0C0" : "#C00";
    }

    let bottomClass = "fa fa-stack-2x " + category.cat;
    bottomClass += selectedBoxIndex === index ? " fa-square" : " fa-circle";

    const opacity = selectedBoxIndex === index ? 1 : category.prob;
    styles.opacity = opacity;

    let topClass = "fa fa-stack-1x fa-inverse fa-" + category.cat;

    return (
      <div key={index} style={{ display: "inline" }}>
        <span
          key={`icon-${index}`}
          className="fa-stack"
          onMouseOver={onOver.bind(this, index)}
          onMouseLeave={onLeave}
          data-tip={`${category.cat} - ${category.prob.toFixed(2)}`}
          ref={c => this._nodes.set(index, c)}
        >
          <i className={bottomClass} style={styles} />
          <i className={topClass} style={{ opacity: opacity }} />
        </span>
      </div>
    );
  }

  render() {
    const { input } = this.props;
    const { classes } = input.json.body.predictions[0];

    return (
      <div className="description-icons">
        {classes.map(this.categoryDisplay)}
        <ReactTooltip effect="solid" />
      </div>
    );
  }
}

Icons.propTypes = {
  input: PropTypes.object.isRequired,
  selectedBoxIndex: PropTypes.number,
  onOver: PropTypes.func,
  onLeave: PropTypes.func
};
