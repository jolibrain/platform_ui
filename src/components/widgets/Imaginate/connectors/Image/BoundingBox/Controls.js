import React from "react";
export default class Controls extends React.Component {
  render() {
    return (
      <div>
        <i class="far fa-square" onClick={this.props.handleClickBox} />
        <i class="fas fa-palette" onClick={this.props.handleClickPalette} />
      </div>
    );
  }
}
