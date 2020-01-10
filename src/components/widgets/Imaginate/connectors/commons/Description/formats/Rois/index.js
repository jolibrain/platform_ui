import React from "react";
import PropTypes from "prop-types";
import { observer } from "mobx-react";

import Boundingbox from "react-bounding-box";

@observer
export default class Rois extends React.Component {
  constructor(props) {
    super(props);

    this.roisItem = this.roisItem.bind(this);
  }

  roisItem(category, index) {
    const { selectedBoxIndex } = this.props;
    const percent = parseInt(category.prob * 100, 10);
    const progressStyle = { width: `${percent}%` };

    let progressBg = "bg-success";
    let selectedBoxColor = "#31a354";

    if (percent < 60) {
      progressBg = "bg-warning";
      selectedBoxColor = "#a1d99b";
    }

    if (percent < 30) {
      progressBg = "bg-danger";
      selectedBoxColor = "#e5f5e0";
    }

    if (selectedBoxIndex === index) {
      progressBg = "bg-info";
    }

    return (
      <div key={index} className="col progress-nns">
        <Boundingbox
          key={`category-${Math.random()}`}
          image={category.uri}
          boxes={[
            {
              coord: [
                category.bbox.xmin,
                category.bbox.ymax,
                category.bbox.xmax - category.bbox.xmin,
                category.bbox.ymin - category.bbox.ymax
              ]
            }
          ]}
          options={{
            colors: {
              normal: "#ffffff",
              selected: selectedBoxColor
            }
          }}
          drawBox={(canvas, box, color) => {
            const ctx = canvas.getContext("2d");

            const coord = box.coord ? box.coord : box;
            let [x, y, width, height] = coord;

            ctx.strokeStyle = color;
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.lineTo(x, y);
            ctx.lineTo(x, y + height);
            ctx.lineTo(x + width, y + height);
            ctx.lineTo(x + width, y);
            ctx.lineTo(x, y);
            ctx.stroke();
          }}
        />
        <div
          className={`progress-bar ${progressBg}`}
          role="progressbar"
          style={progressStyle}
          aria-valuenow={percent}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {percent}
        </div>
      </div>
    );
  }

  render() {
    const { input, selectedBoxIndex } = this.props;

    const prediction = input.json.body.predictions[0];

    if (!prediction) return null;

    const source = prediction.rois;

    if (source.length === 0 || !source[selectedBoxIndex]) return null;

    const { nns } = source[selectedBoxIndex];

    let cells = nns
      .slice()
      .map(this.roisItem)
      .reduce((result, element, index, array) => {
        // Add 2-columns separators
        result.push(element);
        if ((index + 1) % 2 === 0) {
          result.push(<div key={`sep-${index}`} className="w-100" />);
        }
        return result;
      }, []);

    // Add empty column to fill row
    if (cells.length % 2 === 1)
      cells.push(<div key={`empty-${Math.random()}`} className="col" />);

    return <div className="description-rois row">{cells}</div>;
  }
}

Rois.propTypes = {
  input: PropTypes.object.isRequired,
  selectedBoxIndex: PropTypes.number
};
