import React from "react";
import { LazyLoadImage } from 'react-lazy-load-image-component';

const Frame = class Frame extends React.Component {

  constructor(props) {
    super(props);

    this.formatSubtitles = this.formatSubtitles.bind(this);
  }

  formatSubtitles() {
    const { frame, selectors } = this.props;
    const { showLabel, cardSubtitle } = selectors;

    let subtitles = "";

    // Frame json stat is not available
    if(!frame.stats)
      return subtitles;

    if( Array.isArray(cardSubtitle) ) {

      subtitles = cardSubtitle.map(subtitle => {
        let value = frame.stats[subtitle.statsKey];

        let label = '';

        if(showLabel) {
          label = subtitle.label

          if(Array.isArray(frame.stats[subtitle.statsKey])) {
            label += ` (${frame.stats[subtitle.statsKey].length})`
          }
        }

        const separator = subtitle.separator || " - ";

        switch(subtitle.format){
            case 'leftRightPercentArray':
            value = value.slice()
                .sort((a, b) => a - b)
                .map(v => {
                  return `${v > 0 ? 'right' : 'left'}: ${Math.abs(parseInt(v * 100))}/100`;
                })
                .join(separator)
              break;
            default:
              break;
        }

        return value ? `${label}: ${value}` : ''
      })

    } else {
      const value = frame.stats[cardSubtitle.statsKey];
      subtitles = value ? `${showLabel ? cardSubtitle.label : ''} ${value}` : ''
    }

    return subtitles;
  }

  render() {

    const { frame, onFrameClick, selectors } = this.props;
    const { showLabel, cardTitle } = selectors;

    const title = frame.stats &&
          frame.stats[cardTitle] ?
          `${showLabel ? cardTitle : ''} ${frame.stats[cardTitle]}` : ''

    const subtitle = this.formatSubtitles();

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
          <h1>{title} - Frame {frame.index}</h1>
          {
            subtitle.map((v, index) => <h2 key={index}>{v}</h2>)
          }
          <div className="text-center">
            <LazyLoadImage
              alt={frame.index}
              src={frame.imageSrc.thumb}
              width={200} />
          </div>
        </div>
      </div>
    );
  }
};
export default Frame
