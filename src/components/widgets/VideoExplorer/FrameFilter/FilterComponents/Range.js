import React from "react";

import Slider from 'rc-slider';
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

const RangeComponent = class RangeComponent extends React.Component {

    render() {

        const {
            stats,
            filterConfig,
            handleFilterChange,
            tooltipHandlers,
        } = this.props;

        const { filterComponent } = filterConfig;

        let defaultMin = filterComponent.limits[0],
            defaultMax = filterComponent.limits[1];

        if(typeof filterComponent.statKeyLimits !== "undefined") {
            defaultMin = stats[filterComponent.statKeyLimits[0]];
            defaultMax = stats[filterComponent.statKeyLimits[1]];
        }

        return (
            <Range
              handle={tooltipHandlers[filterComponent.tooltipHandler]}
              min={defaultMin}
              max={defaultMax}
              defaultValue={[defaultMin, defaultMax]}
              step={filterComponent.step ? filterComponent.step : 1}
              onAfterChange={handleFilterChange.bind(this, filterConfig)}
            />
        );
    }
};
export default RangeComponent
