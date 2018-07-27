import React from "react";
import Boundingbox from "react-bounding-box";

export default class BoundingBoxDisplay extends React.Component {
  render() {
    const input = this.props.input;

    if (
      !input ||
      !input.content ||
      !input.json ||
      !input.json.body ||
      !input.json.body.predictions ||
      !input.json.body.predictions[0]
    )
      return null;

    const inputVals = input.json.body.predictions[0].vals;

    return (
      <Boundingbox
        className="boundingboxdisplay"
        image={input.content}
        boxes={input.boxes}
        selectedIndex={
          input.boxes && input.boxes.length > this.props.selectedBoxIndex
            ? this.props.selectedBoxIndex
            : -1
        }
        onSelected={this.props.onOver}
        pixelSegmentation={inputVals ? inputVals : null}
        separateSegmentation={inputVals ? inputVals.length > 0 : false}
        segmentationColors={this.props.displaySettings.segmentationColors}
      />
    );
  }
}
