import React from "react";
import { observer } from "mobx-react";

@observer
class Frame extends React.Component {

  constructor(props) {
    super(props);

    this.formatSubtitles = this.formatSubtitles.bind(this);
  }

  formatSubtitles() {
    const { frame, selectors } = this.props;
    const { showLabel, cardSubtitle } = selectors;

    let subtitles = "";

    if( Array.isArray(cardSubtitle) ) {

      subtitles = cardSubtitle.map(subtitle => {
        let value = frame[subtitle.statsKey];

        let label = '';

        if(showLabel) {
          label = subtitle.label

          if(Array.isArray(frame[subtitle.statsKey])) {
            label += ` (${frame[subtitle.statsKey].length})`
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
      const value = frame[cardSubtitle.statsKey];
      subtitles = value ?
        `${showLabel ? cardSubtitle.label : ''} ${value}`
        : ''
    }

    return subtitles;
  }

  render() {

    const { frame, onFrameClick, selectors } = this.props;
    const { showLabel, cardTitle } = selectors;

    const title = frame[cardTitle] ?
          `${showLabel ? cardTitle : ''} ${parseFloat(frame[cardTitle]).toFixed(3)}`
          : ''

    const subtitle = this.formatSubtitles();

    const frameClassName = frame.isSelected ?
          "timeline-block active"
          :
          "timeline-block";

    return (
      <div
        key={ frame.id }
        className={ frameClassName }
        onClick={onFrameClick.bind(this, frame.fname)}
      >
        <div className="marker"/>
        <div className="timeline-content">
          <h1>{title} - Frame {parseInt(frame.fname.split("/").pop().replace(".jpg", ""))}</h1>
          {
            typeof subtitle.map !== "undefined" ?
              subtitle.map((v, index) => <h2 key={index}>{v}</h2>)
            : null
          }
          <div className="text-center">
            <img
              src={frame.fname.replace("/frames/", "/thumbs/")}
              alt={parseInt(frame.fname.split("/").pop().replace(".jpg", ""))}
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
