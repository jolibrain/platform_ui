import React from "react";
import { observer } from "mobx-react";

import stores from "../../../stores/rootStore";

const PlaceHolder = observer(class PlaceHolder extends React.Component {
  render() {
    const { configStore } = stores;
    const { placeholders } = configStore;
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
});
export default PlaceHolder;
