import React from "react";
import { inject, observer } from "mobx-react";
import ReactTooltip from "react-tooltip";

@inject("imaginateStore")
@observer
export default class Description extends React.Component {
  render() {
    const store = this.props.imaginateStore;

    if (store.selectedImage === null || store.selectedImage.json === null) {
      return null;
    }

    const image = store.selectedImage;

    if (image.error) {
      return null;
    }

    const imageClasses = store.selectedImage.json.body.predictions[0].classes;

    switch (store.settings.display.format) {
      case "expectation":
        return (
          <span>
            {Math.ceil(
              imageClasses.reduce((acc, current) => {
                return acc + parseInt(current.cat, 10) * current.prob;
              }, 0)
            )}
          </span>
        );
      case "list":
        return (
          <div>
            {imageClasses.map((category, index) => {
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
      case "list-url":
        return (
          <div>
            {imageClasses.map((category, index) => {
              return (
                <div className="predictDisplay">
                  <img src={category.uri} alt="category" />
                  {category.dist}
                </div>
              );
            })}
          </div>
        );
      case "category":
        return (
          <div>
            {imageClasses.map((category, index) => {
              let styles = {
                color: ""
              };

              // okClass settings
              if (
                store.settings.display.okClass &&
                store.settings.display.okClass.length > 0
              ) {
                styles.color =
                  store.settings.display.okClass === category.cat
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
      case "icons":
      default:
        return (
          <div>
            {imageClasses.map((category, index) => {
              let styles = {
                color: ""
              };

              // okClass settings
              if (
                store.settings.display.okClass &&
                store.settings.display.okClass.length > 0
              ) {
                styles.color =
                  store.settings.display.okClass === category.cat
                    ? "#0C0"
                    : "#C00";
              }

              let bottomClass = "fa fa-stack-2x " + category.cat;
              bottomClass +=
                this.props.selectedBoxIndex === index
                  ? " fa-square"
                  : " fa-circle";

              let opacity = category.prob;
              if (this.props.selectedBoxIndex === index) {
                opacity = 1;
              }
              styles.opacity = opacity;

              let topClass = "fa fa-stack-1x fa-inverse fa-" + category.cat;

              return (
                <div key={index} style={{ display: "inline" }}>
                  <span
                    key={`icon-${index}`}
                    className="fa-stack fa-lg"
                    onMouseOver={this.props.onOver.bind(this, index)}
                    onMouseLeave={this.props.onLeave}
                    data-tip
                    data-for={`category-tooltip-${index}`}
                  >
                    <i className={bottomClass} style={styles} />
                    <i className={topClass} style={{ opacity: opacity }} />
                  </span>
                  <ReactTooltip
                    key={`tooltip-${index}`}
                    id={`category-tooltip-${index}`}
                    effect="solid"
                    getContent={[
                      () => {
                        return this.props.selectedBoxIndex === index ? (
                          <span>
                            {category.cat} - {category.prob.toFixed(2)}
                          </span>
                        ) : (
                          ""
                        );
                      },
                      50
                    ]}
                  />
                </div>
              );
            })}
          </div>
        );
    }
  }
}
