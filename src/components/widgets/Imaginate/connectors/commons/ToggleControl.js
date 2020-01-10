import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

@observer
export default class ToggleControl extends React.Component {
  render() {
    const { title, onChange, value } = this.props;
    const elementId = `check-${Math.random()}`;
    return (
      <div className="custom-control custom-checkbox card">
        <div className="card-body">
          <input
            id={elementId}
            type="checkbox"
            className="custom-control-input"
            onChange={onChange}
            checked={value}
          />
          <label className="custom-control-label" htmlFor={elementId}>
            {title}
          </label>
        </div>
      </div>
    );
  }
}

ToggleControl.propTypes = {
  title: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool
};
