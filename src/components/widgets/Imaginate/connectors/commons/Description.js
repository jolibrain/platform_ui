import React from "react";
import { inject, observer } from "mobx-react";

import { findDOMNode } from "react-dom";
import ReactTooltip from "react-tooltip";
import Boundingbox from "react-bounding-box";

@inject("imaginateStore")
@observer
export default class Description extends React.Component {
  constructor(props) {
    super(props);
    this._nodes = new Map();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedBoxIndex === -1) {
      this._nodes.forEach(n => ReactTooltip.hide(findDOMNode(n)));
    } else {
      const node = findDOMNode(this._nodes.get(nextProps.selectedBoxIndex));
      ReactTooltip.show(node);
    }
  }

  render() {
    const store = this.props.imaginateStore;
    const service = store.service;

    if (!service || !service.selectedInput) return null;

    const input = service.selectedInput;

    if (
      input.error ||
      !input.json ||
      !input.json.body ||
      !input.json.body.predictions ||
      input.json.body.predictions.length === 0 ||
      !input.json.body.predictions[0]
    ) {
      return null;
    }

    const inputClasses = input.json.body.predictions[0].classes;

    let displayFormat = store.serviceSettings.display.format;

    if (this.props.displayFormat) {
      displayFormat = this.props.displayFormat;
    } else {
      if (store.serviceSettings.display.boundingBox) {
        displayFormat = "icons";
      }

      if (store.service.settings.mltype === "ctc") {
        displayFormat = "category";
      }
    }

    if (service.settings.mltype === "rois") {
      displayFormat = "nns";
    }

    let output = "";
    switch (displayFormat) {
      default:
      case "simple":
        output = (
          <div>
            {inputClasses.map((category, index) => {
              return (
                <div className="predictDisplay" key={index}>
                  {category.cat} - {category.prob}
                </div>
              );
            })}
          </div>
        );
        break;

      case "expectation":
        output = (
          <span>
            {Math.ceil(
              inputClasses.reduce((acc, current) => {
                return acc + parseInt(current.cat, 10) * current.prob;
              }, 0)
            )}
          </span>
        );
        break;

      case "list":
        output = (
          <div>
            {inputClasses.map((category, index) => {
              const percent = parseInt(category.prob * 100, 10);
              const progressStyle = { width: `${percent}%` };
              let progressBg = "bg-success";

              if (percent < 60) {
                progressBg = "bg-warning";
              }

              if (percent < 30) {
                progressBg = "bg-danger";
              }

              if (this.props.selectedBoxIndex === index) {
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
                    onMouseOver={this.props.onOver.bind(this, index)}
                    onMouseLeave={this.props.onLeave}
                  >
                    {category.cat}
                  </div>
                </div>
              );
            })}
          </div>
        );
        break;

      case "nns":
        const rois = input.json.body.predictions[0].rois;
        const roisIndex =
          this.props.selectedBoxIndex !== -1 ? this.props.selectedBoxIndex : 0;

        if (rois.length === 0 || !rois[roisIndex]) break;

        output = (
          <div className="row">
            {rois[roisIndex].nns
              .sort((a, b) => b.prob - a.prob)
              .map((category, index) => {
                const percent = parseInt(category.prob * 100, 10);
                const progressStyle = { width: `${percent}%` };
                let progressBg = "bg-success";

                if (percent < 60) {
                  progressBg = "bg-warning";
                }

                if (percent < 30) {
                  progressBg = "bg-danger";
                }

                if (this.props.selectedBoxIndex === index) {
                  progressBg = "bg-info";
                }

                return (
                  <div style={{ display: "contents" }} key={index}>
                    <div className="col-6 progress-nns">
                      <Boundingbox
                        image={category.uri}
                        boxes={[category.bbox]}
                      />
                      <div
                        className={`progress-bar ${progressBg}`}
                        role="progressbar"
                        style={progressStyle}
                        aria-valuenow={percent}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        {percent}
                      </div>
                    </div>
                    {(index + 1) % 2 === 0 ? <div className="w-100" /> : ""}
                  </div>
                );
              })}
          </div>
        );
        break;

      case "list-url":
        output = (
          <div>
            {inputClasses.map((category, index) => {
              return (
                <div className="predictDisplay">
                  <img src={category.uri} alt="category" />
                  {category.dist}
                </div>
              );
            })}
          </div>
        );
        break;

      case "category":
        output = (
          <div>
            {inputClasses.map((category, index) => {
              let styles = {
                color: ""
              };

              // okClass settings
              if (
                store.serviceSettings.display.okClass &&
                store.serviceSettings.display.okClass.length > 0
              ) {
                styles.color =
                  store.serviceSettings.display.okClass === category.cat
                    ? "#0C0"
                    : "#C00";
              }

              return (
                <span style={styles} key={index}>
                  {category.cat}
                </span>
              );
            })}
          </div>
        );
        break;

      case "icons":
        if (inputClasses) {
          output = (
            <div>
              {inputClasses.map((category, index) => {
                let styles = {
                  color: ""
                };

                // okClass settings
                if (
                  store.serviceSettings.display.okClass &&
                  store.serviceSettings.display.okClass.length > 0
                ) {
                  styles.color =
                    store.serviceSettings.display.okClass === category.cat
                      ? "#0C0"
                      : "#C00";
                }

                let bottomClass = "fa fa-stack-2x " + category.cat;
                bottomClass +=
                  this.props.selectedBoxIndex === index
                    ? " fa-square"
                    : " fa-circle";

                const opacity =
                  this.props.selectedBoxIndex === index ? 1 : category.prob;
                styles.opacity = opacity;

                let topClass = "fa fa-stack-1x fa-inverse fa-" + category.cat;

                return (
                  <div key={index} style={{ display: "inline" }}>
                    <span
                      key={`icon-${index}`}
                      className="fa-stack"
                      onMouseOver={this.props.onOver.bind(this, index)}
                      onMouseLeave={this.props.onLeave}
                      data-tip={`${category.cat} - ${category.prob.toFixed(2)}`}
                      ref={c => this._nodes.set(index, c)}
                    >
                      <i className={bottomClass} style={styles} />
                      <i className={topClass} style={{ opacity: opacity }} />
                    </span>
                  </div>
                );
              })}
              <ReactTooltip effect="solid" />
            </div>
          );
        }
        break;
    }

    return output;
  }
}
