import React from "react";
import { observer } from "mobx-react";

import Slider, { createSliderWithTooltip } from "rc-slider";
import "rc-slider/assets/index.css";
const SliderWithTooltip = createSliderWithTooltip(Slider);

const ParamSlider = observer(class ParamSlider extends React.Component {
  render() {
    if (typeof this.props.defaultValue === "undefined") return null;

    return (
      <div className="card slider">
        <div className="card-body">
          <p className="card-title">{this.props.title}</p>
          <SliderWithTooltip {...this.props} />
        </div>
      </div>
    );
  }
});
export default ParamSlider;
