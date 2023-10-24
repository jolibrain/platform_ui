import React from "react";
import { observer } from "mobx-react";

const ToggleControl = observer(class ToggleControl extends React.Component {
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
});
export default ToggleControl;
