import React from "react";
import { observer } from "mobx-react";

import Slider from 'rc-slider';

@observer
class SliderComponent extends React.Component {

    render() {

        const {
            filterConfig,
            handleFilterChange,
            tooltipHandlers
        } = this.props;

        const { filterComponent } = filterConfig;

        return (
            <Slider
              handle={tooltipHandlers[filterComponent.tooltipHandler]}
              onAfterChange={handleFilterChange.bind(this, filterConfig)}
            />
        );
    }
};

export default SliderComponent
