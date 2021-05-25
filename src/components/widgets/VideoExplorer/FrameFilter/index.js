import React from "react";
import { observer } from "mobx-react";

import SliderComponent from './FilterComponents/Slider'
import RangeComponent from './FilterComponents/Range'

import Slider, { SliderTooltip } from 'rc-slider';
const { Handle } = Slider;

const intHandler = props => {
    const { value, dragging, index, ...restProps } = props;
    return (
        <SliderTooltip
          prefixCls="rc-slider-tooltip"
          overlay={value}
          visible={dragging}
          placement="top"
          key={index}
        >
          <Handle value={value} {...restProps} />
        </SliderTooltip>
    );
};

const floatHandler = props => {
    const { value, dragging, index, ...restProps } = props;
    return (
        <SliderTooltip
          prefixCls="rc-slider-tooltip"
          overlay={value.toFixed(2)}
          visible={dragging}
          placement="top"
          key={index}
        >
          <Handle value={value.toFixed(2)} {...restProps} />
        </SliderTooltip>
    );
};

const percentHandler = props => {
    const { value, dragging, index, ...restProps } = props;
    return (
        <SliderTooltip
          prefixCls="rc-slider-tooltip"
          overlay={`${value} %`}
          visible={dragging}
          placement="top"
          key={index}
        >
          <Handle value={value} {...restProps} />
        </SliderTooltip>
    );
};

const tooltipHandlers = {
    "intHandler":     intHandler,
    "floatHandler":   floatHandler,
    "percentHandler": percentHandler,
}


@observer
class FrameFilter extends React.Component {

    render() {

        const {
            filterConfig
        } = this.props;

        let filterComponent = null;

        switch(filterConfig.filterComponent.type) {
            case "slider":
                filterComponent = (<SliderComponent
                                     tooltipHandlers={tooltipHandlers}
                                     {...this.props}
                                   />)
                break;
            case "range":
                filterComponent = (<RangeComponent
                                     tooltipHandlers={tooltipHandlers}
                                     {...this.props}
                                   />)
                break;
            default:
                break;
        }

        return (
            <div className="frameFilter form-group row">
              <legend className="col-form-label">
                {filterConfig.label}
              </legend>
              <br/>
              { filterComponent }
            </div>
        );
    }
};

export default FrameFilter
