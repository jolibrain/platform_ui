import React from "react";

import RightPanel from "./RightPanel";

export default class MainView extends React.Component {
  render() {
    return (
      <div className="main-view content-wrapper">
        <div className="container-fluid">
          <div className="content">
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
