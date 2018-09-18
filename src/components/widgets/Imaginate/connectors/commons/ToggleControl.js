import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

@observer
export default class ToggleControl extends React.Component {
  render() {
    const { key, title, onChange, value } = this.props;
    const elementId = `check-${key}`;
    return (
      <div className="custom-control custom-checkbox">
        <input
          type="checkbox"
          className="custom-control-input"
          id={elementId}
          onChange={onChange}
          checked={value}
        />
        <label className="custom-control-label" htmlFor={elementId}>
          {title}
        </label>
      </div>
    );
  }
}

ToggleControl.propTypes = {
  attr: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool
};
