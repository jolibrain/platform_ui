import React from "react";

import RightPanel from "./RightPanel";

class MainView extends React.Component {
  render() {
    return (
      <div className="main-view content-wrapper">
        <div className="container-fluid">
          <div className="content">
            <h2>Page not found</h2>
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
export default MainView;
