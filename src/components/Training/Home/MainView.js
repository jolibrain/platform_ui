import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import RightPanel from "../commons/RightPanel";
import ServiceCardList from "../../widgets/ServiceCardList";

@withRouter
@observer
export default class MainView extends React.Component {
  render() {
    return (
      <div className="main-view content-wrapper">
        <div className="container-fluid">
          <div className="content">
            <div className="serviceList">
              <h4>Current Training Service</h4>
              <ServiceCardList onlyTraining={true} />
            </div>
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
