import React from "react";
import { observer } from "mobx-react";
import Boundingbox from "react-bounding-box";
import seedrandom from "seedrandom";

@observer
export default class BoundingBox extends React.Component {
  constructor(props) {
    super(props);

    this.drawLabelSimple = this.drawLabelSimple.bind(this);
    this.drawLabelColor = this.drawLabelColor.bind(this);

    this.drawBoxSimple = this.drawBoxSimple.bind(this);
    this.drawBoxColor = this.drawBoxColor.bind(this);
  }

  drawLabelSimple(canvas, box) {
    return null;
  }

  drawLabelColor(canvas, box) {
    if (!box || typeof box === "undefined") return null;

    const ctx = canvas.getContext("2d");

    const coord = box.coord ? box.coord : box;

    let x = 0,
      y = 0;
    if (coord.xmin && coord.ymax) {
      x = coord.xmin;
      y = coord.ymax;
    } else if (coord.x && coord.y) {
      x = coord.x;
      y = coord.y;
    }

    var c = "0x" + box.color.substring(1);
    var rgba =
      "rgba(" + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") + ",0.8)";

    const label = box.label + " " + parseInt(box.prob * 100, 10) / 100;
    const fontSize = parseInt(canvas.width, 10) * 0.04;

    const measure = ctx.measureText(label);
    ctx.fillStyle = rgba;
    ctx.fillRect(x, y, measure.width + fontSize / 4, fontSize - 2);

    ctx.fillStyle = "#fff";
    ctx.miterLimit = 2;
    ctx.lineJoin = "circle";
    ctx.font = fontSize + "px sans-serif";

    ctx.lineWidth = 7;
    ctx.strokeText(label, x + 5, y + fontSize * 0.8);
    ctx.lineWidth = 1;
    ctx.fillText(label, x + 5, y + fontSize * 0.8);
  }

  drawBoxSimple(canvas, box, color, lineWidth) {
    if (!box || typeof box === "undefined") return null;

    const ctx = canvas.getContext("2d");

    const coord = box.coord ? box.coord : box;

    let [x, y, width, height] = [0, 0, 0, 0];
    if (coord.xmin && coord.xmax && coord.ymin && coord.ymax) {
      [x, y, width, height] = [
        Math.min(coord.xmin, coord.xmax),
        Math.min(coord.ymin, coord.ymax),
        Math.max(coord.xmin, coord.xmax) - Math.min(coord.xmin, coord.xmax),
        Math.max(coord.ymin, coord.ymax) - Math.min(coord.ymin, coord.ymax)
      ];
    } else if (coord.x && coord.y && coord.width && coord.height) {
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
    if (coord.xmin && coord.xmax && coord.ymin && coord.ymax) {
      [x, y, width, height] = [
        Math.min(coord.xmin, coord.xmax),
        Math.min(coord.ymin, coord.ymax),
        Math.max(coord.xmin, coord.xmax) - Math.min(coord.xmin, coord.xmax),
        Math.max(coord.ymin, coord.ymax) - Math.min(coord.ymin, coord.ymax)
      ];
    } else if (coord.x && coord.y && coord.width && coord.height) {
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

  generateColor(categoryName) {
    const random = seedrandom(categoryName);
    const r = Math.floor(random() * 255);
    const g = Math.floor(random() * 255);
    const b = Math.floor(random() * 255);

    var rgb = b | (g << 8) | (r << 16);
    return "#" + (0x1000000 + rgb).toString(16).slice(1);
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

    const classes = input.json.body.predictions[0].classes;

    let drawLabel = () => {},
      drawBox = this.drawBoxSimple,
      boxes = [];

    if (this.props.boxFormat === "simple") {
      boxes = input.boxes;
    } else if (classes) {
      if (this.props.showLabels) {
        drawLabel = this.drawLabelColor;
      }
      drawBox = this.drawBoxColor;

      boxes = input.json.body.predictions[0].classes.map(pred => {
        let box = pred.bbox ? pred.bbox : {};
        box.label = pred.cat ? pred.cat : "";
        box.prob = pred.prob;
        box.color = this.generateColor(pred.cat);
        return box;
      });
    }

    let segmentationColors = this.props.displaySettings.segmentationColors;
    let pixelSegmentation = input.json.body.predictions[0].vals;

    if (
      input.json.body.predictions[0].confidences &&
      input.json.body.predictions[0].confidences.best &&
      input.json.body.predictions[0].confidences.best.length > 0
    ) {
      segmentationColors = [
        "#67001f",
        "#b2182b",
        "#d6604d",
        "#f4a582",
        "#fddbc7",
        "#d1e5f0",
        "#92c5de",
        "#4393c3",
        "#2166ac",
        "#053061"
      ];
      pixelSegmentation = input.json.body.predictions[0].confidences.best.map(
        p => {
          return parseInt(p * 10, 10);
        }
      );
    }

    let segmentationMasks = [];
    if (classes && classes.some(c => c.mask !== null && c.mask !== undefined)) {
      segmentationMasks = classes.map(c => c.mask);

      boxes.forEach((b, index) => {
        let label = null;
        if (input.json.body.predictions[0].classes[index]) {
          label = input.json.body.predictions[0].classes[index].cat;
        }
        if (b !== null && typeof b !== "undefined") b.label = label;
      });
    }

    const separateSegmentation =
      (pixelSegmentation && pixelSegmentation.length > 0) ||
      segmentationMasks.length > 0;

    return (
      <Boundingbox
        className="boundingboxdisplay"
        image={this.props.content || input.content}
        boxes={boxes}
        selectedIndex={
          input.boxes && input.boxes.length > this.props.selectedBoxIndex
            ? this.props.selectedBoxIndex
            : -1
        }
        onSelected={this.props.onOver}
        pixelSegmentation={
          this.props.showSegmentation && pixelSegmentation
            ? pixelSegmentation
            : null
        }
        separateSegmentation={separateSegmentation}
        segmentationColors={segmentationColors}
        segmentationMasks={segmentationMasks}
        drawLabel={drawLabel}
        drawBox={drawBox}
      />
    );
  }
}
