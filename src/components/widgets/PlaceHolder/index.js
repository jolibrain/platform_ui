import React from "react";
import { inject, observer } from "mobx-react";

@inject("configStore")
@observer
class PlaceHolder extends React.Component {
  render() {
    const { placeholders } = this.props.configStore;
    const config = placeholders[this.props.config];

    if (!config) return null;

    return (
      <div className="placeholder" id={this.props.config}>
        {config.img ? (
          <img src={config.img} className="img-fluid" alt="" />
        ) : (
          ""
        )}
        {config.text ? <p>{config.text}</p> : ""}
      </div>
    );
  }
}
export default PlaceHolder;
