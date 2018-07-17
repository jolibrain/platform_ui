import React from "react";
import { inject, observer } from "mobx-react";

@inject("deepdetectStore")
@inject("configStore")
@observer
export default class ServiceInfo extends React.Component {
  render() {
    if (this.props.configStore.isComponentBlacklisted("ServiceInfo"))
      return null;

    const { service } = this.props.deepdetectStore;

    if (service == null) return null;

    const settings = service.settings;

    return (
      <div className="serviceinfo">
        <h5>
          <i className="fas fa-info-circle" /> Service Info
        </h5>
        <div className="block">
          <table className="table table-sm">
            <tbody>
              {Object.keys(settings).map((key, index) => {
                let value = settings[key];

                if (typeof value === "boolean") {
                  value = value ? "True" : "False";
                }

                return (
                  <tr key={index}>
                    <th scope="row">{key}</th>
                    <td>{value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
