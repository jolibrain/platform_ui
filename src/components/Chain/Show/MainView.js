import React from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";

import RightPanel from "../commons/RightPanel";
import Imaginate from "../../widgets/Imaginate";

@inject("imaginateStore")
@inject("deepdetectStore")
@withRouter
@observer
export default class MainView extends React.Component {
  render() {
    const { deepdetectStore } = this.props;
    if (!deepdetectStore.isReady) return null;

    const chainName = this.props.match.params.chainName;
    const chain = deepdetectStore.chains.find(c => c.name === chainName);

    if (!chain) return null;

    return (
      <div className="main-view content-wrapper">
        <div className="container-fluid">
          <div className="page-title p-4 row">
            <div className="col-lg-8 col-md-12">
              <h3>
                <i className="fas fa-link" /> {chain.name}
              </h3>
              <h4>{chain.description}</h4>

              {chain.calls.map((call, index) => {
                let callType = null;
                let callParent = <h5>{call.parent_id}</h5>;

                if (call.service) {
                  callType = (
                    <h4>
                      {index + 1}. Service: {call.service}
                    </h4>
                  );
                } else if (call.action) {
                  callType = (
                    <h4>
                      {index + 1}. Action: {call.action.type}
                    </h4>
                  );
                }
                return (
                  <div key={index} className="row chainInfo">
                    {callType}
                    {callParent}
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
