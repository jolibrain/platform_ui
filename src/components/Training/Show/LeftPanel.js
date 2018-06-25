import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";
import { parse as qsParse } from "query-string";

import ServiceList from "../../widgets/ServiceList";

@inject("commonStore")
@withRouter
@observer
export default class LeftPanel extends React.Component {
  render() {
    return (
      <div className="nav-sidebar left-sidebar">
        <div className="nav-sidebar-inner-scroll">
          <ServiceList />
        </div>
      </div>
    );
  }
}
