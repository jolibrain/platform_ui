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
    this.findChainService = this.findChainService.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedBoxIndex === -1) {
      this._nodes.forEach(n => ReactTooltip.hide(findDOMNode(n)));
    } else {
      const node = findDOMNode(this._nodes.get(nextProps.selectedBoxIndex));
      ReactTooltip.show(node);
    }
  }

  findChainService(category) {
    let i;

    for (i = 0; i < Object.keys(category).length; i += 1) {
      const key = Object.keys(category)[i];
      const child = category[key];

      if (typeof child.classes !== "undefined") {
        return {
          serviceName: key,
          classes: child.classes
        };
      }
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

    let dataTip = `${category.cat} - ${category.prob.toFixed(2)}`;

    let chainService = this.findChainService(category);

    if (
      chainService &&
      chainService.serviceName &&
      chainService.classes &&
      chainService.classes[0] &&
      chainService.classes[0].cat &&
      chainService.classes[0].prob
    ) {
      dataTip += `<br/>[${chainService.serviceName}] ${
        chainService.classes[0].cat
      } - ${chainService.classes[0].prob.toFixed(4)}`;
      console.log("good : " + chainService);
    } else {
      console.log("bad : " + chainService);
    }

    return (
      <div key={index} style={{ display: "inline" }}>
        <span
          key={`icon-${index}`}
          className="fa-stack"
          onMouseOver={onOver.bind(this, index)}
          onMouseLeave={onLeave}
          data-tip={dataTip}
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

    if (
      !input.json ||
      !input.json.body ||
      !input.json.body.predictions ||
      !input.json.body.predictions[0]
    )
      return null;

    const { classes } = input.json.body.predictions[0];

    if (!classes) return null;

    return (
      <div className="description-icons">
        {classes.map(this.categoryDisplay)}
        <ReactTooltip effect="solid" html={true} />
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
