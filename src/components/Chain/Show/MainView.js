import React from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import RightPanel from "../commons/RightPanel";
import Imaginate from "../../widgets/Imaginate";

@inject("imaginateStore")
@inject("deepdetectStore")
@inject("configStore")
@inject("gpuStore")
@withRouter
@observer
class MainView extends React.Component {
  render() {
    const { deepdetectStore } = this.props;
    if (!deepdetectStore.isReady) return null;

    const chainName = this.props.match.params.chainName;
    const chain = deepdetectStore.chains.find(c => c.name === chainName);

    const existingServiceNames = deepdetectStore.services.map(s => s.name);

    if (!chain) return null;

    let mainClassnames = "main-view content-wrapper"
    if (
      typeof this.props.configStore.gpuInfo !== "undefined" &&
        this.props.gpuStore.servers.length > 0
    ) {
      mainClassnames = "main-view content-wrapper with-right-sidebar"
    }

    return (
      <div className={mainClassnames}>
        <div className="container-fluid">
          <div className="page-title p-4 row">
            <div className="col-lg-8 col-md-12">
              <h3>
                <i className="fas fa-link" /> {chain.name}
              </h3>
              <h4>{chain.description}</h4>

              {chain.calls.map((call, index) => {
                let badge = null;

                if (call.service) {
                  if (!existingServiceNames.includes(call.service)) {
                    badge = (
                      <span className="badge badge-danger">
                        service missing
                      </span>
                    );
                  } else {
                    badge = (
                      <span className="badge badge-success">service ready</span>
                    );
                  }
                }

                return (
                  <div key={index} className="row chainInfo">
                    <h4>
                      {call.service ? call.service : call.action.type}
                      {badge}
                    </h4>
                    <h5>{call.service ? "Service" : "Action"}</h5>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="content p-4">
            <Imaginate />
            <RightPanel />
          </div>
        </div>
      </div>
    );
  }
}
export default MainView;
