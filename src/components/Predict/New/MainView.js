import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { parse as qsParse } from "query-string";

import RightPanel from "./RightPanel";
import Form from "./Form";

@inject("commonStore")
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
