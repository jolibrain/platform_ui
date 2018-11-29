import React from "react";
export default class Controls extends React.Component {
  render() {
    return (
      <div>
        <i className="far fa-square" onClick={this.props.handleClickBox} />
        <i className="fas fa-palette" onClick={this.props.handleClickPalette} />
      </div>
    );
  }
}
