import React from "react";
import { observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import RightPanel from "../commons/RightPanel";
import Form from "./Form";

@withRouter
@observer
export default class MainView extends React.Component {
  render() {
    return (
      <div className="main-view content-wrapper">
        <div className="container-fluid">
          <div className="content">
            <Form />
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
