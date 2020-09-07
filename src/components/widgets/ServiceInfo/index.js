import React from "react";
import { inject, observer } from "mobx-react";

@inject("deepdetectStore")
@inject("configStore")
@observer
class ServiceInfo extends React.Component {
  render() {
    if (this.props.configStore.isComponentBlacklisted("ServiceInfo"))
      return null;

    const { service } = this.props.deepdetectStore;

    if (!service) return null;

    const settings = service.settings;

    return (
      <div className="serviceinfo">
        <h5>
          <i className="fas fa-cube" /> {service.name}
        </h5>
        <h6>{service.settings.description}</h6>
        <div className="block list-group list-group-flush">
          {Object.keys(settings)
            .filter(key => {
              return !["name", "description"].includes(key);
            })
            .map((key, index) => {
              let value = settings[key];

              if (typeof value === "boolean") {
                value = value ? "True" : "False";
              } else if (typeof value === "object") {
                value = JSON.stringify(value);
              }

              return (
                <li
                  key={index}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {key}
                  <b>{value}</b>
                </li>
              );
            })}
        </div>
      </div>
    );
  }
}
export default ServiceInfo;
