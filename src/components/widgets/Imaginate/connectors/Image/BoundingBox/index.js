import React from "react";
import { observer } from "mobx-react";
import Controls from "./Controls";
import Boundingbox from "react-bounding-box";

@observer
export default class BoundingBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      boxFormat: "simple"
    };

    this.setBoxFormat = this.setBoxFormat.bind(this);

    this.drawLabelSimple = this.drawLabelSimple.bind(this);
    this.drawLabelColor = this.drawLabelColor.bind(this);

    this.drawBoxSimple = this.drawBoxSimple.bind(this);
    this.drawBoxColor = this.drawBoxColor.bind(this);
  }

  setBoxFormat(format) {
    this.setState({ boxFormat: format });
  }

  drawLabelSimple(canvas, box) {
    return null;
  }

  drawLabelColor(canvas, box) {
    if (!box || typeof box === "undefined") return null;

    const ctx = canvas.getContext("2d");

    const coord = box.coord ? box.coord : box;

    let [x, y, width, height] = [0, 0, 0, 0];
    if (coord.xmin) {
      [x, y, width, height] = [
        coord.xmin,
        coord.ymax,
        coord.xmax - coord.xmin,
        coord.ymin - coord.ymax
      ];
    } else {
      [x, y, width, height] = coord;
    }

    var c = "0x" + box.color.substring(1);
    var rgba =
      "rgba(" + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") + ",0.8)";

    const measure = ctx.measureText(box.label);
    ctx.fillStyle = rgba;
    ctx.fillRect(x, y, measure.width + 10, 37);

    ctx.fillStyle = "#fff";
    ctx.miterLimit = 2;
    ctx.lineJoin = "circle";
    ctx.font = "40px Helvetica";

    ctx.lineWidth = 7;
    ctx.strokeText(box.label, x + 5, y + 32);
    ctx.lineWidth = 1;
    ctx.fillText(box.label, x + 5, y + 32);
  }

  drawBoxSimple(canvas, box, color, lineWidth) {
    if (!box || typeof box === "undefined") return null;

    const ctx = canvas.getContext("2d");

    const coord = box.coord ? box.coord : box;

    let [x, y, width, height] = [0, 0, 0, 0];
    if (coord.xmin) {
      [x, y, width, height] = [
        coord.xmin,
        coord.ymax,
        coord.xmax - coord.xmin,
        coord.ymin - coord.ymax
      ];
    } else {
      [x, y, width, height] = coord;
    }

    if (x < lineWidth / 2) {
      x = lineWidth / 2;
    }
    if (y < lineWidth / 2) {
      y = lineWidth / 2;
    }

    if (x + width > canvas.width) {
      width = canvas.width - lineWidth - x;
    }
    if (y + height > canvas.height) {
      height = canvas.height - lineWidth - y;
    }

    // Left segment
    const tenPercent = width / 10;
    const ninetyPercent = 9 * tenPercent;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x + tenPercent, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x + tenPercent, y + height);
    ctx.stroke();

    // Right segment
    ctx.beginPath();
    ctx.moveTo(x + ninetyPercent, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + ninetyPercent, y + height);
    ctx.stroke();
  }

  drawBoxColor(canvas, box, color, lineWidth) {
    if (!box || typeof box === "undefined") return null;

    const ctx = canvas.getContext("2d");

    const coord = box.coord ? box.coord : box;

    let [x, y, width, height] = [0, 0, 0, 0];
    if (coord.xmin) {
      [x, y, width, height] = [
        coord.xmin,
        coord.ymax,
        coord.xmax - coord.xmin,
        coord.ymin - coord.ymax
      ];
    } else {
      [x, y, width, height] = coord;
    }

    if (x < lineWidth / 2) {
      x = lineWidth / 2;
    }
    if (y < lineWidth / 2) {
      y = lineWidth / 2;
    }

    if (x + width > canvas.width) {
      width = canvas.width - lineWidth - x;
    }
    if (y + height > canvas.height) {
      height = canvas.height - lineWidth - y;
    }

    var c = "0x" + box.color.substring(1);
    var rgba =
      "rgba(" + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") + ",0.8)";
    ctx.strokeStyle = rgba;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

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

    let drawLabel = null,
      drawBox = null,
      boxes = [];

    if (this.state.boxFormat === "simple") {
      drawLabel = this.drawLabelSimple;
      drawBox = this.drawBoxSimple;

      boxes = input.json.body.predictions[0].classes.map(pred => {
        return pred.bbox;
      });
    } else {
      drawLabel = this.drawLabelColor;
      drawBox = this.drawBoxColor;

      const colors = [
        "#e41a1c",
        "#377eb8",
        "#4daf4a",
        "#984ea3",
        "#ff7f00",
        "#ffff33",
        "#a65628",
        "#f781bf",
        "#999999"
      ];
      const categories = input.json.body.predictions[0].classes
        .map(pred => pred.cat)
        .filter((value, index, self) => self.indexOf(value) === index);

      boxes = input.json.body.predictions[0].classes.map(pred => {
        let box = pred.bbox;
        box.label = pred.cat;
        box.color = colors[categories.indexOf(pred.cat) % colors.length];
        return box;
      });
    }

    return (
      <div>
        <Controls
          handleClickBox={this.setBoxFormat.bind(this, "simple")}
          handleClickPalette={this.setBoxFormat.bind(this, "color")}
        />
        <Boundingbox
          className="boundingboxdisplay"
          image={input.content}
          boxes={boxes}
          selectedIndex={
            input.boxes && input.boxes.length > this.props.selectedBoxIndex
              ? this.props.selectedBoxIndex
              : -1
          }
          onSelected={this.props.onOver}
          pixelSegmentation={inputVals ? inputVals : null}
          separateSegmentation={inputVals ? inputVals.length > 0 : false}
          segmentationColors={this.props.displaySettings.segmentationColors}
          drawLabel={drawLabel}
          drawBox={drawBox}
        />
      </div>
    );
  }
}
