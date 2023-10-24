import React from "react";
import { findDOMNode } from "react-dom";
import ReactTooltip from "react-tooltip";
import { observer } from "mobx-react";

import stores from "../../../../../../../../stores/rootStore";

const Category = observer(class Category extends React.Component {
  constructor(props) {
    super(props);
    this._nodes = new Map();
    this.categoryDisplay = this.categoryDisplay.bind(this);
    this.findChainVector = this.findChainVector.bind(this);
  }

  componentDidUpdate() {
    if (this.props.selectedBoxIndex === -1) {
      this._nodes.forEach(n => ReactTooltip.hide(findDOMNode(n)));
    } else {
      const node = findDOMNode(this._nodes.get(this.props.selectedBoxIndex));
      ReactTooltip.show(node);
    }
  }

  //
  // Find chain services in current category
  //
  // A chain service is a object is current json object
  // that contains a classes or a vector array
  //
  findChainVector(category) {
    let i,
      chainVector = null;

    for (i = 0; i < Object.keys(category).length; i += 1) {
      const key = Object.keys(category)[i];
      const child = category[key];

      if (typeof child.vector !== "undefined") {
        chainVector = child.vector[0];
      }
    }

    return chainVector;
  }


  categoryDisplay(isRegression, category, index) {

    const { imaginateStore } = stores;
    let serviceSettings = null;
    if(
      imaginateStore &&
       imaginateStore.serviceSettings) {
      serviceSettings = imaginateStore.serviceSettings
    }

    const { onOver, onLeave } = this.props;
    let styles = {
      color: ""
    };

    // okClass settings
    if (
      serviceSettings &&
        serviceSettings.display &&
        serviceSettings.display.okClass &&
        serviceSettings.display.okClass.length > 0
    ) {
      styles.color =
        serviceSettings.display.okClass === category.cat ? "#0C0" : "#C00";
    }

    let tooltipValue = 0;
    let displayValue = 0;

    // Find children chain service vector descriptions
    const chainVector = this.findChainVector(category);
    if (chainVector) {

      displayValue = chainVector.val.toFixed(2);
      tooltipValue = chainVector.cat;

    } else {

      if(isRegression) {

        displayValue = category.val.toFixed(2);
        tooltipValue = category.cat;

      } else {

        displayValue = category.cat;

        if(category.val) {
          tooltipValue = category.val.toFixed(2)
        } else if(category.prob) {
          tooltipValue = category.prob.toFixed(2)
        }
      }

    }

    return (
      <div key={index}>
        <span
          style={styles}
          className="badge badge-success"
          onMouseOver={onOver ? onOver.bind(this, index) : () => {}}
          onMouseLeave={onLeave ? onLeave.bind(this, index) : () => {}}
          data-tip={tooltipValue}
          ref={c => this._nodes.set(index, c)}
        >
          {displayValue}
        </span>
        &nbsp;
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
    ) return null;

    const isRegression = input.json.body.predictions[0].hasOwnProperty('vector')

    const content = isRegression ?
          input.json.body.predictions[0].vector
          :
          input.json.body.predictions[0].classes;

    if (!content) return null;

    return (
      <div className="description-category">
        {content.map(this.categoryDisplay.bind(this, isRegression))}
        <ReactTooltip effect="solid" />
      </div>
    );
  }
});
export default Category;
