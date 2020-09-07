import React from "react";
class Controls extends React.Component {
  render() {
    return (
      <form id="imaginate-image-connector-boundingbox-controls">
        <div className="form-row">
          <div className="btn-group" role="group" aria-label="Basic example">
            <button
              type="button"
              className={
                this.props.boxFormat === "simple"
                  ? "btn btn-primary"
                  : "btn btn-secondary"
              }
              onClick={this.props.handleClickBox}
            >
              <i className="far fa-square" /> Simple
            </button>
            <button
              type="button"
              className={
                this.props.boxFormat === "simple"
                  ? "btn btn-secondary"
                  : "btn btn-primary"
              }
              onClick={this.props.handleClickPalette}
            >
              <i className="fas fa-palette" /> Colors
            </button>
          </div>

          {this.props.boxFormat !== "simple" ? (
            <div className="form-check form-check-inline float-right">
              <input
                className="form-check-input"
                type="checkbox"
                id="inlineCheckboxLabel"
                value="showLabel"
                defaultChecked={this.props.showLabels}
                onChange={this.props.handleClickLabels}
              />
              <label className="form-check-label" htmlFor="inlineCheckboxLabel">
                Show Labels
              </label>
            </div>
          ) : (
            ""
          )}
        </div>
      </form>
    );
  }
}
export default Controls;
