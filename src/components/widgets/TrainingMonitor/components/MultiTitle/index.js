import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import Title from "../Title";

@observer
export default class MultiTitle extends React.Component {
  render() {
    const { services } = this.props;

    return (
      <div>
        {services.map((service, index) => {
          return (
            <Title
              key={`title-${service.name}`}
              service={service}
              serviceIndex={index}
              hasTitle
            />
          );
        })}
      </div>
    );
  }
}

MultiTitle.propTypes = {
  services: PropTypes.array.isRequired
};
