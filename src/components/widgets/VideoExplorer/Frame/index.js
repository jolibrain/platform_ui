import React from "react";
import { observer } from "mobx-react";

@observer
class Frame extends React.Component {

    render() {

        const { frame, onFrameClick, selectors } = this.props;
        const { showLabel, cardTitle, cardSubtitle } = selectors;

        const title = frame.stats &&
            frame.stats[cardTitle] ?
            `${showLabel ? cardTitle : ''} ${frame.stats[cardTitle]}` : ''

        const subtitle = frame.stats &&
            frame.stats[cardSubtitle] ?
            `${showLabel ? cardSubtitle : ''} ${frame.stats[cardSubtitle]}` : ''

        const frameClassName = frame.isSelected ?
              "timeline-block active"
              :
              "timeline-block";

        return (
            <div
              key={ frame.id }
              className={ frameClassName }
              onClick={onFrameClick.bind(this, frame.id)}
            >
              <div className="marker"/>
              <div className="timeline-content">
                <h1>{title}</h1>
                <h2>{subtitle}</h2>
                <div className="text-center">
                    <img
                      src={frame.imageSrc.thumb}
                      alt={frame.imageAlt}
                      loading="lazy"
                      style={{width: '200px'}}
                    />
                </div>
              </div>
            </div>
        );
    }
};

export default Frame
