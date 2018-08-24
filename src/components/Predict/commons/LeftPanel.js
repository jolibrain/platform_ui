import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

import ServiceList from "../../widgets/ServiceList";

@withRouter
@observer
export default class LeftPanel extends React.Component {
  render() {
    return (
      <div className="nav-sidebar left-sidebar">
        <div className="nav-sidebar-inner-scroll">
          <ServiceList only="predict" />
        </div>
      </div>
    );
  }
}
